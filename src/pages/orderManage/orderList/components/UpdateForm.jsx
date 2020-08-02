import React, { useState } from 'react';
import { Form, Button, Input, Select, Modal } from 'antd';
const FormItem = Form.Item;
const formLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 13,
  },
};

const { Option } = Select;

const options = [
  { value: 0, label: '未发货' },
  {
    value: 1,
    label: '已发货',
  },
];

const UpdateForm = (props) => {
  const [form] = Form.useForm();
  const {
    onSubmit: handleUpdate,
    onCancel: handleUpdateModalVisible,
    updateModalVisible,
    values,
  } = props;

  const [formVals, setFormVals] = useState({
    order_id: values.order_id,
    is_send: values.is_send==='是' ? 1 : 0,
    order_price: values.order_price
  });
  const handleSubmit = async () => {
    const fieldsValue = await form.validateFields();
    setFormVals({ ...formVals, ...fieldsValue });
    handleUpdate({ ...formVals, ...fieldsValue });
  };

  const renderContent = () => {
    return (
      <>
        <FormItem name="is_send" label="是否发货" initialValue={formVals.is_send}>
          <Select style={{ width: 200 }}>
            {options.map((item) => {
              return <Option value={item.value}>{item.label}</Option>;
            })}
          </Select>
        </FormItem>
      </>
    );
  };

  const renderFooter = () => {
    return (
      <>
        <Button onClick={() => handleUpdateModalVisible(false, values)}>取消</Button>
        <Button type="primary" onClick={() => handleSubmit()}>
          提交
        </Button>
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
      title="编辑订单状态"
      visible={updateModalVisible}
      footer={renderFooter()}
      onCancel={() => handleUpdateModalVisible()}
    >
      <Form {...formLayout} form={form}>
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default UpdateForm;
