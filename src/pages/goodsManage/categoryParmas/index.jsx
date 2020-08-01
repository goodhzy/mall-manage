import { PlusOutlined } from '@ant-design/icons';
import { Divider,Tag, Input, Spin, Tabs, Space, Cascader, Alert, Button, message, Modal } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { queryAttributesList,addAttributes,delAttributes, queryAttrParmasList, putAttrParmas } from './service';
import { queryCategoriesListAll } from '../goodsCateGory/service';

const { TabPane } = Tabs;

/**
 * 添加节点
 * @param fields
 */

const handleAdd = async (fields) => {
  try {
    await addAttributes({ ...fields,attr_sel:'many' });
    message.success('添加成功');
    return true;
  } catch (error) {
    console.log(error)
    return false;
  }
};
/**
 * 更新节点
 * @param fields
 */

const handleUpdate = async ({catId,...fields}) => {
  try {
    const reqData = {
      catId,
      attrId: fields.attr_id,
      attr_name: fields.attr_name,
      attr_sel: 'many',
    };
    await putAttrParmas(reqData);
    message.success('编辑成功');
    return true;
  } catch (error) {
    console.error(error)
    return false;
  }
};
/**
 *  删除节点
 * @param selectedRows
 */

const handleDel = async ({ catId,attr_id }, actionRef) => {
  Modal.confirm({
    content: '此操作将永久删除该数据, 是否继续?',
    onOk: async () => {
      try {
        await delAttributes({catId,attr_id});
        message.success('删除成功');
        actionRef.current.reload();
        return true;
      } catch (error) {
        console.error(error)
        return false;
      }
    },
  });
};


const TableList = () => {
  const [createModalVisible, handleModalVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [FormValues, setFormValues] = useState({});
  const [categoryData, setCategoryData] = useState([]);
  const [activeKey, setActiveKey] = useState('1');
  const [catId, setCatId] = useState();
  const [catAttrParmas, setCatAttrParmas] = useState({});
  const [modal, setModal] = useState(true);
  const actionRef = useRef();
  const columns = [
    {
      title: '#',
      dataIndex: 'attr_id',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '参数名称',
      dataIndex: 'attr_name',
      hideInSearch: true,
      rules:[
        {required: true,
        message: '请输入参数名称'}
      ]
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              handleUpdateModalVisible(true);
              setFormValues(record);
            }}
          >
            编辑
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              handleDel({catId,...record}, actionRef);
            }}
          >
            删除
          </a>
        </>
      ),
    },
  ];
  const getCatData = async () => {
    try {
      const res = await queryCategoriesListAll();
      setCategoryData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const onExpand = async (expanded, record) => {
    if (expanded) {
      try {
        setCatAttrParmas(res.data.attr_vals);
      } catch (error) {
        console.log(error)
      }
    }
  };

  const onCascaderChange = (value) => {
    setModal(value.length !== 3);
    if (value.length === 3) {
      setCatId(value[2]);
    }
  };
  const onTabChange = (key) => {
    console.log(key);
    console.log(activeKey);
  };
  const onTabClick = (key) => {
    setActiveKey(key);
  };
  const onAttrInputConfirm = async (e, record) => {
    try {
      const { value } = e.target;
      if(value==='')return
      if(catAttrParmas && catAttrParmas.split(',').find((item)=>item===value)){
        return message.error('已存在该属性了')
      }
      const reqData = {
        catId,
        attrId: record.attr_id,
        attr_name: record.attr_name,
        attr_vals: `${catAttrParmas ? catAttrParmas+',' : ''}${value}`,
        attr_sel: 'many',
      };
      await putAttrParmas(reqData);
      setCatAttrParmas(reqData.attr_vals)
    } catch (error) {
      console.error(error);
    }
  };
  const onTagClose = async (value,record,actionRef) => {
    try {
      let catAttrParmasTemp = catAttrParmas
      const values = catAttrParmasTemp.split(',').filter((item) => item !== value);
      const reqData = {
        catId,
        attrId: record.attr_id,
        attr_name: record.attr_name,
        attr_vals: values.join(','),
        attr_sel: 'many',
      };
    await putAttrParmas(reqData)
    setCatAttrParmas(reqData.attr_vals)
    // actionRef.current && actionRef.current.reload()
    } catch (error) {
      console.log(error)
    }
    
  };
  useEffect(() => {
    getCatData();
  }, []);
  useEffect(() => {
    if (catId && actionRef.current) {
      actionRef.current.reloadAndRest();
    }
  }, [catId]);

  /**
   * 表格展开内容
   */

  const expandedRowContent = ({ record,actionRef }) => {
    return (
      <Space size="middle">
        {record.attr_vals &&  record.attr_vals.split(',').map((item,index) => {
          return (
            <Tag
              key={item}
              color="blue"
              closable
              onClose={() => {
                onTagClose(item,record,actionRef);
              }}
            >
              {item}
            </Tag>
          );
        })}
        <div style={{ width: `100px` }}>
          <Input
            size="small"
            allowClear={false}
            placeholder="添加属性"
            onBlur={(e) => {
              onAttrInputConfirm(e, record);
            }}
            onPressEnter={(e) => {
              onAttrInputConfirm(e, record);
            }}
          />
        </div>
      </Space>
    );
  };

  return (
    <PageHeaderWrapper>
      <Alert message="注意:只允许为第三级分类设置相关参数!" banner />
      <div style={{ padding: `24px` }}>
        <Space size="large">
          请选择要编辑修改参数的商品:
          <Cascader
            fieldNames={{ label: 'cat_name', value: 'cat_id', children: 'children' }}
            options={categoryData}
            style={{ width: `250px` }}
            onChange={onCascaderChange}
          />
        </Space>
      </div>
      <Spin tip="当选择第三级分类显示" spinning={modal} indicator={<></>}>
        <Tabs activeKey={activeKey} onChange={onTabChange} onTabClick={onTabClick}>
          <TabPane tab="动态参数" key="1"></TabPane>
          <TabPane tab="静态属性" key="2"></TabPane>
        </Tabs>
        {!modal && (
          <ProTable
            actionRef={actionRef}
            rowKey="attr_id"
            toolBarRender={() => [
              <Button type="primary" onClick={() => handleModalVisible(true)}>
                <PlusOutlined /> 新建
              </Button>,
            ]}
            request={(params, sorter, filter) =>
              queryAttributesList({ catId, ...{ sel: 'many' }, ...params, sorter, filter })
            }
            columns={columns}
            search={false}
            expandable={{
              expandedRowRender: (record) => expandedRowContent({ record,actionRef }),
              onExpand: (expanded, record) => {
                onExpand(expanded, record);
              },
            }}
          />
        )}

        {createModalVisible && (
          <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
            <ProTable
              onSubmit={async (value) => {
                const success = await handleAdd({catId,...value});

                if (success) {
                  handleModalVisible(false);

                  if (actionRef.current) {
                    actionRef.current.reload();
                  }
                }
              }}
              rowKey="cat_id"
              type="form"
              columns={columns}
            />
          </CreateForm>
        )}

        {updateModalVisible && FormValues && Object.keys(FormValues).length ? (
          <UpdateForm
            onSubmit={async (value) => {
              const success = await handleUpdate({catId,...value});

              if (success) {
                handleUpdateModalVisible(false);
                setFormValues({});

                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            }}
            onCancel={() => {
              handleUpdateModalVisible(false);
              setFormValues({});
            }}
            updateModalVisible={updateModalVisible}
            values={FormValues}
          />
        ) : null}
      </Spin>
    </PageHeaderWrapper>
  );
};

export default TableList;
