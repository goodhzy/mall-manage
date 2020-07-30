import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, message, Divider, Switch, Modal } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import SetPermissonForm from './components/setPermissonForm';
import { queryUserList, putUserType, addUser, putUser, delUser,setUserPer } from './service';
import styles from './style.less';

/**
 * 添加节点
 * @param fields
 */

const handleAdd = async (fields) => {
  try {
    await addUser({ ...fields });
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
    await putUser(fields);
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
    content: '是否删除该条用户数据',
    onOk: async () => {
      try {
        await delUser(id);
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
 * 改变用户状态
 * @param uId 用户id
 * @param type 状态值
 */

const onTypeChange = async (uId, type) => {
  try {
    const res = await putUserType({ uId, type });
    if (res.meta.status === 200) {
      message.success('更新用户状态成功');
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * 设置用户角色
 * @param id 用户id
 * @param rid 角色id
 */
const handleSetPer = async ({id,rid})=>{
  try {
    await setUserPer({id,rid})
    message.success('更新权限成功')
    return true
  } catch (error) {
    return false
  }
}


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
      title: (_, type) => (type === 'table' ? '账号' : '用户账号'),
      dataIndex: 'username',
      rules: [
        {
          required: true,
          message: '用户账号为必填项',
        },
      ],
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      hideInSearch: true,
    },
    {
      title: '电话',
      dataIndex: 'mobile',
      hideInSearch: true,
    },
    {
      title: '权限',
      dataIndex: 'role_name',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '状态',
      dataIndex: 'mg_state',
      hideInForm: true,
      hideInSearch: true,
      render: (_, { id: uId, mg_state }) => (
        <Switch
          defaultChecked={!!mg_state}
          onChange={(checked) => {
            onTypeChange(uId, checked);
          }}
        />
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
          <Divider type="vertical" />
          <a
            onClick={() => {
              handlePerModalVisible(true);
              setFormValues(record);
            }}
          >
            权限
          </a>
        </>
      ),
    },
  ];
  const restCreateColumns = [
    {
      title: '用户密码',
      dataIndex: 'password',
      hideInSearch: true,
      rules: [
        {
          required: true,
          message: '用户密码为必填项',
        },
      ],
    },
  ];

  return (
    <PageHeaderWrapper>
      <ProTable
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          <Button type="primary" onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={(params, sorter, filter) => queryUserList({ ...params, sorter, filter })}
        columns={columns}
        rowSelection={{}}
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
            rowSelection={{}}
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
        >
        </SetPermissonForm>
      )}
    </PageHeaderWrapper>
  );
};

export default TableList;
