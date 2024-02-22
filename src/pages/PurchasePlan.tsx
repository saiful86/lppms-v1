import React, {useState} from 'react';
import type { Dayjs } from 'dayjs';
import type { BadgeProps, CalendarProps } from 'antd';
import { Badge, Calendar, Select,Input, message,Typography, Row, Col, Radio} from 'antd';
import {
  EditOutlined,
  SaveOutlined,
  BookFilled,
  PlusCircleOutlined,
} from '@ant-design/icons';

import {
  useGetAllPlansQuery,
  useAddPurchasePlanDataMutation,
  useAddPlanForSupplierDataMutation,
  useDeletePlanDataMutation
} from '../redux/services/products/productApi';

import dayjs from 'dayjs';
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip } from 'react-tooltip'
import LoadingModal from './UiElements/LoadingModal';
import AddPlanModal from './UiElements/AddPlanModal';
import PlanDetailsModal from './UiElements/PlanDetailsModal';
import Breadcrumb from '../components/Breadcrumb';

const getMonthData = (value: Dayjs) => {
  if (value.month() === 8) {
    return 1394;
  }
};

const PurchasePlan = () => {

  const [isVisibleAddPlanModal, setIsVisibleAddPlanModal] = useState(false);
  const [isVisiblePlanDetilsModal, setIsVisiblePlanDetilsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [monthWiseTotalQty, setMonthWiseTotalQty] = useState(0.0);
  const [selectedSupplierid, setSelectedSupplierid] = useState(0);
  const [selectedSupplierName, setSelectedSupplierName] = useState('');
  const [selectedSupplierItems, setSelectedSupplierItems] = useState([]);
  const [selectedTotalQty, setSelectedTotalQty] = useState(0);

  const handleLoading = () => {
    setLoading(!loading);
  };

  const showAddPlanModal = (selectedDate : string) => {
    console.log(selectedDate, 'showAddPlanModal-> Selected Date');
    setSelectedDate(selectedDate);
    setIsVisibleAddPlanModal(true);
  };

  const handleCancelAddPlanModal = () => {
    setIsVisibleAddPlanModal(false);
  };

  const showPlanDetailsModal = (selectedDate : string, supplierid : number, supplierName : string, totalQty : any, items : any) => {
    console.log(selectedDate, 'showPlanDetailsModal-> '+supplierid);
   
    setSelectedDate(selectedDate);
    setSelectedSupplierid(supplierid);
    setSelectedSupplierName(supplierName);
    setSelectedSupplierItems(items);
    setSelectedTotalQty(totalQty);
    setIsVisiblePlanDetilsModal(true);
  };

  const handleCancelPlanDetailsModal = () => {
    setIsVisiblePlanDetilsModal(false);
  };

  const [addPlanForSingleDay] = useAddPurchasePlanDataMutation();
  const [addPlanForSupplier] = useAddPlanForSupplierDataMutation();
  const [deletePlan] = useDeletePlanDataMutation();

  /* Add Plan for Supplier Modal -> On Submit Method */
  const onSubmit = async (values:any) => {
    try {
      console.log('on submit:', values);
      setLoading(true);

      const res = await addPlanForSupplier(values);
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
      handleCancelAddPlanModal();
    }
  };


  /* Call From  PlanDetailsModal, when delete the item */
  const onDeletePlan = async (date:string, supplierId:number, itemId:number ) => {

      try {

        console.log('onDeletePlan:', date + ',supplierId '+supplierId+', itemId '+itemId);

        setLoading(true);

        const apiDataResponse = {planDate: date, supplierId:supplierId, itemId: itemId}
  
        const res = await deletePlan(apiDataResponse);
        const errorMessage = res?.data?.message;
  
        if (res) {
          if (res?.data?.code === 400) {
            message.error(errorMessage);
            console.log(errorMessage, 'error message');
          } else if ('data' in res && res.data) {
            message.success('Plan deleted successfully!');
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
        handleCancelPlanDetailsModal();
      }
  };

  // get data
  const { data = [] } = useGetAllPlansQuery({});


  // Destructuring the array of objects
  const destructuredData = data.map(
    ({
      id,
      year,
      month,
      day,
      planDate,
      totalQty,
      hasUnprocessedQty,
      totalUnProcessedQty,
      hardLead_Status,
      pureLead_99_97_Status,
      pureLead_99_98_Status,
      leadAlloy_2_75_Status,
      leadAlloy_3_2_Status,
      suppliers
    }: {
      id: number;
      year:number;
      month:number;
      day:number;
      planDate: string; // Add the type for the 'date' property
      totalQty : number;
      totalUnProcessedQty:number,
      hasUnprocessedQty:boolean;
      hardLead_Status:string;
      pureLead_99_97_Status:string;
      pureLead_99_98_Status:string;
      leadAlloy_2_75_Status:string;
      leadAlloy_3_2_Status:string;

      suppliers : {
        childId:number;
        masterId:number;
        supplierId:number;
        supplierName: string;
        supplierColorCode: string;
        totalQty: number;
        totalAmount: number;
        items :{
          childId:number;
          masterId:number;
          supplierId:number;
          itemId:number;
          itemName:string;
          itemDisplayName:string;
          itemRate:number;
          vat:number;
          ait:number;
          itemQty:number;
          amount:number;
        }
      };
    }) => ({
      id,
      year,
      month,
      day,
      planDate,
      totalQty,
      hasUnprocessedQty,
      totalUnProcessedQty,
      hardLead_Status,
      pureLead_99_97_Status,
      pureLead_99_98_Status,
      leadAlloy_2_75_Status,
      leadAlloy_3_2_Status,
      suppliers,
    }),
  );

  //console.log(destructuredData, 'Destructure Data');

  /* Calculate Month wise Total Quantity */
  const calculateMonthWiseTotalQty = async (year : number, month : number) => {
    //console.log('calculateMonthWiseTotalQty selected month',month)
    var totalMonthQty = 0.0;
    if(destructuredData){
      destructuredData.forEach((data : any) => {
        if(data.year === year && data.month === month){
          totalMonthQty += data.totalQty;
        }
      });
    }
    setMonthWiseTotalQty(totalMonthQty);
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
      const listData = filteredData.map (
        (item: { totalQty: any, totalUnProcessedQty: any, suppliers: any, hasUnprocessedQty: boolean,hardLead_Status:string, 
          pureLead_99_97_Status:string, pureLead_99_98_Status:string, leadAlloy_2_75_Status:string, leadAlloy_3_2_Status:string }) => ({
          type: item.hasUnprocessedQty?'error':'success',
          content: `${item.totalQty}`,
          totalUnProcessedQty: item.totalUnProcessedQty,
          suppliers: item.suppliers,
          hardLead_Status:item.hardLead_Status,
          pureLead_99_97_Status:item.pureLead_99_97_Status,
          pureLead_99_98_Status:item.pureLead_99_98_Status,
          leadAlloy_2_75_Status:item.leadAlloy_2_75_Status,
          leadAlloy_3_2_Status:item.leadAlloy_3_2_Status
        }),
      );
  
      return listData || [];
    }else{
      return [{
        type: 'default',
        content: '',
        totalUnProcessedQty: 0,
        suppliers: [],
        hardLead_Status:'',
        pureLead_99_97_Status:'',
        pureLead_99_98_Status:'',
        leadAlloy_2_75_Status:'',
        leadAlloy_3_2_Status:''
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
    var suppliers : any = []
    var hardLead_Status : String = "";
    var pureLead_99_97_Status : String = "";
    var pureLead_99_98_Status : String = "";
    var leadAlloy_2_75_Status : String = "";
    var leadAlloy_3_2_Status : String = "";


    if(listData && listData.length > 0){
      totalDayQty = listData[0].content;
      suppliers = listData[0].suppliers; 
      hardLead_Status = listData[0].hardLead_Status;
      pureLead_99_97_Status = listData[0].pureLead_99_97_Status;
      pureLead_99_98_Status = listData[0].pureLead_99_98_Status;
      leadAlloy_2_75_Status = listData[0].leadAlloy_2_75_Status;
      leadAlloy_3_2_Status = listData[0].leadAlloy_3_2_Status;
    }

    //const currentDateString = value.format('DD-MM-YYYY');
    const currentDateString = value.format('YYYY-MM-DD');

    //console.log(currentDateString, 'Selected Date');
    //console.log(totalDayQty, 'totalDayQty');
    //console.log(suppliers, 'suppliers');

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
          //handleCancelAddPlanModal();
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
                //supplier.items.forEach((item : any) => {
                //  itemName += ', '+item.itemName;
               // });

                return (
                  <>
                  <a
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content={supplier.supplierName +', '+ supplier.totalQty + "MT"}
                    data-tooltip-place="top"
                    data-tooltip-type="success">
                    <BookFilled style={{ color: supplier.supplierColorCode}} onClick={() => {showPlanDetailsModal(currentDateString,supplier.supplierId,supplier.supplierName,supplier.totalQty,supplier.items)}} /></a>
                 
                  </>
                )
              })}
            </div>
            {totalDayQty > 0 ? (
               <PlusCircleOutlined className="sticky-plus" type="primary" onClick={() => showAddPlanModal(currentDateString)} />
            ):(<></>)}
           
        </div>

        { totalDayQty > 0 ? (
          <div className="flex flex-row" style={{ paddingTop: '5px' }}>
            
            <a
              data-tooltip-id="my-tooltip"
              data-tooltip-content={"Hard Lead, "+hardLead_Status}
              data-tooltip-place="top"
              data-tooltip-type="success">  <Badge className="flex flex-row" status= {hardLead_Status=='Ok'?'success':'error'} style={{ paddingRight: '4px' }} /></a>
            <a
              data-tooltip-id="my-tooltip"
              data-tooltip-content={"Pure Lead 99.97%, "+pureLead_99_97_Status}
              data-tooltip-place="top"
              data-tooltip-type="success">  <Badge className="flex flex-row" status= {pureLead_99_97_Status=='Ok'?'success':'error'} style={{ paddingRight: '4px' }} /></a>
            <a
              data-tooltip-id="my-tooltip"
              data-tooltip-content={"Pure Lead  99.985%, "+pureLead_99_98_Status}
              data-tooltip-place="top"
              data-tooltip-type="success">  <Badge className="flex flex-row" status= {pureLead_99_98_Status=='Ok'?'success':'error'} style={{ paddingRight: '4px' }} /></a>
            <a
              data-tooltip-id="my-tooltip"
              data-tooltip-content={"Lead Alloy 2.75%, "+leadAlloy_2_75_Status}
              data-tooltip-place="top"
              data-tooltip-type="success">  <Badge className="flex flex-row" status= {leadAlloy_2_75_Status=='Ok'?'success':'error'} style={{ paddingRight: '4px' }} /></a>
            <a
              data-tooltip-id="my-tooltip"
              data-tooltip-content={"Lead Alloy 3.2%, "+leadAlloy_3_2_Status}
              data-tooltip-place="top"
              data-tooltip-type="success">  <Badge className="flex flex-row" status= {leadAlloy_3_2_Status=='Ok'?'success':'error'} style={{ paddingRight: '4px' }} /></a>
          </div>
          ): (
            <></>
          )
        }

        <div className="events">
          {suppliers.length > 0 || totalDayQty > 0.0 || isEditing ? (
              listData.map((item: any) => (
                <div style={{ paddingTop: '10px' }}>
                  
                    <div
                      className="event invisible left-1 z-99 flex w-full flex-row justify-between rounded-sm border-l-[3px] border-primary bg-gray px-2 py-1 text-left opacity-0 dark:bg-meta-4 md:visible md:opacity-100"
                      key="1">
                      {isEditing ? (
                        <div className="events flex flex-row justify-between text-left opacity-0 dark:bg-meta-4 md:visible md:opacity-100">
                          <input
                            style={{ width: '100%', height:27}}
                            type="text"
                            placeholder="Enter Total Qty"
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
                          }}> MT </div>
                          
                          <SaveOutlined onClick={()=>handleSave(currentDateString)} />

                        </div>
                      ) : (
                        <React.Fragment>
                        <Badge
                              status={item.type as BadgeProps['status']}
                              text={`${item.content - item.totalUnProcessedQty}` +'-'+ item.content}
                          />
                         <div
                          style={{
                            padding: '1px',
                            marginRight:'5px',
                            backgroundColor: '#D5EEFF',
                            borderRadius: '3px',
                            color: 'black',
                          }}> MT </div>
                           <EditOutlined onClick={()=>handleEdit(totalDayQty)}  style={{height:27}}/>
                        </React.Fragment>
                      )}
                    </div>
                  
                </div>
                ))
          ):(
            <div style={{float:'right', paddingTop:'26px',paddingRight:'5px'}}>
              <EditOutlined onClick={handleEdit} />
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


  return (
    <>
      <Breadcrumb pageName="Purchase Plan" />
      
      <Calendar 
        className="my-calendar"
        cellRender={cellRender} 
        style={{
          height: "auto",
          width: "auto"
        }}

        headerRender={({ value, type, onChange, onTypeChange }) => {

          calculateMonthWiseTotalQty(value.year(),value.month()+1);

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
              
               {/* start custom div  <Typography.Title level={4}> Purchase Plan </Typography.Title> */}
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
                    Total Materials for the selected month
                  </p>
                  <Input
                    style={{ width: 'auto', marginRight: '5px', height : '38px' }}
                    readOnly
                    placeholder="Total Required Materials"
                    value={monthWiseTotalQty.toString()}
                  />
                  <p
                    style={{
                      padding: '8px',
                      backgroundColor: '#06c',
                      borderRadius: '5px',
                      color: 'white',
                    }}
                  >
                    MT
                  </p>
                </div>
                
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
      
      <AddPlanModal
        visible={isVisibleAddPlanModal}
        onClose={handleCancelAddPlanModal}
        onSubmit={onSubmit}
        selectedDate = {selectedDate}
      />

      <PlanDetailsModal
        visible={isVisiblePlanDetilsModal}
        onClose={handleCancelPlanDetailsModal}
        onDelete={onDeletePlan}
        selectedDate = {selectedDate}
        supplierid = {selectedSupplierid}
        selectedSupplierName = {selectedSupplierName}
        selectedTotalQty = {selectedTotalQty}
        items = {selectedSupplierItems}
      />
     
      {<LoadingModal isLoading={loading} onClose = {handleLoading} />}
      
    </>
  );
};

export default PurchasePlan;

function setLavorazione(arg0: any) {
  throw new Error('Function not implemented.');
}