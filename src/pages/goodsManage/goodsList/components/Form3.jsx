import React, { useState, useEffect } from 'react';
import { Button, Form, Checkbox } from 'antd';
import { queryAttributesList } from '../../categoryParmas/service';

const Form3 = (props) => {
    console.log(props);
  const [form] = Form.useForm();
  const { catId,handleNext } = props;
  const [attrs, setAttrs] = useState([]);
  const next = async () => {
    try {
        // const fieldsValue = await form.validateFields()
        const fieldsValue = form.getFieldsValue()
        handleNext(3,fieldsValue)
    } catch (error) {
        console.error(error)
    }
  };
  useEffect(() => {
    queryAttributesList({ catId, sel: 'only' }).then((res) => {
      setAttrs(res.data);
    });
  }, []);

  return (
    <>
      <Form form={form} layout="vertical">
        {attrs &&
          attrs.map((item) => {
            return (
              <Form.Item name="checkbox-group" label={item.attr_name}>
                {item.attr_vals &&
                  item.attr_vals.split(' ').map((val) => {
                    return (
                      <Checkbox.Group>
                        <Checkbox
                          value={val}
                          style={{
                            lineHeight: '32px',
                          }}
                        >
                          {val}
                        </Checkbox>
                      </Checkbox.Group>
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

export default Form3;
