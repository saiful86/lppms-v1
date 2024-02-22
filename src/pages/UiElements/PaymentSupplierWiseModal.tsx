import { Modal, Form, Input, InputNumber, Button, Select } from 'antd';
import "./Modal.css";
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";


const PaymentSupplierWiseModal = ({ visible, onClose, onSubmit, selectedDate, selectedSupplierName, selectedTotalAmount, paymentList, onChange, isFullPayment}) => {

 
  const handleSubmit = () => {
   onSubmit();
  };

 
  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      open={visible}
      title="Add Payment"
      onOk={handleSubmit}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        !isFullPayment && (
         <Button key="submit" type="primary" onClick={handleSubmit}>
          Submit
        </Button>),
      ]}
    >
      <div className="modal-container">
          <div className="form-group">
            <label htmlFor="page">Plan Date </label>
            <input name="page" readOnly value={selectedDate} />
          </div>
          <div className="form-group">
            <label htmlFor="page">Supplier Name </label>
            <input name="page" readOnly value={selectedSupplierName} />
          </div>
          <div className="form-group">
            <label htmlFor="page">Total Amount </label>
            <input name="page" readOnly value={selectedTotalAmount} />
          </div>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                <th className="expand">Material</th>
                <th>Amount</th>
                <th>Paid</th>
                <th>Payment</th>
                </tr>
              </thead>
              <tbody>
              {paymentList.map((item, index) => {
                return ( 
                  <tr key={index}>
                  <td className="expand">{item.itemName}</td>
                  <td >{item.amount}</td>
                  <td >{item.paid}</td>
                  <td ><input className='input-custom' name="payment" type="number" step="any" readOnly ={item.isFullPayment} value={item.payment}  onChange={(e)=> onChange(item.itemId, e, index) }  min="0" max={item.amount - item.paid} /></td>
                </tr> 
                );
              })} 
                
              </tbody>
            </table>
          </div>
      </div>
    </Modal>
  );
};

export default PaymentSupplierWiseModal;