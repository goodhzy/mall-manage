import React, { useState, useEffect } from 'react';
import { Button, Steps, Tabs, Cascader, Form, Input, InputNumber } from 'antd';
import Form1 from './Form1'
import Form2 from './Form2'
import Form3 from './Form3'
import Form4 from './Form4'
import Form5 from './Form5'


const { Step } = Steps;
const { TabPane } = Tabs;

const steps = [
  {
    title: '基本信息',
  },
  {
    title: '商品参数',
  },
  {
    title: '基本属性',
  },
  {
    title: '基本图片',
  },
  {
    title: '基本内容',
  },
  {
    title: '完成',
  },
];

let allFormData = {

}
const CreateForm = (props) => {
  const [current, setCurrent] = useState(0);
  const onTabChange = () => {};
  const onTabClick = (key) => {
    setCurrent(+key);
  };
  

  const handleNext = async (step,values) => {
    if(step === 1){
      allFormData = {allFormData,...values}
    }
    setCurrent(current+1)
  };

  return (
    <>
      <Steps current={current}>
        {steps &&
          steps.map((item) => {
            return <Step title={item.title} key={item.title} />;
          })}
      </Steps>
      <Tabs
        activeKey={`${current}`}
        tabPosition="left"
        onTabClick={onTabClick}
        onChange={onTabChange}
      >
        {steps &&
          steps.map((item, index) => {
            return (
              <TabPane tab={item.title} key={`${index}`}>
                {current === 0 && <Form1 handleNext={handleNext} />}
                {current === 1 && <Form2 catId={allFormData.goods_cat[2]} handleNext={handleNext} />}
                {current === 2 && <Form3 catId={allFormData.goods_cat[2]} handleNext={handleNext} />}
                {current === 3 && <Form4 handleNext={handleNext} />}
                {current === 4 && <Form5 handleNext={handleNext} />}
              </TabPane>
            );
          })}
      </Tabs>
    </>
  );
};

export default CreateForm;
