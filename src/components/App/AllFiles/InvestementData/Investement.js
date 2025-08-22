
import React, { useEffect, useState } from "react";
import {
  Button,
  Row,
  Col,
  Card,
  Form,
  FormGroup,
  Modal,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
// import "../../../../assets/css/box.css";
import DataTableExtensions from "react-data-table-component-extensions";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
// import { API_URL, Catogery_img } from "../../../../service";
import { ToastContainer } from "react-toastify";
import { toast, Slide, Flip } from "react-toastify";
import Swal from "sweetalert2";
import { API_URL } from "../../../../service";
import { Label } from "@material-ui/icons";

function CategoryManagement() {
  const [data, setData] = useState();
  const [loading,setLoading]=useState(true)
  const [selectedDate, setSelectedDate] = useState('');
  const [type,setType]=useState('')
  const [total,setTotal]=useState('')

 const navigate = useNavigate();

  function convertArrayOfObjectsToCSV(array) {
    let result;

    const columnDelimiter = ",";
    const lineDelimiter = "\n";
    const keys = Object.keys(data[0]);

    result = "";
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    array.forEach((item) => {
      let ctr = 0;
      keys.forEach((key) => {
        if (ctr > 0) result += columnDelimiter;

        result += item[key];

        ctr++;
      });
      result += lineDelimiter;
    });

    return result;
  }


  
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handelmonth =(e)=> {
    const selctmonth = e.target.value
    console.log("selectmonth",selctmonth)
    setType(selctmonth)
    getAllUsersData(selctmonth);
  }

  useEffect(()=> {
    if(!selectedDate && !type) {
        alldata();
    }
  },[])

const alldata =()=> {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
        var raw = JSON.stringify({
            "date":'',
            "type": ''
        });

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

    console.log('raw',raw)

    fetch(API_URL + `report_investmentData`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("all_data",result);
        setData(result.response);
        setTotal(result.investmentData);
  
      })
      .catch((error) => {
        console.log("error", error)});
}


  const getAllUsersData = (type_value) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var finalType = type_value || type

        var raw = JSON.stringify({
            "date":selectedDate,
            "type": finalType
        });

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

    console.log('raw',raw)

    fetch(API_URL + `report_investmentData`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("all_data",result);
        setData(result.response);
        setTotal(result.investmentData);
        setType('');
  
      })
      .catch((error) => {
        console.log("error", error)});
  };



  const showToastMessage = (message) => {
    return new Promise((resolve) => {
      toast.success(message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
        onClose: () => {
          resolve(); 
        },
      });
    });
  };

  function downloadCSV(array) {
    const link = document.createElement("a");
    let csv = convertArrayOfObjectsToCSV(array);
    if (csv == null) return;

    const filename = "export.csv";

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", filename);
    link.click();
  }

  const Export = ({ onExport }) => (
    <Button onClick={(e) => onExport(e.target.value)}>Export</Button>
  );
  const actionsMemo = React.useMemo(
    () => <Export onExport={() => downloadCSV(data)} />,
    []
  );
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [toggleCleared, setToggleCleared] = React.useState(false);
  let selectdata = [];
  const handleRowSelected = React.useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);
  const contextActions = React.useMemo(() => {
    const Selectdata = () => {
      if (window.confirm(`download:\r ${selectedRows.map((r) => r.SNO)}?`)) {
        setToggleCleared(!toggleCleared);
        data.map((e) => {
          selectedRows.map((sr) => {
            if (e.SNO === sr.SNO) {
              selectdata.push(e);
            }
            return sr;
          });
          return e;
        });
        downloadCSV(selectdata);
      }
    };
    return <Export onExport={() => Selectdata()} icon="true" />;
  }, [data, selectdata, selectedRows]);
  const [allData, setAllData] = useState();

  let allElement2 = [];

  let myfunction = (InputData) => {
    for (let allElement of data) {
      if (allElement.Name.toLowerCase().includes(InputData.toLowerCase())) {
        if (allElement.Name.toLowerCase().startsWith(InputData.toLowerCase())) {
          allElement2.push(allElement);
        }
      }
    }
    setAllData(allElement2);
  };



 




  const columns = [
    {
      name: "Customer Name",
      selector: (row) => row.name,
      sortable: true,
      wrap: true,
      minWidth: "200px",
    
    },

    {
      name: "Customer Number",
      selector: (row) => row.customerData.mobile,
      sortable: true,
      wrap: true,
    
    },

    

    {
      name: "Amount",
      selector: (row) => row.amount,
      sortable: true,
      wrap: true,
    
    },
    {
      name: " Collection Amount",
      selector: (row) => row.collection_amount,
      sortable: true,
      wrap: true,
    
    },
    {
        name: "Plan",
        selector: (row) => row.planDP,
        sortable: true,
        wrap: true,
      
      },

      {
        name: "Total Days",
        selector: (row) => row.total_Days,
        sortable: true,
        wrap: true,
      
      },
      {
        name: "Amount Collected",
        selector: (row) => row.amount_collected,
        sortable: true,
        wrap: true,
      
      },

      {
        name: "pending Amount",
        selector: (row) => row.pending_amount,
        sortable: true,
        wrap: true,
      
      },
      
      {
        name: "pending Days",
        selector: (row) => row.pendin_days,
        sortable: true,
        wrap: true,
      
      },

  ];

  

  const tableData = {
    columns,
    data
  };

  return (
    <div>
      <div className="breadcrumb-header justify-content-between">
      </div>
 
      <Row className="row-sm">
      <h5>Investement Report </h5>
     
     

        <Col lg={12}>
        <Card className="custom-card">

     <div style={{display:'flex',flexDirection:'row',gap:5, justifyContent:'flex-end',paddingRight:10}}>
     <FormGroup style={{ marginTop: 20, border: '1px solid #38cab3', borderRadius: 5 }} className="form-group">
      <input
        type="date"
        className="form-control border"
        value={selectedDate}
        onChange={handleDateChange}
      />
    </FormGroup>

      <FormGroup style={{marginTop:20,border:'1px solid #38cab3', borderRadius:5}} className="form-group">
        <select
          className="form-control border"
          value={type}
          onChange={handelmonth}
        >
          <option value="">Select a Type</option>
           <option value='daily'>Daily</option>
           <option value='weekly'>Weekly</option>
           <option value='monthly'>Monthly</option>
           <option value='yearly'>Yearly</option>
        </select>
      </FormGroup>

      </div>


          <Card.Body>
           <span style={{fontSize:20}}>Investement Total Amount : <b>{total}</b></span>
            <div className="table-responsive ">
              <span className="datatable">
                <span className="uselistdata">
                  <DataTableExtensions {...tableData}>
                    <DataTable
                      columns={columns}
                      data={data}
                      actions={actionsMemo}
                      contextActions={contextActions}
                      onSelectedRowsChange={handleRowSelected}
                      clearSelectedRows={toggleCleared}
                      defaultSortField="id"
                      defaultSortAsc={false}
                      selectableRows
                      pagination
                    />
                  </DataTableExtensions>
                </span>
              </span>
            </div>
          </Card.Body>
        </Card>
      </Col>
       
      </Row>


      {/* <!-- End Row -->
					<!-- row closed  --> */}
    </div>
  )
}

export default CategoryManagement