import {  PlusOutlined } from '@ant-design/icons';
import {  message, Divider, Modal } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import Logistics from './components/logistics';
import UpdateForm from './components/UpdateForm';
import { queryOrderList, putOrder } from './service';

/**
 * 更新节点
 * @param fields
 */

const handleUpdate = async (fields) => {
  try {
    await putOrder({...fields });
    message.success('编辑成功');
    return true;
  } catch (error) {
    return false;
  }
};

const TableList = () => {
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [logisticsModalVisible, handleLogisticsModalVisible] = useState(false);
  const [FormValues, setFormValues] = useState({});
  const actionRef = useRef();
  const columns = [
    {
      title: '#',
      dataIndex: 'order_id',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '订单编号',
      dataIndex: 'order_number',
      width: 200,
      ellipsis: true,
      hideInForm: true,
    },
    {
      title: '订单价格',
      dataIndex: 'order_price',
      hideInSearch: true,
      valueType: 'money'
    },
    {
      title: '是否付款',
      dataIndex: 'pay_status',
      valueEnum: {
        '0': {
          text: '未付款',
          status: 'Error',
        },
        '1': {
          text: '已付款',
          status: 'Success',
        }
      },
    },
    {
      title: '是否发货',
      dataIndex: 'is_send',
      hideInForm: true,
      valueEnum: {
        '否': {
          text: '未发货',
          status: 'Error',
        },
        '是': {
          text: '已发货',
          status: 'Success',
        }
      },
    },
    {
      title: '支付时间',
      dataIndex: 'create_time',
      hideInSearch: true,
      hideInForm: true,
      valueType: 'dateTime'
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
              handleLogisticsModalVisible(true);
              setFormValues(record);
            }}
          >
            物流
          </a>
        </>
      ),
    },
  ];

  return (
    <PageHeaderWrapper>
      <ProTable
        actionRef={actionRef}
        rowKey="order_id"
        request={(params, sorter, filter) => queryOrderList({ ...params, sorter, filter })}
        columns={columns}
      />
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
      {logisticsModalVisible && FormValues && Object.keys(FormValues).length ? (
        <Logistics
          onSubmit={() => {
            handleLogisticsModalVisible(false);
            setFormValues({});
          }}
          onCancel={() => {
            handleLogisticsModalVisible(false);
            setFormValues({});
          }}
          logisticsModalVisible={logisticsModalVisible}
          values={FormValues}
        />
      ) : null}
    </PageHeaderWrapper>
  );
};

export default TableList;
