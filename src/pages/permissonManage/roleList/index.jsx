import { PlusOutlined } from '@ant-design/icons';
import { Row, Col,Tag, Space,Table, Button, message, Divider, Modal } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import SetPermissonForm from './components/setPermissonForm';
import { queryRoleList, addRole, putRole, delRole,setRolesPer,delRolePer } from './service';
import style from './style.less'

/**
 * 添加节点
 * @param fields
 */

const handleAdd = async (fields) => {
  try {
    await addRole({ ...fields });
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
    await putRole(fields);
    message.success('编辑成功');
    return true;
  } catch (error) {
    message.error('配置失败请重试！');
    return false;
  }
};
/**
 *  删除节点
 * @param selectedRows
 */

const handleDel = async ({ id }, actionRef) => {
  Modal.confirm({
    content: '此操作将永久删除该角色, 是否继续?',
    onOk: async () => {
      try {
        await delRole(id);
        message.success('删除成功，即将刷新');
        actionRef.current.reload();
        return true;
      } catch (error) {
        return false;
      }
    },
  });
};

/**
 * 设置用户角色
 * @param id 用户id
 * @param rid 角色id
 */
const handleSetPer = async ({ id, checkedKeys:rids }) => {
  try {
    await setRolesPer({ id, rids:rids.join(',') });
    message.success('更新权限成功');
    return true;
  } catch (error) {
    console.error(error)
    return false;
  }
};

const TableList = () => {
  const [createModalVisible, handleModalVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [perModalVisible, handlePerModalVisible] = useState(false);
  const [FormValues, setFormValues] = useState({});
  const actionRef = useRef();
  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      hideInSearch: true,
      rules: [
        {
          required: true,
          message: '请输入角色名称',
        },
      ],
    },
    {
      title: '角色描述',
      dataIndex: 'roleDesc',
      hideInSearch: true,
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
          <Divider type="vertical" />
          <a
            onClick={() => {
              handlePerModalVisible(true);
              setFormValues(record);
            }}
          >
            分配权限
          </a>
        </>
      ),
    },
  ];
  const onTabClose = async(rid,pid)=>{
    try {
      await delRolePer(rid,pid)
      actionRef.current && actionRef.current.reload()
    } catch (error) {
        console.error(error)
    }
  }
  const expandedContent = (record) => {
    return (
      <>
      {
        record.children.map(item1=>{
          return <Row
          align="middle"
          justify="center"
          key={item1.id}
            >
              <Col span={5} push={2}>
                <Tag color="cyan" closable onClose={()=>{onTabClose(record.id,item1.id)}}>{item1.authName}</Tag>
              </Col>
              <Col span={19}>
                {item1.children.map(item2=>{
                  return <Row
                  key={item2.id}
                  align="middle"
                  justify="center"
                >
                  <Col span={6} push={2}>
                    <Tag color="green" closable onClose={()=>{onTabClose(record.id,item2.id)}}>{item2.authName }</Tag>
                  </Col>
                  <Col span={16} push={2}>
                    {
                      item2.children.map(item3=>{
                        return <Tag color="gold" key={item3.id} closable onClose={()=>{onTabClose(record.id,item3.id)}} style={{marginBottom:`10px`}}>{ item3.authName}</Tag>
                      })
                    }
                  </Col>
                </Row>
                })}
              </Col>
            </Row> 
        })
      }
      </>
    );
  };

  return (
    <PageHeaderWrapper>
      <ProTable
        actionRef={actionRef}
        rowKey="id"
        request={(params, sorter, filter) => queryRoleList({ ...params, sorter, filter })}
        columns={columns}
        toolBarRender={() => [
          <Button type="primary" onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> 新建
          </Button>,
        ]}
        pagination={false}
        search={false}
        expandable={{
          childrenColumnName: [],
          expandedRowRender: (record) => expandedContent(record),
          rowExpandable: () => {
            return true;
          },
        }}
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
            columns={columns}
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
      {perModalVisible && (
        <SetPermissonForm
          perModalVisible={perModalVisible}
          values={FormValues}
          onSubmit={async (value) => {
            const success = await handleSetPer(value);
            if (success) {
              handlePerModalVisible(false);
              setFormValues({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handlePerModalVisible(false);
            setFormValues({});
          }}
        />
      )}
    </PageHeaderWrapper>
  );
};

export default TableList;
