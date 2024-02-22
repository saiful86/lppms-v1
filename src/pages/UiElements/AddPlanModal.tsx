import { useState}from 'react';
import { Modal, Form, Input, InputNumber, Button, Select } from 'antd';

import {
  useCheckPurchaseItemRationMutation
} from '../../redux/services/products/productApi';

const AddPlanModal = ({ visible, onClose, onSubmit, selectedDate}) => {

  console.log(selectedDate, 'ModalCalendar-> Selected Date');

  const [messageToModal, setMessageToModal] = useState('');
  const [qty, setQty] = useState(0);

  const [checkPurchaseItemRatio] = useCheckPurchaseItemRationMutation();

  const [form] = Form.useForm();

  const dateFormat = "YYYY-MM-DD";

  form.setFieldValue('date',selectedDate)

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {

        console.error('handleOk qty', qty);
        console.error('handleOk values', values.qty);

        if(values.qty > 0 && values.qty <= qty){
          onSubmit(values); // Call the onSubmit function with the form values
          form.resetFields();
          setMessageToModal('');
          onClose();
        }else{
          //form.setFieldError('qty')
          
        }
    
      })
      .catch((errorInfo) => {
        console.error('Validation Failed:', errorInfo);
      });
  };

  const onChange = async (value : any) => {
    console.error('onChange: own ', value);

    //onChangeModal(value);

    const { data = [] } = await checkPurchaseItemRatio({planDate:selectedDate, itemId:value, planQty:0});
    //console.log(res,'onChange')
    setMessageToModal(data[0].message)
    setQty(data[0].remained)
    form.setFieldValue('qty',data[0].remained)

    //const { data = [] } = useCheckPurchaseItemRationQuery({
    //});

    //const { data = [] } = useGetAllPlansQuery({});
    
   // console.log(data,'onChange')

  }

  
  const handleCancel = () => {
    form.resetFields();
    setMessageToModal('');
    onClose();
  };

  return (
    <Modal
      open={visible}
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
            onChange={onChange}
            placeholder="Select Material"
            style={{ width: '100%' }}
            options={[
              {
                value: '1',
                label: 'Hard Lead',
              },
              {
                value: '2',
                label: 'Pure Lead 99.97%',
              },
              {
                value: '5',
                label: 'Pure Lead 99.985% ',
              },
              {
                value: '3',
                label: 'Lead Alloy 2.75%',
              },
              {
                value: '4',
                label: 'Lead Alloy 3.2%',
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
          <p style={{
              paddingLeft: '5px',
              fontSize:11,
              color: 'red',
            }}> {messageToModal} </p>
        </div>

      </Form>
    </Modal>
  );
};

export default AddPlanModal;