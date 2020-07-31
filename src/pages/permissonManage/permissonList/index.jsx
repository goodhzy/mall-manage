import { Tag } from 'antd';
import React, {  useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { queryPermissonList } from './service';



const TableList = () => {
  const actionRef = useRef();
  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '权限名称',
      dataIndex: 'authName',
      hideInSearch: true,
    },
    {
      title: '路径',
      dataIndex: 'path',
      hideInSearch: true,
    },
    {
      title: '权限等级',
      dataIndex: 'mg_state',
      hideInForm: true,
      hideInSearch: true,
      render: (_, { level }) => (
        <>
        {level==='0' && <Tag color="cyan">一级权限</Tag>}
        {level==='1' && <Tag color="green">二级权限</Tag>}
        {level==='2' && <Tag color="orange">三级权限</Tag>}
        </>
      )
    }
  ]
  return (
    <PageHeaderWrapper>
      <ProTable
        actionRef={actionRef}
        rowKey="id"
        request={(params, sorter, filter) => queryPermissonList({ ...params, sorter, filter })}
        columns={columns}
        pagination={
          false
        }
        search={false}
      />
    </PageHeaderWrapper>
  );
};

export default TableList;