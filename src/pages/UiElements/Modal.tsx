import React from 'react';
//import moment from "moment";
import { Modal, Form, Input, InputNumber, Button, DatePicker, Select } from 'antd';

const ModalCalendar = ({ visible, onClose, onSubmit, selectedDate}) => {

  console.log(selectedDate, 'ModalCalendar-> Selected Date');

  const [form] = Form.useForm();

  const dateFormat = "YYYY-MM-DD";

  form.setFieldValue('date',selectedDate)

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit(values); // Call the onSubmit function with the form values
        form.resetFields();
        onClose();
      })
      .catch((errorInfo) => {
        console.error('Validation Failed:', errorInfo);
      });
  };

  
  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      title="Supplier"
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Submit
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" name="myForm">
      <Form.Item
          name="date"
          label="Plan Date"
          rules={[{ required: true, message: 'Please enter the date!' }]}
        >
          <Input readOnly={true}/>
        {/*<DatePicker style={{ width: '100%' }}  format={dateFormat} />*/}
      </Form.Item>

        <Form.Item
          name="supplierId"
          label="Supplier"
          rules={[{ required: true, message: 'Please enter the supplier!' }]}
        >
          <Select
            //showSearch
            placeholder="Select Supplier"
            optionFilterProp="children"
            // onChange={onChange}
            // onSearch={onSearch}
            // filterOption={filterOption}
            style={{ width: '100%' }}
            options={[
              {
                value: '1',
                label: 'GDL',
              },
              {
                value: '2',
                label: 'Vector',
              },
              {
                value: '3',
                label: 'Turja',
              },
            ]}
          />
        </Form.Item>
        <Form.Item
          name="itemId"
          label="Material"
          rules={[{ required: true, message: 'Please enter the material!' }]}
        >
          <Select 
            //showSearch
            placeholder="Select Material"
            style={{ width: '100%' }}
            options={[
              {
                value: '1',
                label: 'Hard Lead',
              },
              {
                value: '2',
                label: 'Pure Lead 99.97% & 99.985% ',
              },
              {
                value: '3',
                label: 'Lead Antimony 2.75%',
              },
              {
                value: '4',
                label: 'Lead Antimony 3.2%',
              },
            ]}
          />
        </Form.Item>
        <Form.Item
          name="itemRate"
          label="Item Rate"
          rules={[{ required: true, message: 'Please enter the rate!' }]}
        >
          <InputNumber min={0} step={0.1} style={{ width: '100%' }}  placeholder="Enter Item Rate"/>
        </Form.Item>
        <Form.Item
          name="vat"
          label="VAT %"
          rules={[{ required: true, message: 'Please enter the VAT!' }]}
        >
          <InputNumber min={0} step={0.1} style={{ width: '100%' }} placeholder="Enter VAT" />
        </Form.Item>
        <Form.Item
          name="ait"
          label="AIT %"
          rules={[{ required: true, message: 'Please enter the AIT!' }]}
        >
          <InputNumber min={0} step={0.1} style={{ width: '100%' }} placeholder="Enter AIT" />
        </Form.Item>
        <div
          style={{
            width:'100%',
            display: 'flex',
            alignItems: 'center',
            paddingBottom: '10px',
          }}
        >
          <Form.Item
            name="qty"
            label="Quantity"
            rules={[{ required: true, message: 'Please enter the quantity!' }]}
          >
            <InputNumber min={0} step={1} style={{ width: '100%' }} placeholder="Enter Item Quantity in MT"/>
          </Form.Item>
          <p
            style={{
              padding: '5px',
              marginTop:'5px',
              marginLeft:'5px',
              backgroundColor: '#06c',
              borderRadius: '5px',
              color: 'white',
            }}
          >
            MT
          </p>
        </div>

      </Form>
    </Modal>
  );
};

export default ModalCalendar;