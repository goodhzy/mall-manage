import React, { useState, useEffect } from 'react';
import { Modal, Tree } from 'antd';
import { queryPermissonTree } from '../service';

const SetPermissonFrom = (props) => {
  const {
    values,
    perModalVisible,
    onCancel: handlePerModalVisible,
    onSubmit: handleSubmit,
  } = props;
  const [permissonTree, setPermissonTree] = useState(null);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [checkAttrs, setCheckAttrs] = useState(null);

  useEffect(() => {
    function addKey(node) {
      if (!node.children) return;
      node.children.forEach((item) => {
        item.title = item.authName;
        item.key = item.id;
        addKey(item)
      });
    }
    queryPermissonTree().then((res) => {
      let data = res.data;
      data.forEach((item) => {
        item.title = item.authName;
        item.key = item.id;
        addKey(item)
      });
      function getCheckAttrsTemp(node, arr, dep) {
        if (!node.children) {
          if (dep === 3) arr.push(node.id); // 只需要第三层的id
          return;
        }
        dep++;
        node.children.forEach((item) => getCheckAttrsTemp(item, arr, dep));
      }
      let checkAttrsTemp = [];
      getCheckAttrsTemp(values, checkAttrsTemp, 0);
      setCheckAttrs(checkAttrsTemp);
      setPermissonTree(data);
      return () => {};
    });
  }, []);

  const onCheck = (checkedKeys, e) => {
    console.log(e);
    values.checkedKeys = [...checkedKeys, ...e.halfCheckedKeys];
  };
  const renderContent = () => {
    return (
      <>
        {permissonTree && checkAttrs && (
          <Tree
            height={560}
            checkable
            defaultCheckedKeys={checkAttrs}
            autoExpandParent={autoExpandParent}
            onCheck={onCheck}
            treeData={permissonTree}
          />
        )}
      </>
    );
  };
  return (
    <>
      <Modal
        width={640}
        height={600}
        virtual
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
          handleSubmit(values);
        }}
      >
        {renderContent()}
      </Modal>
    </>
  );
};

export default SetPermissonFrom;
