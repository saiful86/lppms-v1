import { Modal, Form, Input, InputNumber, Button, Select } from 'antd';
import "./Modal.css";

import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";


const PlanDetailsModal = ({ visible, onClose, onDelete, selectedDate,supplierid,selectedSupplierName,selectedTotalQty,items}) => {

  console.log(selectedDate, 'ModalCalendar-> Selected Date');

  const handleOk = () => {
    onClose();
  };


  const handleCancel = () => {
    onClose();
  };


  return (
    <Modal
      open={visible}
      title="Purchase Plan Details "
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        
        <Button key="submit" type="primary" onClick={handleOk}>
          Ok
        </Button>,
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
            <label htmlFor="page">Total Quantity </label>
            <input name="page" readOnly value={selectedTotalQty} />
          </div>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                <th className="expand"> Material</th>
                <th >Rate</th>
                <th>Vat</th>
                <th>AIT</th>
                <th>Qty</th>
                <th>Action</th>
                </tr>
              </thead>
              <tbody>
              {items.map((item, idx) => {
                return ( 
                  <tr key={idx}>
                  <td className="expand">{item.itemDisplayName}</td>
                  <td >{item.itemRate}</td>
                  <td >{item.vat}</td>
                  <td >{item.ait}</td>
                  <td >
                  <span className={"label label-draft"}>
                    {item.itemQty}
                  </span>
                  </td>
                  <td className="fit">
                    <span className="actions">
                    <BsFillTrashFill
                      className="delete-btn"
                      onClick={() => onDelete(selectedDate,supplierid,item.itemId)}
                    />
                    <BsFillPencilFill
                      className="edit-btn"
                      onClick={() => editRow('2')}
                    />
                    </span>
                  </td>
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

export default PlanDetailsModal;