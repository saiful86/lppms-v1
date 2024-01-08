import React, { useState } from 'react';
import type { Dayjs } from 'dayjs';
//import dayjs from 'dayjs';
import type { BadgeProps, CalendarProps } from 'antd';
import { Badge, Calendar, Select, Modal, Form,Alert, Input, Button, message,Typography, Row, Col, Radio, theme} from 'antd';
import {
  EditOutlined,
  SaveOutlined,
  BookFilled,
  PlusCircleOutlined,
} from '@ant-design/icons';

import {
  useGetAllPlansQuery,
  useAddMaterialDataMutation,
} from '../redux/services/products/productApi';

import Loading from '../loading';
import dayjs from 'dayjs';
import MyFormModal from '../pages/UiElements/Modal';
import 'react-tooltip/dist/react-tooltip.css'
//import { Tooltip as ReactTooltip } from 'react-tooltip'
import { Tooltip } from 'react-tooltip'


const getMonthData = (value: Dayjs) => {
  if (value.month() === 8) {
    return 1394;
  }
};

const MyCalendar = () => {

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const showModal = (selectedDate : string) => {

    console.log(selectedDate, 'showModal-> Selected Date');
    setSelectedDate(selectedDate);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const [addMaterial] = useAddMaterialDataMutation();

  const onSubmit = async (values:any) => {
    try {
      console.log('on submit:', values);
      setLoading(true);

      const res = await addMaterial(values);
      const errorMessage = res?.data?.message;

      if (res) {
        if (res?.data?.code === 400) {
          message.error(errorMessage);
          console.log(errorMessage, 'error message');
        } else if ('data' in res && res.data) {
          message.success('Material created successfully!');
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
      handleCancel();
    }
  };

  // get data
  const { data = [] } = useGetAllPlansQuery({});

  if (!data) {
    return <Loading />;
  }

  console.log(data, 'Calendar Data');

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
      suppliers,
    }: {
      id: number;
      year:number;
      month:number;
      day:number;
      planDate: string; // Add the type for the 'date' property
      totalQty : number;
      hasUnprocessedQty:boolean;
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
      suppliers,
    }),
  );

  console.log(destructuredData, 'Destructure Data');

  const getCalendarCellData = (value: any) => {
    
    const currentDateString = value.format('YYYY-MM-DD');

    // Filter the API data for the current date
    const filteredData = destructuredData.filter(
      (item: { planDate: string | number | Date | Dayjs | null | undefined }) =>
        dayjs(item.planDate).format('YYYY-MM-DD') === currentDateString,
    );

    // Map the filtered data to the desired format for the calendar
    if(filteredData && filteredData.length >0){
      const listData = filteredData.map(
        (item: { totalQty: any; suppliers: any, hasUnprocessedQty: boolean }) => ({
          type: item.hasUnprocessedQty?'error':'success',
          content: `${item.totalQty}`,
          suppliers: item.suppliers
        }),
      );
  
      return listData || [];
    }else{
      return [{
        type: 'default',
        content: '',
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

    const listData = getCalendarCellData(value);

    var suppliers : any = []
    if(listData && listData.length > 0){
      suppliers = listData[0].suppliers;
    }

    //const currentDateString = value.format('DD-MM-YYYY');
    const currentDateString = value.format('YYYY-MM-DD');

    //console.log(currentDateString, 'Selected Date');
    console.log(suppliers, 'suppliers');

    const [isEditing, setEditing] = React.useState(false);
    const [editedContent, setEditedContent] = React.useState('');

    const handleEdit = () => {
      console.log('handleEdit : 123');
      setEditing(!isEditing);
    };

    const handleSave = () => {
      if (editedContent.trim() !== '') {
        console.log('Updated data:', {
          type: 'success',
          content: editedContent,
        });
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
            {suppliers.map((item: any) => (
              <>
               <a
                data-tooltip-id="my-tooltip"
                data-tooltip-content={item.supplierName + "," + item.totalQty+"M"}
                data-tooltip-place="top"
                data-tooltip-type="success">
                <BookFilled style={{ color: item.supplierColorCode}}/></a>
              </>
            ))}
          </div>
          <PlusCircleOutlined className="sticky-plus" type="primary" onClick={() => showModal(currentDateString)} />
        </div>
        <div className="events">
          {suppliers.length > 0 || isEditing ? (
              listData.map((item: any) => (
                <div style={{ paddingTop: '20px' }}>
                  
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
                            backgroundColor: '#06c',
                            borderRadius: '3px',
                            color: 'white',
                          }}> MT </div>
                          
                          <SaveOutlined onClick={handleSave} />

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
                            backgroundColor: '#06c',
                            borderRadius: '3px',
                            color: 'white',
                          }}> MT </div>
                           <EditOutlined onClick={handleEdit}  style={{height:27}}/>
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
      <Calendar 
        className="my-calendar"
        cellRender={cellRender} 
        headerRender={({ value, type, onChange, onTypeChange }) => {
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
          for (let i = year - 10; i < year + 10; i += 1) {
            options.push(
              <Select.Option key={i} value={i} className="year-item">
                {i}
              </Select.Option>,
            );
          }
          return (
            <div style={{ padding: 16 }}>
              <Typography.Title level={4}> Purchase Plan </Typography.Title>
              
               {/* start custom div */}
              <div style={{ width: '35%', paddingTop : 10  }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: '10px',
                  }}
                >
                  <p
                    style={{
                      padding: '5px',
                      borderRadius: '5px',
                      color: 'black',
                      width: '250px',
                      fontSize: 15
                    }}
                  >
                    Total Required Materials
                  </p>
                  <Input
                    style={{ width: '80%', marginRight: '5px', height : '38px' }}
                    placeholder="Enter Total Materials"
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
                <div
                  style={{
                    paddingTop: '10px',
                    paddingBottom: '10px',
                  }}
                  className="flex justify-end"
                >
                  <Button htmlType="submit" style={{color: 'black', height : '38px' , width : '100px',}}>Continue</Button>
                </div>
                 <div style={{
                    paddingTop: '0px',
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
      <MyFormModal
        visible={isModalVisible}
        onClose={handleCancel}
        onSubmit={onSubmit}
        selectedDate = {selectedDate}
      />
    </>
  );
};

export default MyCalendar;
