
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
import { Link, useLocation, useNavigate } from "react-router-dom";
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


const location = useLocation();
const prev_data = location?.state
const prev_id = prev_data?._id;
const prev_date = prev_data?.date;


 

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

 


  useEffect(() => {
      getAllUsersData();
  }, []);

  const getAllUsersData = () => {
    setLoading(true)
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    var raw = JSON.stringify({
      "date": prev_date,
      "agent_id": prev_id
    });
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    console.log('raw',raw)

    fetch(API_URL + `admin_agent_ammount_details`, requestOptions)
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






  function Warningalert(errorMessage) {
    Swal.fire({
      title: errorMessage,
      icon: "warning",

    });
  }

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
      selector: (row) => row.customerData?.name,
      sortable: true,
      wrap: true,
      minWidth: "200px",
    
    },

    {
      name: "Cutomer Number",
      selector: (row) => row.customerData?.mobile,
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
        name: "Amount Collected Date",
        selector: (row) => row.collected_Date,
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
      <h5>Collection Amount Details</h5>

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
    
     
          <Card.Body>
       
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
      )}
       
      </Row>


      {/* <!-- End Row -->
					<!-- row closed  --> */}
    </div>
  )
}

export default CategoryManagement