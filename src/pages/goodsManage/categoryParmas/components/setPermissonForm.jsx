import React, { useState } from 'react';
import { Form, Modal, Input, Select } from 'antd';
import { getRoles } from '../service';

const FormItem = Form.Item;
const { Option } = Select;
const formLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 7,
  },
};

const SetPermissonFrom = (props) => {
  const [form] = Form.useForm();
  const {
    values,
    perModalVisible,
    onCancel: handlePerModalVisible,
    onSubmit: handleSetPer,
  } = props;
  const [formVals, setFormVals] = useState({
    id: values.id,
    username: values.username,
    rid: '',
    role_name: values.role_name,
  });
  const [roles, setRoles] = useState(null);

  const onFocus = async () => {
    if (roles === null) {
      try {
        const res = await getRoles();
        const arr = res.data.map(({ id, roleName }) => ({
          id,
          roleName,
        }));
        setRoles(arr);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onSelect = (value) => {
    setFormVals({ ...formVals, ...{ rid: value } });
  };
  const handleSubmit = async () => {
    const fieldsValue = await form.validateFields();
    setFormVals({ ...formVals, ...fieldsValue });
    handleSetPer({ ...formVals, ...fieldsValue });
  };
  const renderContent = () => {
    return (
      <Form {...formLayout} form={form}>
        <FormItem name="username" label="当前用户" initialValue={formVals.username}>
          <Input disabled />
        </FormItem>
        <FormItem name="role_name" label="当前角色" initialValue={formVals.role_name}>
          <Input disabled />
        </FormItem>
        <FormItem
          name="email"
          label="分配当前角色"
          rules={[
            {
              required: true,
              message: '请分配角色',
            },
          ]}
          initialValue={formVals.email}
        >
          <Select style={{ width: 200 }} placeholder="请选择" onFocus={onFocus} onSelect={onSelect}>
            {roles &&
              roles.map((item) => {
                return (
                  <Option value={item.id} key={item.id}>
                    {item.roleName}
                  </Option>
                );
              })}
          </Select>
        </FormItem>
      </Form>
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
        onOk={()=>{handleSubmit()}}
      >
        {renderContent()}
      </Modal>
    </>
  );
};

export default SetPermissonFrom;
