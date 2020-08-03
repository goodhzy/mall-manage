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
  const [checkAttrs, setCheckAttrs] = useState(null)

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
      let checkAttrsTemp = []
      values.checkedKeys = []
      values.children.forEach((item1) => {
        values.checkedKeys.push(item1.id)
        if (item1.children && item1.children.length > 0) {
          item1.children.forEach((item2) => {
              values.checkedKeys.push(item2.id)
            if (item2.children && item2.children.length > 0) {
              item2.children.forEach((item3) => {
                values.checkedKeys.push(item3.id)
                checkAttrsTemp.push(item3.id)
              });
            }
          });
        }
      });
      setCheckAttrs(checkAttrsTemp)
      setPermissonTree(data);
      return () => {};
    });
  },[]);

  const onCheck = (checkedKeys,e) => {
    console.log(e)
    values.checkedKeys = [...checkedKeys,...e.halfCheckedKeys]
  };
  const renderContent = () => {
    return (
      <>
      {
        permissonTree && checkAttrs && <Tree
        height={560}
        checkable
        defaultCheckedKeys={checkAttrs}
        autoExpandParent={autoExpandParent}
        onCheck={onCheck}
        treeData={permissonTree}
      />
      }
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
