import React, { useState, useEffect } from 'react';
import { Button, Form, Tag } from 'antd';
import { queryAttributesList } from '../../categoryParmas/service';

const Form2 = (props) => {
  const [form] = Form.useForm();
  const { catId,handleNext } = props;
  const [attrs, setAttrs] = useState([]);
  const next = async () => {
    try {
        let values = attrs.map(({attr_id,attr_vals})=>{
          return {
            attr_id,
            attr_vals
          }
        })
        handleNext(2,{attrs:values})
    } catch (error) {
        console.error(error)
    }
  };
  useEffect(() => {
    queryAttributesList({ catId, sel: 'many' }).then((res) => {
      setAttrs(res.data);
    });
  }, []);

  return (
    <>
      <Form form={form} layout="vertical" style={{marginTop:'15px'}}>
        {attrs &&
          attrs.map((item) => {
            return (
              <Form.Item key={item.attr_id} label={item.attr_name}>
                {item.attr_vals &&
                  item.attr_vals.split(',').map((val) => {
                    return (
                      <Tag color="geekblue" key={val}>{val}</Tag>
                    );
                  })}
              </Form.Item>
            );
          })}
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
    </>
  );
};

export default Form2;
