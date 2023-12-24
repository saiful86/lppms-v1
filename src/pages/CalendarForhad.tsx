import React from 'react';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type { BadgeProps } from 'antd';
//import type { Moment } from 'moment';
import { Badge, Calendar, Button, Select, Input, Modal, Form, Alert, Typography, Row, Col, Radio,theme} from 'antd';
/* 
   https://ant.design/components/calendar#components-calendar-demo-customize-header 
   https://ant.design/components/calendar#components-calendar-demo-basic
   https://ant.design/components/calendar#components-calendar-demo-basic
   https://2x.ant.design/components/calendar/
*/
import {
  EditOutlined,
  SaveOutlined,
  BookFilled,
  PlusCircleOutlined,
} from '@ant-design/icons';

import { useState } from 'react';
import { CalendarMode } from 'antd/es/calendar/generateCalendar';
import type { CalendarProps } from 'antd';
import dayLocaleData from 'dayjs/plugin/localeData';
import 'react-tooltip/dist/react-tooltip.css'
//import { Tooltip as ReactTooltip } from 'react-tooltip'
import { Tooltip } from 'react-tooltip'

dayjs.extend(dayLocaleData);

const CustomCalendar: React.FC = () => {

  const { token } = theme.useToken();

  const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>['mode']) => {
    console.log('onPanelChange 35')
    console.log(value.format('YYYY-MM-DD'), mode);
  };

  const wrapperStyle: React.CSSProperties = {
    width: 300,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  };


  const [value, setValue] = useState(() => dayjs('2017-01-25'));
  const [selectedValue, setSelectedValue] = useState(() => dayjs('2017-01-25'));

  const onSelect = (newValue: Dayjs) => {
    console.log('onSelect 49');
    setValue(newValue);
    setSelectedValue(newValue);
  };

  /*
  const onPanelChange = (newValue: Dayjs) => {
   // console.log(value.format('YYYY-MM-DD'), mode);
    console.log('onPanelChange');
    setValue(newValue);
  };*/

  /*
  const onPanelChange2 = (value: Moment, mode: CalendarMode) => {
    console.log(value.format('YYYY-MM-DD'), mode);
  };*/
  
  const getListData = (value: Dayjs) => {
    let listData;
    console.log('getListData '+ value.date() +','+value.day()+','+value.daysInMonth()+','+value.month()+','+value.year())
    /*
    console.log(value.date())
    console.log(value.day())
    console.log(value.daysInMonth())
    console.log(value.month)
    console.log(value.year)*/
    var delayInMilliseconds = 1000 * 10; //10 second
    setTimeout(function() {
      //your code to be executed after 1 second
    }, delayInMilliseconds);

    switch (value.date()) {
      case 8:
        listData = [{ type: 'success', content: '50 MT' }];
        break;
      case 10:
        listData = [{ type: 'success', content: '500 MT' }];
        break;
      case 15:
        listData = [{ type: 'error', content: '500 MT' }];
        break;
      case 30:
        listData = [{ type: 'error', content: '500 MT' }];
        break;
      default:
    }
    return listData || [];
  };

  // Modal
  const [isModalOpen, setModalOpen] = useState(false);

    const handleOk = () => {
      // Handle the OK action if needed
      setModalOpen(false);
    };

    const handleCancel = () => {
      // Handle the cancel action if needed
      setModalOpen(false);
    };

  //Inside Modal Select

  const onChange = (value: string) => {
    console.log(`selected 99 ${value}`);
  };

  const onSearch = (value: string) => {
    console.log('search: 103', value);
  };

 // const cellRender = (value: Dayjs) => {
  const cellRender: CalendarProps<Dayjs>['fullCellRender'] = (value, info) => {

    console.log('Type 110:', info.type);

    const listData = getListData(value);

      const showModal = () => {
        // Open the modal when the plus button is clicked
        setModalOpen(true);
      };

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
          <div className="events">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                    <Tooltip id="my-tooltip" />
                    {
                    //<Tooltip  id="my-tooltip2"  anchorSelect=".my-anchor-element" place="top">
                      //Hello world2!
                    //</Tooltip>
                    }
                    {listData.map((item, index) => (
                        <> 
                    <a
                      data-tooltip-id="my-tooltip"
                      data-tooltip-content="Hi!"
                      data-tooltip-place="top"
                      data-tooltip-type="success">
                      <BookFilled style={{ color: 'red' }}/></a>
                      </>
                    ))}

                      {
                      //<BookFilled style={{ color: 'green' }}/>
                      //<BookFilled style={{ color: 'yellow' }} />
                      //<BookFilled style={{ color: 'black' }} />
                      }
              </div>
              <PlusCircleOutlined onClick={showModal}/>
          </div>
          {listData.map((item, index) => (
              <>
                <div style={{ paddingTop: '20px' }}>
                  <div
                    className="event invisible left-1 z-99 flex w-full flex-row justify-between rounded-sm border-l-[3px] border-primary bg-gray px-2 py-1 text-left opacity-0 dark:bg-meta-4 md:visible md:opacity-100"
                    key={index}
                  >
                    {isEditing ? (
                      <div className="events flex flex-row justify-between text-left opacity-0 dark:bg-meta-4 md:visible md:opacity-100">
                        <input
                          style={{ width: '100%', height:27}}
                          type="text"
                          placeholder="Edit"
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                        />
                        <SaveOutlined onClick={handleSave} />
                      </div>
                    ) : (
                      <React.Fragment>
                        <Badge
                          status={item.type as BadgeProps['status']}
                          text={item.content}
                        />
                        <EditOutlined onClick={handleEdit}  style={{height:27}}/>
                      </React.Fragment>
                    )}
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>
      );
  };

  // Filter `option.label` match the user type `input`
  const filterOption = (
    input: string,
    option?: { label: string; value: string },
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const onFinish = (values: any) => {
    console.log('Form submission data:', values);
    // Handle the form submission, e.g., send data to the server
  };

  return (
    <div>
      { /* <Alert message={`You selected date: ${selectedValue?.format('YYYY-MM-DD')}`} /> */ } 
      <Calendar
         //className="ant-fullcalendar"
          className="my-calendar"
          
          
          //fullCellRender={cellRender}
          //dateCellRender={cellRender} 
          //monthCellRender={cellRender}
          /*
          style={{
            width: "100%",
            background: "deep-blue",
            border: "2px",
            marginTop: "10px",
            marginLeft: "-13px",
            }}
            */
           /*
            locale={{ 
              lang: { 
                 locale: 'en', 
                 dayFormat: moment.updateLocale('en', { 
                            weekdaysMin: [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ]
                 }) 
               } 
            }} 
            */

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
                   <div style={{
                      paddingTop: '20px',
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
                  <div
                    style={{
                      paddingBottom: '10px',
                    }}
                    className="flex justify-end"
                  >
                    <Button htmlType="submit" style={{color: 'black', height : '38px' , width : '100px',}}>Continue</Button>
                  </div>
                </div>
              </div>
            );
          }}
          />



      <Modal
        title="Supplier"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null} >
        <>
          <Form onFinish={onFinish}>
            <div style={{ marginBottom: '10px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                }}
              >
                <p
                  style={{
                    padding: '8px',
                    backgroundColor: '#06c',
                    borderRadius: '5px',
                    width: '50%',
                    marginRight: '10px',
                    color: 'white',
                  }}
                >
                  Select Supplier
                </p>
                <Select
                  showSearch
                  placeholder="Select Supplier"
                  optionFilterProp="children"
                  onChange={onChange}
                  onSearch={onSearch}
                  filterOption={filterOption}
                  style={{ width: '100%', height:'38px'}}
                  options={[
                    {
                      value: 'GDL',
                      label: 'GDL',
                    },
                    {
                      value: 'DHL',
                      label: 'DHL',
                    },
                    {
                      value: 'Pathao',
                      label: 'Pathao',
                    },
                  ]}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                }}
              >
                <p
                  style={{
                    padding: '8px',
                    backgroundColor: '#06c',
                    borderRadius: '5px',
                    width: '50%',
                    marginRight: '10px',
                    color: 'white',
                  }}
                >
                  Select Material
                </p>
                <Select
                  showSearch
                  placeholder="Select Material"
                  optionFilterProp="children"
                  onChange={onChange}
                  onSearch={onSearch}
                  filterOption={filterOption}
                  style={{ width: '100%', height:'38px'}}
                  options={[
                    {
                      value: 'Hard Lead',
                      label: 'Hard Lead',
                    },
                    {
                      value: 'Pure Lead 99.97% & 99.985%',
                      label: 'Pure Lead 99.97% & 99.985%',
                    },
                    {
                      value: 'Lead Antimony 2.75%',
                      label: 'Lead Antimony 2.75%',
                    },
                    {
                      value: 'Lead Antimony 3.2%',
                      label: 'Lead Antimony 3.2%',
                    },
                  ]}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                }}
              >
                <p
                  style={{
                    padding: '8px',
                    backgroundColor: '#06c',
                    borderRadius: '5px',
                    width: '50%',
                    marginRight: '10px',
                    color: 'white',
                  }}
                >
                  Input Rate
                </p>
                <Input style={{ width: '100%', height:'38px'}} placeholder="Input Rate" />
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                }}
              >
                <p
                  style={{
                    padding: '8px',
                    backgroundColor: '#06c',
                    borderRadius: '5px',
                    width: '50%',
                    marginRight: '10px',
                    color: 'white',
                  }}
                >
                  VAT
                </p>
                <Input style={{ width: '100%', height:'38px'}} placeholder="VAT" />
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                }}
              >
                <p
                  style={{
                    padding: '8px',
                    backgroundColor: '#06c',
                    borderRadius: '5px',
                    width: '50%',
                    marginRight: '10px',
                    color: 'white',
                  }}
                >
                  AIT
                </p>
                <Input style={{ width: '100%', height:'38px'}} placeholder="AIT" />
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <p
                  style={{
                    padding: '8px',
                    backgroundColor: '#06c',
                    borderRadius: '5px',
                    width: '50%',
                    marginRight: '10px',
                    color: 'white',
                  }}
                >
                  Material
                </p>
                <Input
                  style={{ width: '85%', marginRight: '5px', height:'38px'}}
                  placeholder="Material"
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
            </div>
            <div className="flex justify-end">
              <Button htmlType="submit">Continue</Button>
            </div>
          </Form>
        </>
      </Modal>
    </div>
  );
};

export default CustomCalendar;
