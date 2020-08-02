import React, { useState, useEffect } from 'react';
import { Timeline, Modal, Spin } from 'antd';
import { queryLogistics } from '../service';

const formLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 13,
  },
};

const options = [
  { value: 0, label: '未发货' },
  {
    value: 1,
    label: '已发货',
  },
];

const Logistics = (props) => {
  const { onSubmit, onCancel: handleLogisticsModalVisible, logisticsModalVisible, values } = props;

  const [formVals, setFormVals] = useState({
    order_id: values.order_id,
  });
  const [logisticsData, setLogistics] = useState([]);
  const [spin,setSpin] = useState(true)
  useEffect(() => {
    queryLogistics().then((res) => {
      setLogistics(res.data);
      setSpin(false)
    });
  }, []);

  const renderContent = () => {
    return (
      <Timeline>
        {logisticsData &&
          logisticsData.map((item) => {
            return (
              <Timeline.Item>
                {item.context}
                {item.time}
              </Timeline.Item>
            );
          })}
      </Timeline>
    );
  };

  return (
    <Modal
      width={640}
      bodyStyle={{
        padding: '32px 40px 48px',
      }}
      destroyOnClose
      title="物流信息"
      visible={logisticsModalVisible}
      cancelButtonProps={()=>{return null}}
      onCancel={() => handleLogisticsModalVisible()}
      onOk={() => {
        onSubmit();
      }}
    >
      <Spin tip="加载中" spinning={spin}>{renderContent()}</Spin>
    </Modal>
  );
};

export default Logistics;
