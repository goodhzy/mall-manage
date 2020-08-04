import React, { useState, useEffect } from 'react';
import {Form,Input,InputNumber,Cascader,Button} from 'antd'
import { queryCategoriesListAll } from '../../goodsCateGory/service';


const Form1 = (props) => {
  const [form] = Form.useForm();
  const {handleNext} = props
  const [categoryData, setCategoryData] = useState([]);
  const onCascaderChange = () => {};
  const getCatData = async () => {
    try {
      const res = await queryCategoriesListAll();
      setCategoryData(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const next = async () => {
    try {
        const fieldsValue = await form.validateFields()
        handleNext(1,fieldsValue)
    } catch (error) {
        console.error(error)
    }
  };
  useEffect(() => {
    getCatData();
  }, []);
  
  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="goods_name"
        label="商品名称"
        rules={[
          {
            required: true,
            message: '请输入商品名称',
          },
        ]}
      >
        <Input.TextArea autoSize={{ minRows: 2, maxRows: 6 }} style={{ width: `250px` }} />
      </Form.Item>
      <Form.Item
        name="goods_price"
        label="商品价格"
        rules={[
          {
            required: true,
            message: '请输入商品价格',
          },
        ]}
      >
        <InputNumber style={{ width: `250px` }} />
      </Form.Item>
      <Form.Item
        name="goods_weight"
        label="商品重量(kg)"
        rules={[
          {
            required: true,
            message: '请输入商品重量',
          },
        ]}
      >
        <InputNumber style={{ width: `250px` }} />
      </Form.Item>
      <Form.Item
        name="goods_number"
        label="商品数量"
        rules={[
          {
            required: true,
            message: '请输入商品数量',
          },
        ]}
      >
        <InputNumber style={{ width: `250px` }} />
      </Form.Item>
      <Form.Item
        name="goods_cat"
        label="商品分类"
        rules={[
          {
            required: true,
            message: '请选择商品分类',
          },
        ]}
      >
        <Cascader
          fieldNames={{ label: 'cat_name', value: 'cat_id', children: 'children' }}
          options={categoryData}
          style={{ width: `250px` }}
          onChange={onCascaderChange}
        />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          onClick={() => {
            next();
          }}
        >
          下一步
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Form1;
