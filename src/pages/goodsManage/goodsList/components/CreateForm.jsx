import React, { useState, useEffect } from 'react';
import { Steps,message, Tabs,Space } from 'antd';
import {history} from 'umi'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Form1 from './Form1';
import Form2 from './Form2';
import Form3 from './Form3';
import Form4 from './Form4';
import {addGoods,queryGoodsDec} from '../service'

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
    title: '完成',
  },
];

let allFormData = {};
const CreateForm = (props) => {
  const [current, setCurrent] = useState(0);
  const onTabChange = () => {};
  const onTabClick = (key) => {
    setCurrent(+key);
  };

  const handleNext = async (step, values) => {
    try {
      if (step < 4) {
        allFormData = { ...allFormData, ...values };
      }
      // 等于4时执行提交
      if(step === 4){
        console.log(allFormData)
        // allFormData.attrs = JSON.stringify(allFormData.attrs)
        allFormData.goods_cat = allFormData.goods_cat.join(',')
        allFormData.goods_introduce = '123'
        await addGoods(allFormData)
        message.success('添加成功,正在跳转到商品列表')
        history.replace('/goodsManage/goodsList')
      }
      setCurrent(current + 1);
    } catch (error) {
        console.error(error)
    }

  };

  return (
    <PageHeaderWrapper>
      <div style={{backgroundColor:'#fff',padding:'40px'}}>
        <Space direction="vertical" size="large">
          <Tabs
            activeKey={`${current}`}
            tabPosition="left"
            onTabClick={onTabClick}
            onChange={onTabChange}
          >
            {steps &&
              steps.map((item, index) => {
                return (
                  <TabPane tab={item.title} disabled={index > current} key={`${index}`}>
                    {current === 0 && <Form1 handleNext={handleNext} />}
                    {current === 1 && (
                      <Form2 catId={allFormData.goods_cat[2]} handleNext={handleNext} />
                    )}
                    {current === 2 && (
                      <Form3 catId={allFormData.goods_cat[2]} handleNext={handleNext} />
                    )}
                    {current === 3 && <Form4 handleNext={handleNext} />}
                  </TabPane>
                );
              })}
          </Tabs>
        </Space>
      </div>
    </PageHeaderWrapper>
  );
};

export default CreateForm;
