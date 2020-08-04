import React,{useState} from 'react';
import { Upload, Modal, Button,message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import request from '@/utils/request';

const upLoadAction = {
  name: 'file',
  multiple: true,
  listType: "picture-card",
  action: `${request.defaults.baseURL  }upload`,
  headers: {
    Authorization: localStorage.getItem('token')
  }
};
const getBase64 = (file)=> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
const Form4 = (props) => {
  const {handleNext} = props
  const [fileList, setFileList] = useState([])
  const [previewImage, setPreviewImage] = useState('')
  const [previewVisible,setPreviewVisible] = useState(false)
  const [previewTitle,setPreviewTitle] = useState('')
  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
      setPreviewImage(file.url || file.preview)
      setPreviewVisible(true)
      setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
    }
  }
  const handleChange = ({ fileList }) => setFileList(fileList);
  const handleCancel = ()=>{
    setPreviewVisible(false)
  }
  const next = ()=>{
    const values = fileList.map(item=>{
      return {
        pic: item.response.data.url
      }
    })
    handleNext(4,values)
  }
  return (
    <>
      <Upload
          {...upLoadAction}
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
        >
          {fileList.length >= 8 ? null : (<div>
          <PlusOutlined />
          <div className="ant-upload-text">Upload</div>
        </div>)}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
        <Button
            type="primary"
            onClick={() => {
              next();
            }}
          >
            提交
          </Button>
    </>
  );
};

export default Form4
