
import React, { useEffect, useState } from "react";
import { Button,Modal } from "react-bootstrap";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
//import ExportCSV from "./ExportCSV"
const API_URL = "http://13.232.91.123:9000/"; // Replace with your API URL
const sender_img ="http://13.232.91.123/QuickSenda/QuickSenda/app/src/sender/"
function convertArrayOfObjectsToCSV(array) {
  let result;

  const columnDelimiter = ",";
  const lineDelimiter = "\n";
  const keys = Object.keys(array[0]);

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

export const ExportCSV = () => {
  const [data, setData] = useState([]); // State to store API data
  const [showModal, setShowModal] = useState(false);
  const [selectedImage,setSelectedImage]=useState(null);
const [result,setResult]=useState()
  useEffect(() => {
    getAllKyc();
  }, []);

  const getAllKyc = () => {

    var requestOptions = {
      method: 'POST',
      redirect: 'follow'
    };
    fetch(API_URL + "getAllSenderkyc",requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.users) {
          setData(result.users);
        }
      })
      .catch((error) => console.log("error", error));
  };

  const handelsubmit = (row) => {
    const Authorization = row.Authorization;
const userID= row.userID;
// const token = list.token

    console.log("Authorization",Authorization);
    console.log("userID",userID);
    // console.log("token",token)

    var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "Authorization":Authorization ,
  // "token": token,
  "userID": userID
});

// var raw = JSON.stringify({
//   "Authorization":Authorization
// });

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch(API_URL+"verifySenderKyc", requestOptions)
  .then(response => response.json())
  .then(result => { setResult(prevResult => {
      const updatedResult = [...prevResult];
      if (result.status) {
        updatedResult.status = result.updatedUser.Adminstatus;
       
      }

      //console.log("status", updatedResult[].status);
      getAllKyc()
      return updatedResult;
      
    });
  //  setShowAlert(true)
    //  alert(result.message)
    console.log(result);
  })
  .catch(error => console.log('error', error));
    // Perform action based on the clicked row data
    console.log("Button clicked for row:", row);
  };
  

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  }
  const handleCloseModal = () => {
    setShowModal(false);
  }

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Mobile Number",
      selector: (row) => row.mobilenumber,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Kyc Type",
      selector: (row) => row.kyctype,
      sortable: true,
    },
    {
      name: "Fornt Image",
      selector: (row) => row.front_img,
      sortable: true,
      cell: (row) =><button onClick={() => handleImageClick(row.front_img)}>
       <img style={{width:20}} src={sender_img+row.front_img} alt="Image" />
       </button>
    },
    {
      name: "Back Image",
      selector: (row) => row.back_img,
      sortable: true,
      cell: (row) =><button onClick={() => handleImageClick(row.back_img)}>
       <img style={{width:20}} src={sender_img+row.back_img} alt="Image" />
       </button>
    },
    {
      name: "Actions",
      cell: (row) => (
        <Button
                  variant=""
                  className="btn btn-primary"
                  onClick={() => handelsubmit(row)}
                  disabled={row.Adminstatus === "true"}
                  icon="true"
                >
                   {row.Adminstatus === "true" ? 'Verified' : 'Verify'}
                </Button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    // {
    //   name: "EMAIL",
    //   selector: (row) => row.email,
    //   sortable: true,
    // },
    // {
    //   name: "IMAGE",
    //   selector: (row) => row.front_img,
    //   sortable: true,
    //   cell: (row) => <img src={row.front_img} alt="Image" />,
    // },
  ];

  const tableData = {
    columns,
    data,
  };

  const actionsMemo = React.useMemo(
    () => <Export onExport={() => downloadCSV(data)} />,
    [data]
  );

  return (
    <>
    <DataTableExtensions {...tableData}>
      <DataTable
        columns={columns}
        data={data}
        actions={actionsMemo}
        selectableRows
        pagination
      />
    </DataTableExtensions>

    <Modal show={showModal} onHide={handleCloseModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Full Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedImage && (
            <img
              src={sender_img+selectedImage} // Update the src attribute with selectedImage
              alt="Full Image"
              style={{ width: '100%' }}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
};


// export default ExportCSV;



// import React from "react";
// import { Button } from "react-bootstrap";
// import DataTable from "react-data-table-component";
// import DataTableExtensions from "react-data-table-component-extensions";


// function convertArrayOfObjectsToCSV(array) {
//     let result;
  
//     const columnDelimiter = ",";
//     const lineDelimiter = "\n";
//     const keys = Object.keys(data[0]);
  
//     result = "";
//     result += keys.join(columnDelimiter);
//     result += lineDelimiter;
  
//     array.forEach((item) => {
//       let ctr = 0;
//       keys.forEach((key) => {
//         if (ctr > 0) result += columnDelimiter;
  
//         result += item[key];
  
//         ctr++;
//       });
//       result += lineDelimiter;
//     });
  
//     return result;
//   }
  
//   // Blatant "inspiration" from https://codepen.io/Jacqueline34/pen/pyVoWr
//   function downloadCSV(array) {
//     const link = document.createElement("a");
//     let csv = convertArrayOfObjectsToCSV(array);
//     if (csv == null) return;
  
//     const filename = "export.csv";
  
//     if (!csv.match(/^data:text\/csv/i)) {
//       csv = `data:text/csv;charset=utf-8,${csv}`;
//     }
  
//     link.setAttribute("href", encodeURI(csv));
//     link.setAttribute("download", filename);
//     link.click();
//   }
  
//   const Export = ({ onExport }) => (
//     <Button onClick={(e) => onExport(e.target.value)}>Export</Button>
//   );
//   const data = [
//     {
//       id: "1",
//       SNO: 1,
//       NAME: "Yonna",
//       LASTNAME: "Qond",
//       POSITION: "Financial Controller",
//       DATE: "2012/02/21",
//       SALARY: "$143,654",
//       EMAIL: "i.bond@datatables.net",
//     },
//     {
//       id: "2",
//       SNO: 2,
//       NAME: "Zonna",
//       LASTNAME: "Jond",
//       POSITION: "Accountant",
//       DATE: "2012/02/21",
//       SALARY: "$343,654",
//       EMAIL: "a.bond@datatables.net",
//     },
//     {
//       id: "3",
//       SNO: 3,
//       NAME: "Nonna",
//       LASTNAME: "Tond",
//       POSITION: "Chief Executive Officer",
//       DATE: "2012/02/21",
//       SALARY: "$743,654",
//       EMAIL: "s.bond@datatables.net",
//     },
//     {
//       id: "4",
//       SNO: 4,
//       NAME: "Bonna",
//       LASTNAME: "Oond",
//       POSITION: "Chief Operating Officer",
//       DATE: "2012/02/21",
//       SALARY: "$643,654",
//       EMAIL: "w.bond@datatables.net",
//     },
//     {
//       id: "5",
//       SNO: 5,
//       NAME: "Honna",
//       LASTNAME: "Pond",
//       POSITION: "Data Coordinator",
//       DATE: "2012/02/21",
//       SALARY: "$243,654",
//       EMAIL: "e.bond@datatables.net",
//     },
//     {
//       id: "6",
//       SNO: 6,
//       NAME: "Fonna",
//       LASTNAME: "Nond",
//       POSITION: "Developer",
//       DATE: "2012/02/21",
//       SALARY: "$543,654",
//       EMAIL: "r.bond@datatables.net",
//     },
//     {
//       id: "7",
//       SNO: 7,
//       NAME: "Aonna",
//       LASTNAME: "Xond",
//       POSITION: "Development lead",
//       DATE: "2012/02/21",
//       SALARY: "$843,654",
//       EMAIL: "g.bond@datatables.net",
//     },
//     {
//       id: "8",
//       SNO: 8,
//       NAME: "Qonna",
//       LASTNAME: "Vond",
//       POSITION: "Director",
//       DATE: "2012/02/21",
//       SALARY: "$743,654",
//       EMAIL: "x.bond@datatables.net",
//     },
//     {
//       id: "9",
//       SNO: 9,
//       NAME: "Jond",
//       LASTNAME: "Zonna",
//       POSITION: "Marketing Officer",
//       DATE: "2012/02/21",
//       SALARY: "$543,654",
//       EMAIL: "k.bond@datatables.net",
//     },
//     {
//       id: "10",
//       SNO: 10,
//       NAME: "Yonna",
//       LASTNAME: "Qond",
//       POSITION: "Financial Controller",
//       DATE: "2012/02/21",
//       SALARY: "$143,654",
//       EMAIL: "s.bond@datatables.net",
//     },
//     {
//       id: "11",
//       SNO: 11,
//       NAME: "Yonna",
//       LASTNAME: "Qond",
//       POSITION: "Financial Controller",
//       DATE: "2012/02/21",
//       SALARY: "$143,654",
//       EMAIL: "b.bond@datatables.net",
//     },
//     {
//       id: "12",
//       SNO: 12,
//       NAME: "Yonna",
//       LASTNAME: "Qond",
//       POSITION: "Financial Controller",
//       DATE: "2012/02/21",
//       SALARY: "$143,654",
//       EMAIL: "o.bond@datatables.net",
//     },
//     {
//       id: "13",
//       SNO: 13,
//       NAME: "Qonna",
//       LASTNAME: "Pond",
//       POSITION: "Data Coordinator",
//       DATE: "2012/02/21",
//       SALARY: "$243,654",
//       EMAIL: "q.bond@datatables.net",
//       image:"https//gyhgh."
//     },
//     {
//       id: "14",
//       SNO: 14,
//       NAME: "Yonna",
//       LASTNAME: "Qond",
//       POSITION: "Financial Controller",
//       DATE: "2012/02/21",
//       SALARY: "$143,654",
//       EMAIL: "m.bond@datatables.net",
//     },
//   ];
//   const columns = [
//     {
//       name: "S.NO",
//       selector: (row) => [row.SNO],
//       sortable: true,
//     },
//     {
//       name: "NAME",
//       selector: (row) => [row.NAME],
//       sortable: true,
//     },
//     {
//       name: "LAST NAME",
//       selector: (row) => [row.LASTNAME],
//       sortable: true,
//     },
//     {
//       name: "POSITION",
//       selector: (row) => [row.POSITION],
//       sortable: true,
//     },
//     {
//       name: "DATE",
//       selector: (row) => [row.DATE],
//       sortable: true,
//     },
//     {
//       name: " SALARY",
//       selector: (row) => [row.SALARY],
//       sortable: true,
//     },
//     {
//       name: "EMAIL",
//       selector: (row) => [row.EMAIL],
//       sortable: true,
//     },
//     {
//       name: "hhhImage",
//       selector: (row) =>[row.image],
//       sortable:true
//     }
//   ];
//   const tableDatas = {
//     columns,
//     data,
//   };
//   export const ExportCSV = () => {
//     const actionsMemo = React.useMemo(() => <Export onExport={() => downloadCSV(data)} />, []);
//     const [selectedRows, setSelectedRows] = React.useState([]);
//     const [toggleCleared, setToggleCleared] = React.useState(false);
//     let selectdata = [];
//     const handleRowSelected = React.useCallback((state) => {
//       setSelectedRows(state.selectedRows);
//     }, []);
//     const contextActions = React.useMemo(() => {
//       const Selectdata = () => {
//         if (window.confirm(`download:\r ${selectedRows.map((r) => r.SNO)}?`)) {
//           setToggleCleared(!toggleCleared);
//           data.map((e) => {
//             selectedRows.map((sr) => {
//               if (e.id === sr.id) {
//                 selectdata.push(e);
//               }
//               return selectedRows;
//             });
//             return data;
//           });
//           downloadCSV(selectdata);
//         }
//       };
  
//       return <Export onExport={() => Selectdata()} icon="true" />;
//     }, [data, selectdata, selectedRows]);
//     return (
//        <span className="datatable">
//       <DataTableExtensions {...tableDatas}>
//         <DataTable
//           columns={columns}
//           data={data}
//           actions={actionsMemo}
//           contextActions={contextActions}
//           onSelectedRowsChange={handleRowSelected}
//           clearSelectedRows={toggleCleared}
//           selectableRows
//           pagination
//         />
//       </DataTableExtensions>
//       </span>
//     );
//   };
  