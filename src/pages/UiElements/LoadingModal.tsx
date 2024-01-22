import React from 'react';
//import moment from "moment";
import { Modal, Form, Input, InputNumber, Button, DatePicker, Select } from 'antd';
import Loading from '../../loading';

const LoadingModal = ({isLoading,onClose}) => {

  console.log(isLoading, 'LoadingModal');

  const handleCancel = () => {
    //form.resetFields();
    onClose();
  };

  return (
    <Modal
      width={150}
      bodyStyle={{height: 0}}
      visible={isLoading}
      title="Loading..."
      onCancel={handleCancel}
      footer={null}
    >
      <Loading />
    </Modal>
  );
};

export default LoadingModal;