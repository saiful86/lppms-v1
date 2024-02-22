import React, { useState , useLayoutEffect, useRef} from 'react';
import type { Dayjs } from 'dayjs';
import moment from "moment";
import type { BadgeProps, CalendarProps } from 'antd';
import { Badge, Calendar, Select, Input, message,Typography, Row, Col, Radio} from 'antd';

import Breadcrumb from '../components/Breadcrumb';

import {
  SaveOutlined,
  BookFilled,
} from '@ant-design/icons';

import {
  useAddPaymentMutation,
  useGetAllPaymentsQuery 
} from '../redux/services/products/productApi';

import dayjs from 'dayjs';
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip } from 'react-tooltip'
import LoadingModal from './UiElements/LoadingModal';
import PaymentSupplierWiseModal from './UiElements/PaymentSupplierWiseModal';


const getMonthData = (value: Dayjs) => {
  if (value.month() === 8) {
    return 1394;
  }
};

const PaymentPlan = () => {

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [monthWiseTotalAmount, setMonthWiseTotalAmount] = useState(0.0);
  const [selecteddate1, setSelecteddate1] = useState(moment());

  const [selectedSupplierid, setSelectedSupplierid] = useState(0);
  const [selectedSupplierName, setSelectedSupplierName] = useState('');
  const [selectedTotalAmount, setSelectedTotalAmount] = useState(0);
  const [isFullPayment, setFullPayment] = useState(false);

  const [addPaymentApi] = useAddPaymentMutation();

  let arraList : {amount: number,paid: number,isFullPayment:boolean, payment: number, itemId: number, itemName: string} [] = [];
  const [paymentList, setPaymentList] = useState(arraList);

  /* Show Payment Modal */
  const showPaymentModal = (selectedDate : string, isFullPayment:boolean , supplierid : number, supplierName : string, totalAmount : any,items : any) => {
    
    console.log(selectedDate, 'showPaymentModal -> '+supplierid);

    const list : {amount: number,paid: number, isFullPayment:boolean, payment: number, itemId: number, itemName: string} [] = [];
    items.forEach(item =>{
      list.push({amount:item.amount,paid:item.payment,isFullPayment:item.isFullPayment, payment: item.amount - item.payment, itemId: item.itemId,itemName:item.itemDisplayName})
    });

    setPaymentList(list);
    setSelectedDate(selectedDate);
    setSelectedSupplierid(supplierid);
    setSelectedSupplierName(supplierName);
    setSelectedTotalAmount(totalAmount);
    setFullPayment(isFullPayment);
    setIsModalVisible(true);

  };


  const handleLoading = () => {
    setLoading(!loading);
  };


  const handleCancel = () => {
    setIsModalVisible(false);
  };

  /* Call this function from  PaymentSupplierWiseModal , when change amount field */
  const onChangeAmount = async (itemId: number, e : any, index : any) => {
    //console.error('onChange: own ', itemId +','+e.target.value+","+index);
  
    const list = [...paymentList];
    let { value, max } = e.target;
    let payment = list[index];
    if(value <= Number(max) ) {
      //payment.payment = Number(value);
      payment.payment = value;
    }

    /*
    list.forEach(item =>{
      if(item.itemId === itemId){
        let { value, min, max } = e.target;
        //console.log("onChangeAmount", 'Max '+max +', value '+value)
        //value = Math.max(Number(min), Math.min(Number(max), Number(value)));
        //item.payment = value;
        if(value <= Number(max) ) {
          item.payment = value;
        }
      }
    });*/
  
    setPaymentList(list);
  
   }

  /* Call this function from  PaymentSupplierWiseModal when click on Submit button */
  const onSubmitPayment = async () => {
    try {
      
      const _paymentList = [...paymentList];
    
      setLoading(true);

      const apiRequestDataList : {date: string, purchasePlanMasterId: number, supplierId:number, itemId: number, payment: number} [] = [];
      _paymentList.forEach(item =>{
        apiRequestDataList.push({date: selectedDate, purchasePlanMasterId: 0, supplierId:selectedSupplierid, itemId: item.itemId, payment: item.payment})
      });


      console.log(apiRequestDataList, 'onSubmitPayment');

      const res = await addPaymentApi(apiRequestDataList);
      const errorMessage = res?.data?.message;
      
      if (res) {
        if (res?.data?.code === 400) {
          message.error(errorMessage);
          console.log(errorMessage, 'error message');
        } else if ('data' in res && res.data) {
          message.success('Plan updated successfully!');
          setLoading(false);
        } else {
          message.error('Error! Insert Failed');
        }
      }
      

    } catch (err) {
      console.error(err.message);
    } finally {
     // setLoading(false);
      // Close the modal after submission
      handleCancel();
    }
  };



  // get data
  const { data = [] } = useGetAllPaymentsQuery({});

  // Destructuring the array of objects
  const destructuredData = data.map(
    ({
      id,
      purchasePlanMasterId,
      year,
      month,
      day,
      planDate,
      totalAmount,
      totalPayment,
      isFullPayment,
      paymentStatus,
      suppliers,
    }: {
      id: number;
      purchasePlanMasterId:number;
      year:number;
      month:number;
      day:number;
      planDate: string; // Add the type for the 'date' property
      totalAmount : number;
      totalPayment : number;
      isFullPayment:boolean;
      paymentStatus:string,
      suppliers : {
        supplierId:number;
        supplierName: string;
        supplierColorCode: string;
        totalAmount: number;
        totalPayment: number;
        isFullPayment:boolean;
        items :{
          paymentDetailsId:number;
          purchasePlanMasterId:number;
          paymentPlanMasterId:number;
          supplierId:number;
          itemId:number;
          itemName:string;
          itemDisplayName:string;
          itemRate:number;
          vat:number;
          ait:number;
          itemQty:number;
          amount:number;
          payment:number;
          paymentDate:string;
          isFullPayment:boolean;
          remarks:string;
        }
      };
    }) => ({
      id,
      purchasePlanMasterId,
      year,
      month,
      day,
      planDate,
      totalAmount,
      totalPayment,
      isFullPayment,
      paymentStatus,
      suppliers,
    }),
  );

  //console.log(destructuredData, 'Destructure Data');

  /* Calculate Month wise Total Quantity */
  const calculateMonthWiseTotalAmount = async (year : number, month : number) => {
    var totalMonthAmount = 0.0;
    if(destructuredData){
      destructuredData.forEach((data : any) => {
        if(data.year === year && data.month === month){
          totalMonthAmount += data.totalAmount;
        }
      });
    }
    setMonthWiseTotalAmount(totalMonthAmount);
  }

  const getCalendarCellData = (value: any) => {
    
    const currentDateString = value.format('YYYY-MM-DD');

    // Filter the API data for the current date
    const filteredData = destructuredData.filter(
      (item: { planDate: string | number | Date | Dayjs | null | undefined }) =>
        dayjs(item.planDate).format('YYYY-MM-DD') === currentDateString,
    );

    // Map the filtered data to the desired format for the calendar
    if(filteredData && filteredData.length > 0){
      const listData = filteredData.map(
        (item: { totalAmount: any; totalPayment: any; suppliers: any, isFullPayment: boolean, paymentStatus:string}) => ({
          type: item.isFullPayment?'success':'error',
          content: `${item.totalAmount}`,
          payment: `${item.totalPayment}`,
          paymentStatus:item.paymentStatus,
          suppliers: item.suppliers
        }),
      );
  
      return listData || [];
    }else{
      return [{
        type: 'default',
        content: '',
        payment: '',
        suppliers: []
      }]
    }
    
  };

  const monthCellRender = (value: Dayjs) => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };

  const dateCellRender = (value: Dayjs) => {

    const [isEditing, setEditing] = React.useState(false);
    const [editedContent, setEditedContent] = React.useState('');

    const listData = getCalendarCellData(value);

    var totalDayQty : number = 0.0
    var totalPayment : number = 0.0
    var suppliers : any = []
    var paymentStatus : string = 'later';

    if(listData && listData.length > 0){
      totalDayQty = listData[0].content;
      totalPayment = listData[0].payment;
      suppliers = listData[0].suppliers; 
      paymentStatus = listData[0].paymentStatus; 
    }

    //const currentDateString = value.format('DD-MM-YYYY');
    const currentDateString = value.format('YYYY-MM-DD');

    //console.log(currentDateString, 'Selected Date');
    console.log(totalDayQty, 'totalDayQty');
    console.log(suppliers, 'suppliers');

    const handleEdit = (totalDayQt : any) => {
      console.log('handleEdit : 123');
      if(typeof totalDayQt === "string"){
        setEditedContent(totalDayQt)
      }
      setEditing(!isEditing);
    };


    /* add a plan for a single day */
    const handleSave = async (selectedDate : string) => {

      if (editedContent.trim() !== '') {

        console.log('Updated data:', {
          date:selectedDate,
          totalQty: editedContent,
        });

        try {
         
          setLoading(true);
    
          const res = await addPlanForSingleDay({
            date:selectedDate,
            totalQty: editedContent,
          });

          const errorMessage = res?.data?.message;
    
          if (res) {
            if (res?.data?.code === 400) {
              message.error(errorMessage);
              console.log(errorMessage, 'error message');
            } else if ('data' in res && res.data) {
              message.success('Plan updated successfully!');
              setLoading(false);
            } else {
              message.error('Error! Insert Failed');
            }
          }
        } catch (err) {
          console.error(err.message);
        } finally {
          setLoading(false);
          // Close the modal after submission
          //handleCancel();
        }

        setEditing(false);
        // Update the content in your data source or dispatch an action to update the data
      } else {
        // If content is empty, cancel editing mode
        setEditing(false);
      }
    };

    return (
      <div className="date-cell-wrapper">
        {/*<div className="sticky-container">*/}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
            <Tooltip id="my-tooltip" />
            {suppliers.map((supplier: any) => {

              //var itemName = '';
             // supplier.items.forEach((item : any) => {
              //  itemName += ', '+item.itemName;
              //});

              return (
                <>
                <a
                 className={supplier.isFullPayment?'bookfilled-live':'bookfilled-error'}
                 data-tooltip-id="my-tooltip"
                 data-tooltip-content={supplier.supplierName +', '+ supplier.totalAmount + "Tk, Due "+(supplier.totalAmount - supplier.totalPayment)+'Tk'}
                 data-tooltip-place="top"
                 data-tooltip-type="success"
                 >
                 <BookFilled className='bookfilled' style={{color: supplier.supplierColorCode}} onClick={() => {showPaymentModal(currentDateString,supplier.isFullPayment,supplier.supplierId,supplier.supplierName,supplier.totalAmount,supplier.items)}} /> </a>
               </>
                
              )
            })}
          </div>
        </div>
        {
          totalDayQty > 0.0 && <span className={"label label-"+paymentStatus} style={{ paddingTop: '0px',paddingBottom:'0px',fontSize:11}}>
            {totalDayQty > 0.0 ? 'Paid: '+totalPayment+'Tk':''}
          </span>
        }
        
        <div className="events">
          {suppliers.length > 0 || totalDayQty > 0.0 || isEditing ? (
              listData.map((item: any) => (
                <div style={{ paddingTop: '2px' }}>
                  
                    <div
                      className="event invisible left-1 z-99 flex w-full flex-row justify-between rounded-sm border-l-[3px] border-primary bg-gray px-2 py-1 text-left opacity-0 dark:bg-meta-4 md:visible md:opacity-100"
                      key="1">
                      {isEditing ? (
                        <div className="events flex flex-row justify-between text-left opacity-0 dark:bg-meta-4 md:visible md:opacity-100">
                          <input
                            style={{ width: '100%', height:27}}
                            type="text"
                            placeholder="Edit"
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                          />
                         <div
                          style={{
                            padding: '1px',
                            marginLeft:'3px',
                            marginRight:'5px',
                            backgroundColor: '#D5EEFF',
                            borderRadius: '3px',
                            color: 'black',
                          }}> Tk </div>
                          
                          <SaveOutlined onClick={()=>handleSave(currentDateString)} />

                        </div>
                      ) : (
                        <React.Fragment>
                        <Badge
                              status={item.type as BadgeProps['status']}
                              text={item.content}
                          />
                         <div
                          style={{
                            padding: '1px',
                            marginRight:'5px',
                            backgroundColor: '#D5EEFF',
                            borderRadius: '3px',
                            color: 'black',
                          }}> Tk </div>
                           
                        </React.Fragment>
                      )}
                    </div>
                  
                </div>
                ))
          ):(
            <div style={{float:'right', paddingTop:'26px',paddingRight:'5px'}}>
              { /* <EditOutlined onClick={handleEdit} /> */}
            </div>
          )}
          
        </div>
      </div>
    );
  };

  const cellRender: CalendarProps<Dayjs>['cellRender'] = (value, info) => {
    if (info.type === 'date') return dateCellRender(value);
    if (info.type === 'month') return monthCellRender(value);
    return info.originNode;
  };

 // if(selectedDate{
 //   setSelectedDate (new Date().toLocaleDateString())
 // }

 const onselect = (date: any) => {
  if (date.isSame(selecteddate1, 'month')) {
    setSelecteddate1(date)
  }
};

 const disableddate = (currentdate: any) => {
    return currentdate.isSame(selecteddate1, 'month');
  };
  
  /*
  function onChangess (e: { target: { value: any; name: any; }; }){
            
    const value = e.target.value;
    /*
    setLavorazione({
        ...setLavorazione,
        [e.target.name]:value
    });
    */
    
    //console.log('[CHANGE-VALUE]', value)
 /*}*/

  return (
    <>
      <Breadcrumb pageName="Payment Plan" />
      
      <Calendar 
        className="my-calendar"
        cellRender={cellRender} 
       // disabledDate={disableddate}
        //onSelect={onselect}
        //onChange={(value) =>
         // onChange({ target: { value, name: "date" } })
        //}
       // value={selecteddate1}
        //defaultValue={dayjs('2024/02/10', 'YYYY/MM/DD')}
        headerRender={({ value, type, onChange, onTypeChange }) => {

          //console.log('Selected Day-Month-Year', value.day(),value.month()+1,value.year());

          calculateMonthWiseTotalAmount(value.year(),value.month()+1);

          const start = 0;
          const end = 12;
          const monthOptions = [];
          let current = value.clone();
          const localeData = value.localeData();
          const months = [];
          for (let i = 0; i < 12; i++) {
            current = current.month(i);
            months.push(localeData.monthsShort(current));
          }

          for (let i = start; i < end; i++) {
            monthOptions.push(
              <Select.Option key={i} value={i} className="month-item">
                {months[i]}
              </Select.Option>,
            );
          }

          const year = value.year();
          const month = value.month();
          const options = [];
          for (let i = 2022; i <= 2026; i += 1) {
            options.push(
              <Select.Option key={i} value={i} className="year-item">
                {i}
              </Select.Option>,
            );
          }


          return (
            <div style={{ padding: 16 }}>
              
              
               {/* start custom div  <Typography.Title level={4}> Payment Plan </Typography.Title> */}
              <div style={{ width: '50%', paddingTop : 10  }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    paddingBottom: '10px',
                  }}
                >
                  <p
                    style={{
                      padding: '5px',
                      borderRadius: '5px',
                      color: 'black',
                      width: 'auto',
                      fontSize: 15
                    }}
                  >
                    Total Amount for the selected month
                  </p>
                  <Input
                    style={{ width: 'auto', marginRight: '5px', height : '38px' }}
                    readOnly
                    placeholder="Total Required Materials"
                    value={monthWiseTotalAmount.toString()}
                  />
                  <p
                    style={{
                      padding: '8px',
                      backgroundColor: '#06c',
                      borderRadius: '5px',
                      color: 'white',
                    }}
                  >
                    Tk
                  </p>
                </div>
                {/*
                 <div
                  style={{
                    paddingTop: '10px',
                    paddingBottom: '10px',
                  }}
                  className="flex justify-end"
                >
                  <Button htmlType="submit" style={{color: 'black', height : '38px' , width : '100px',}}>Continue</Button>
                </div>
                */}
               
                 <div style={{
                    paddingTop: '10px',
                  }}>
                    <Row gutter={8}>
                    
                    <Col>
                      <Select
                        size="large"
                        dropdownMatchSelectWidth={true}
                        className="my-year-select"
                        value={year}
                        onChange={(newYear) => {
                          const now = value.clone().year(newYear);
                          console.log('Selected Year', now.day(),now.month()+1,now.year());
                          onChange(now);
                        }}
                      >
                        {options}
                      </Select>
                    </Col>
                    <Col>
                      <Select
                        size="large"
                        dropdownMatchSelectWidth={true}
                        value={month}
                        onChange={(newMonth) => {
                          const now = value.clone().month(newMonth);
                          console.log('Selected Month', now.day(),now.month()+1,now.year());
                          onChange(now);
                        }}
                      >
                        {monthOptions}
                      </Select>
                    </Col>
                    <Col>
                      <Radio.Group
                        size="large"
                        onChange={(e) => onTypeChange(e.target.value)}
                        value={type}
                      >
                        
                        <Radio.Button value="month">Month</Radio.Button>  <Radio.Button value="year">Year</Radio.Button>
                      </Radio.Group>
                    </Col>
                  </Row>
                </div>
                
              </div>
            </div>
          );
        }}
      />
      <PaymentSupplierWiseModal
        visible={isModalVisible}
        onClose={handleCancel}
        onSubmit={onSubmitPayment}
        onChange = {onChangeAmount}
        selectedDate = {selectedDate}
        selectedSupplierName = {selectedSupplierName}
        selectedTotalAmount = {selectedTotalAmount}
        paymentList = {paymentList}
        isFullPayment = {isFullPayment}
      />
     
      {<LoadingModal isLoading={loading} onClose = {handleLoading} />}
    </>
  );
};

export default PaymentPlan;

function setLavorazione(arg0: any) {
  throw new Error('Function not implemented.');
}

