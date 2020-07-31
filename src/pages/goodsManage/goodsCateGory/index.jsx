import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Divider, Modal, Tag, Cascader } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import {
  queryCategoriesList,
  queryCategoriesListAll,
  addCategory,
  putCategory,
  delCategory
} from './service';

/**
 * 添加节点
 * @param fields
 */

const handleAdd = async (fields) => {
  let reqData = {};
  if ('fatherCategory' in fields) {
    reqData = {
      cat_name: fields.cat_name,
      cat_pid: fields.fatherCategory[fields.fatherCategory.length - 1],
      cat_level: fields.fatherCategory.length,
    };
  } else {
    reqData = {
      cat_name: fields.cat_name,
      cat_pid: 0,
      cat_level: 0,
    };
  }
  try {
    await addCategory(reqData);
    message.success('添加成功');
    return true;
  } catch (error) {
    return false;
  }
};
/**
 * 更新节点
 * @param fields
 */

const handleUpdate = async (fields) => {
  try {
    await putCategory(fields);
    message.success('修改成功');
    return true;
  } catch (error) {
    return false;
  }
};
/**
 *  删除节点
 * @param selectedRows
 */

const handleDel = async ({ cat_id }, actionRef) => {
  Modal.confirm({
    content: '此操作将永久删除该分类, 是否继续?',
    onOk: async () => {
      try {
        await delCategory(cat_id);
        message.success('删除成功，即将刷新');
        actionRef.current.reload();
        return true;
      } catch (error) {
        return false;
      }
    },
  });
};

const TableList = () => {
  const [createModalVisible, handleModalVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [FormValues, setFormValues] = useState({});
  const [fatherCategoryData, setFatherCategoryData] = useState([]);
  const actionRef = useRef();
  const columns = [
    {
      title: '#',
      dataIndex: 'cat_id',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '分类名称',
      dataIndex: 'cat_name',
      rules: [
        {
          required: true,
          message: '请输入分类名称',
        },
      ],
    },
    {
      title: '是否有效',
      dataIndex: 'cat_deleted',
      hideInSearch: true,
      hideInForm: true,
      initialValue: '0',
      valueEnum: {
        true: {
          text: '无效',
          status: 'Error',
        },
        false: {
          text: '有效',
          status: 'Success',
        },
      },
    },
    {
      title: '排序',
      dataIndex: 'cat_level',
      hideInForm: true,
      hideInSearch: true,
      render: (_, { cat_level }) => (
        <>
          {cat_level === 0 && <Tag color="cyan">一级</Tag>}
          {cat_level === 1 && <Tag color="green">二级</Tag>}
          {cat_level === 2 && <Tag color="orange">三级</Tag>}
        </>
      ),
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
              handleDel(record, actionRef);
            }}
          >
            删除
          </a>
        </>
      ),
    },
  ];

  const onPopupVisibleChange = async (value) => {
    if (value) {
      try {
        let res = await queryCategoriesListAll({ current: null, pageSize: null });
        let arr = [];
        res.data.forEach((item1) => {
          item1.value = item1.cat_id;
          item1.label = item1.cat_name;
          arr.push(item1);
          if (item1.children) {
            item1.children.forEach((item2) => {
              item2.value = `${item2.cat_id}`;
              item2.label = item2.cat_name;
              delete(item2.children)
            });
          }
        });
        setFatherCategoryData(arr);
      } catch (error) {
        console.error(error);
      }
    }
  };
  const restCreateColumns = [
    {
      title: '父级分类',
      dataIndex: 'fatherCategory',
      hideInSearch: true,
      renderFormItem: (_, { type, defaultRender, ...rest }) => {
        return (
          <Cascader
            {...rest}
            options={fatherCategoryData}
            changeOnSelect
            placeholder="未选择默认为第一级"
            onPopupVisibleChange={onPopupVisibleChange}
          />
        );
      },
    },
  ];
  return (
    <PageHeaderWrapper>
      <ProTable
        actionRef={actionRef}
        rowKey="cat_id"
        toolBarRender={() => [
          <Button type="primary" onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={(params, sorter, filter) => queryCategoriesList({ ...params, sorter, filter })}
        columns={columns}
      />
      {createModalVisible && (
        <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
          <ProTable
            onSubmit={async (value) => {
              const success = await handleAdd(value);

              if (success) {
                handleModalVisible(false);

                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            }}
            rowKey="key"
            type="form"
            columns={[...columns, ...restCreateColumns]}
          />
        </CreateForm>
      )}

      {updateModalVisible && FormValues && Object.keys(FormValues).length ? (
        <UpdateForm
          onSubmit={async (value) => {
            const success = await handleUpdate(value);

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
    </PageHeaderWrapper>
  );
};

export default TableList;
