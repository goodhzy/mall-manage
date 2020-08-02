import React, { useState } from 'react';
import { Form, Button, Input,InputNumber, Modal } from 'antd';
const { TextArea } = Input;
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
    goods_id: values.goods_id,
    goods_name: values.goods_name,
    goods_price: values.goods_price,
    goods_number: values.goods_number,
    goods_weight: values.goods_weight,

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
          name="goods_name"
          label="商品名称"
          rules={[
            {
              required: true,
              message: '请输入商品名称',
            },
          ]}
          initialValue={formVals.goods_name}
        >
          <TextArea rows={2} placeholder="请输入" />
        </FormItem>
        <FormItem
          name="goods_price"
          label="商品价格"
          rules={[
            {
              required: true,
              message: '请输入商品价格',
            },
          ]}
          initialValue={formVals.goods_price}
        >
          <InputNumber placeholder="请输入商品价格" />
        </FormItem>
        <FormItem
          name="goods_number"
          label="商品数量"
          rules={[
            {
              required: true,
              message: '请输入商品数量',
            },
          ]}
          initialValue={formVals.goods_number}
        >
          <InputNumber placeholder="请输入商品数量" />
        </FormItem>
        <FormItem
          name="goods_weight"
          label="商品重量"
          rules={[
            {
              required: true,
              message: '请输入商品重量',
            },
          ]}
          initialValue={formVals.goods_weight}
        >
          <InputNumber placeholder="请输入商品重量" />
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
