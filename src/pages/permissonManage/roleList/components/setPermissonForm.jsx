import React, { useState, useEffect } from 'react';
import { Modal, Tree } from 'antd';
import { queryPermissonTree } from '../service';

const treeData = [
  {
    title: '0-0',
    key: '0-0',
    children: [
      {
        title: '0-0-0',
        key: '0-0-0',
        children: [
          {
            title: '0-0-0-0',
            key: '0-0-0-0',
          },
          {
            title: '0-0-0-1',
            key: '0-0-0-1',
          },
          {
            title: '0-0-0-2',
            key: '0-0-0-2',
          },
        ],
      },
      {
        title: '0-0-1',
        key: '0-0-1',
        children: [
          {
            title: '0-0-1-0',
            key: '0-0-1-0',
          },
          {
            title: '0-0-1-1',
            key: '0-0-1-1',
          },
          {
            title: '0-0-1-2',
            key: '0-0-1-2',
          },
        ],
      },
      {
        title: '0-0-2',
        key: '0-0-2',
      },
    ],
  },
  {
    title: '0-1',
    key: '0-1',
    children: [
      {
        title: '0-1-0-0',
        key: '0-1-0-0',
      },
      {
        title: '0-1-0-1',
        key: '0-1-0-1',
      },
      {
        title: '0-1-0-2',
        key: '0-1-0-2',
      },
    ],
  },
  {
    title: '0-2',
    key: '0-2',
  },
];

const formatData = (n) => {};

const SetPermissonFrom = (props) => {
  const {
    values,
    perModalVisible,
    onCancel: handlePerModalVisible,
    onSubmit: handleSetPer,
  } = props;
  const [permissonTree, setPermissonTree] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  console.log(values);

  useEffect(() => {
    queryPermissonTree().then((res) => {
      let data = res.data;
      data.forEach((item1) => {
        item1.title = item1.authName;
        item1.key = item1.id;
        if (item1.children && item1.children.length > 0) {
          item1.children.forEach((item2) => {
            item2.title = item2.authName;
            item2.key = item2.id;
            if (item2.children && item2.children.length > 0) {
              item2.children.forEach((item3) => {
                item3.title = item3.authName;
                item3.key = item3.id;
              });
            }
          });
        }
      });
      setPermissonTree(data);
      return () => {};
    });
  },[]);

  const onCheck = (checkedKeys) => {
    console.log('onCheck', checkedKeys);
    setCheckedKeys(checkedKeys);
  };

  const onSelect = (selectedKeys, info) => {
    console.log('onSelect', info);
    setSelectedKeys(selectedKeys);
  };

  const renderContent = () => {
    return (
      <Tree
        height={560}
        checkable
        autoExpandParent={autoExpandParent}
        onCheck={onCheck}
        checkedKeys={checkedKeys}
        onSelect={onSelect}
        selectedKeys={selectedKeys}
        treeData={permissonTree}
      />
    );
  };
  return (
    <>
      <Modal
        width={640}
        bodyStyle={{
          padding: '32px 40px 48px',
        }}
        okText="确定"
        cancelText="取消"
        destroyOnClose
        title="权限分配"
        visible={perModalVisible}
        onCancel={() => {
          handlePerModalVisible();
        }}
        onOk={() => {
          handleSubmit();
        }}
      >
        {renderContent()}
      </Modal>
    </>
  );
};

export default SetPermissonFrom;
