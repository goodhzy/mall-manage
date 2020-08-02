import {  PlusOutlined } from '@ant-design/icons';
import { Button, message, Divider, Modal } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { queryGoodsList, delGoods, putGoods,queryGoodsDec } from './service';

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
    // 需要先获取商品详情才能更新商品
    const res = await queryGoodsDec(fields.goods_id)
    await putGoods({...res.data,...fields });
    message.success('编辑成功');
    return true;
  } catch (error) {
    return false;
  }
};
/**
 *  删除节点
 * @param selectedRows
 */

const handleDel = async ({ goods_id }, actionRef) => {
  Modal.confirm({
    content: '此操作将永久删除该商品, 是否继续?',
    onOk: async () => {
      try {
        await delGoods(goods_id);
        message.success('删除成功');
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
  const actionRef = useRef();
  const columns = [
    {
      title: '#',
      dataIndex: 'goods_id',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '商品名称',
      dataIndex: 'goods_name',
      rules: [
        {
          required: true,
          message: '用户账号为必填项',
        },
      ],
      width: 200,
      ellipsis: true,
    },
    {
      title: '商品价格(元)',
      dataIndex: 'goods_price',
      hideInSearch: true,
      valueType: 'money'
    },
    {
      title: '商品数量',
      dataIndex: 'goods_number',
      hideInSearch: true,
    },
    {
      title: '商品重量',
      dataIndex: 'goods_weight',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '添加时间',
      dataIndex: 'add_time',
      hideInSearch: true,
      hideInForm: true,
      valueType: 'dateTime'
    },{
      title: '更新时间',
      dataIndex: 'upd_time',
      hideInSearch: true,
      hideInForm: true,
      valueType: 'dateTime'
      
    },
    {
      title: '商品状态',
      dataIndex: 'goods_state',
      hideInSearch: true,
      hideInForm: true,
      initialValue: '0',
      valueEnum: {
        0: {
          text: '未通过',
          status: 'Error',
        },
        1: {
          text: '审核中',
          status: 'Processing',
        },
        2: {
          text: '已审核',
          status: 'Success',
        },
      },
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
        rowKey="goods_id"
        toolBarRender={() => [
          <Button type="primary" onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={(params, sorter, filter) => queryGoodsList({ ...params, sorter, filter })}
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
    </PageHeaderWrapper>
  );
};

export default TableList;
