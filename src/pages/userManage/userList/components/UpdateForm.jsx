import React, { useState } from 'react';
import { Form, Button, Input, Modal } from 'antd';

const FormItem = Form.Item;
const formLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 13,
  },
};

const UpdateForm = props => {
  const [form] = Form.useForm();
  const {
    onSubmit: handleUpdate,
    onCancel: handleUpdateModalVisible,
    updateModalVisible,
    values,
  } = props;

  const [formVals, setFormVals] = useState({
    id: values.id,
    username: values.username,
    email: values.email,
    mobile: values.mobile,
  });
  const handleSubmit = async () => {
    const fieldsValue = await form.validateFields();
    setFormVals({ ...formVals, ...fieldsValue });
    handleUpdate({ ...formVals, ...fieldsValue });
  };

  const renderContent = () => {
    return (
      <>
        <FormItem
          name="username"
          label="用户账号"
          rules={[
            {
              required: true,
              message: '请输入用户账号',
            },
          ]}
          initialValue={formVals.username}
        >
          <Input disabled placeholder="请输入" />
        </FormItem>
        <FormItem
          name="mobile"
          label="手机号码"
          rules={[
            {
              required: true,
              message: '请输入手机号码',
            },
          ]}
          initialValue={formVals.mobile}
        >
          <Input placeholder="请输入手机号码" />
        </FormItem>
        <FormItem
          name="email"
          label="邮箱"
          rules={[
            {
              required: true,
              message: '请输入邮箱',
            },
          ]}
          initialValue={formVals.email}
        >
          <Input placeholder="请输入邮箱" />
        </FormItem>
      </>
    );
  };

  const renderFooter = () => {
      return (
        <>
          <Button onClick={() => handleUpdateModalVisible(false, values)}>取消</Button>
          <Button type="primary" onClick={() => handleSubmit()}>提交</Button>
        </>
      );
  };

  return (
    <Modal
      width={640}
      bodyStyle={{
        padding: '32px 40px 48px',
      }}
      destroyOnClose
      title="编辑用户信息"
      visible={updateModalVisible}
      footer={renderFooter()}
      onCancel={() => handleUpdateModalVisible()}
    >
      <Form
        {...formLayout}
        form={form}
      >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default UpdateForm;
