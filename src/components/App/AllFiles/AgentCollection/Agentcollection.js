
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

  const [data_month,setData_month]=useState([])
  const currentYear = new Date().getFullYear();
  const [year,setYear]=useState('')
  const [month,setMonth]=useState('')
  const [date,setDate]=useState('')

  const navigate = useNavigate('')



  

 

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

   // Function to generate an array of years from the current year to a future year
   const generateYearOptions = (startYear, endYear) => {
    const years = [];
    for (let year = startYear; year <= endYear; year++) {
      years.push(year.toString());
    }
    return years;
  };

  const yearOptions = generateYearOptions(currentYear, currentYear + 100);

  const handelYear =(e)=> {
    const selectyear = e.target.value
    console.log("selectyear",selectyear)
    // getdata_by_year(selectyear)
    setYear(selectyear)
  }

  const handelmonth =(e)=> {
    const selctmonth = e.target.value
    console.log("selectmonth",selctmonth)
    setMonth(selctmonth)
    getdata_by_year(selctmonth,year);
  }

  useEffect(() => {
    if(!year && !month) {
      getAllUsersData();
    } 
  }, []);

  const getAllUsersData = () => {
    setLoading(true)
    var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "date": ""
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

    console.log('raw',raw)

    fetch(API_URL + `admin_agent_details`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("all_data",result);
        setData(result.response);
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        console.log("error", error)});
  };


  const getdata_by_year =(selectedMonth, selectyear)=> {

    const finalMonth = selectedMonth || month;
      console.log("month",selectedMonth)
      const final_data = `${selectyear}-${finalMonth}`
      setLoading(true)
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      
      var raw = JSON.stringify({
        "date": final_data
      });
      
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
  
      console.log('raw',raw)
  
      fetch(API_URL + `admin_agent_details`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log("data_by_month",result);
          setData_month(result.response);
          setLoading(false)
          setDate(result.date)
        })
        .catch((error) => {
          setLoading(false)
          console.log("error", error)});
        
  
  }




  const showToastMessage = (message) => {
    return new Promise((resolve) => {
      toast.success(message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
        onClose: () => {
          resolve(); // Resolve the promise when the toast is closed
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
      name: "Agent Name",
      selector: (row) => row.agentName,
      sortable: true,
      wrap: true,
      minWidth: "200px",
    
    },

    {
      name: "Agent Number",
      selector: (row) => row.agentNumber,
      sortable: true,
      wrap: true,
    
    },

    {
      name: "Amount Collected",
      selector: (row) => row.amount_Collected,
      sortable: true,
      wrap: true,
    
    },

    {
      name: "View",
      cell: (row) => (
        <button
        type="submit" 
        className="btn btn-sm btn-light"
        onClick={() => 
          navigate("/app/CustomerCollectedAmount", {
            state: {
              _id : row._id,
              date : date
            }
          })
      }
       icon="true"
                
       >
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M19 3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zm-7.933 13.481l-3.774-3.774l1.414-1.414l2.226 2.226l4.299-5.159l1.537 1.28l-5.702 6.841z"/></svg>
    </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },


  ];

  

  const tableData = {
    columns,
    data : !year && !month ? data : data_month,
  };

  return (
    <div>
      {/* <!-- breadcrumb --> */}
      <div className="breadcrumb-header justify-content-between">
      </div>
      {/* <!-- /breadcrumb -->

					<!--Row-->
						<!-- Row --> */}
      <Row className="row-sm">
      <h5>Agent Collection Managemnt</h5>

      {loading ? (
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh', marginLeft:400 }}>
          <span
            className="loader"
          ></span>
          <style>
            {`
              .loader {
               marginTop : 300px;
                width: 32px;
                height: 32px;
                position: relative;
                border-radius: 50%;
                color: #38cab3;
                animation: fill 1s ease-in infinite alternate;
              }
              
              .loader::before , .loader::after {
                content: '';
                position: absolute;
                height: 100%;
                width: 100%;
                border-radius: 50%;
                left: 48px;
                top: 0;
                animation: fill 0.9s ease-in infinite alternate;
              }
              
              .loader::after {
                left: auto;
                right: 48px;
                animation-duration: 1.1s;
              }
              
              @keyframes fill {
                0% {  box-shadow: 0 0 0 2px inset }
                100%{ box-shadow: 0 0 0 10px inset }
              }
            `}
          </style>
        </div>
      ) : (
        <Col lg={12}>
        <Card className="custom-card">

     <div style={{display:'flex',flexDirection:'row',gap:5, justifyContent:'flex-end',paddingRight:10,}}>
      <FormGroup style={{marginTop:20,border:'1px solid #38cab3', borderRadius:5,}} className="form-group">
        <select
          className="form-control border"
          value={year}
          onChange={handelYear}
        >
           <option value="">Select a Year</option>
        {yearOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
        </select>
      </FormGroup>

      <FormGroup style={{marginTop:20,border:'1px solid #38cab3', borderRadius:5}} className="form-group">
        <select
          className="form-control border"
          value={month}
          onChange={handelmonth}
        >
          <option value="">Select a Month</option>
           <option value='01'>Jan</option>
           <option value='02'>Feb</option>
           <option value='03'>Mar</option>
           <option value='04'>Apr</option>
           <option value='05'>May</option>
           <option value='06'>Jun</option>
           <option value='07'>Jul</option>
           <option value='08'>Aug</option>
           <option value='09'>Sep</option>
           <option value='10'>Oct</option>
           <option value='11'>Nov</option>
           <option value='12'>Dec</option>
        </select>
      </FormGroup>

      </div>
      
    
     
          <Card.Body>
       
            <div className="table-responsive ">
              <span className="datatable">
                <span className="uselistdata">
                  <DataTableExtensions {...tableData}>
                    <DataTable
                      columns={columns}
                      data={tableData.data}
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
      )}
       
      </Row>


      {/* <!-- End Row -->
					<!-- row closed  --> */}
    </div>
  )
}

export default CategoryManagement