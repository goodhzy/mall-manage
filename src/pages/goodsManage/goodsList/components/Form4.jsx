import React from 'react';
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import request from '@/utils/request';


const { Dragger } = Upload;

const draggerAction = {
  name: 'file',
  multiple: true,
  action: request.defaults.baseURL + 'upload',
  headers: {
    Authorization: localStorage.getItem('token')
  }
};

const Form4 = () => {
  const onChange = (info) => {
      console.log(info)
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name}上传成功`);
    } else if (status === 'error') {
      message.error(`${info.file.name}上传失败`);
    }
  };
  return (
    <Dragger {...draggerAction} onChange={onChange}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">点击或拖拽上传商品图片</p>
      <p className="ant-upload-hint"></p>
    </Dragger>
  );
};

export default Form4;
