import { PlusOutlined } from '@ant-design/icons';
import { Row, Space, Cascader, Alert, Button, message, Divider, Switch, Modal } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import SetPermissonForm from './components/setPermissonForm';
import { queryUserList, putUserType, addUser, putUser, delUser, setUserPer } from './service';
import { queryCategoriesListAll } from '../goodsCateGory/service';
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
    content: '此操作将永久删除该用户, 是否继续?',
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

const TableList = () => {
  const [createModalVisible, handleModalVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [perModalVisible, handlePerModalVisible] = useState(false);
  const [FormValues, setFormValues] = useState({});
  const [categoryData, setCategoryData] = useState([]);
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
  const getCatData = async () => {
    try {
      let res = await queryCategoriesListAll();
      setCategoryData(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCatData();
  }, []);

  return (
    <PageHeaderWrapper>
      <Alert message="注意:只允许为第三级分类设置相关参数!" banner />
      <div style={{padding:`24px`}}>
        <Space  size="large">
          请选择要编辑修改参数的商品:
          <Cascader
            fieldNames={{ label: 'cat_name', value: 'cat_id', children: 'children' }}
            options={categoryData}
            style={{ width: `250px` }}
          />
        </Space>
      </div>

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
        />
      )}
    </PageHeaderWrapper>
  );
};

export default TableList;
