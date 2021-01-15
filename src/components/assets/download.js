import React, { useState, Fragment, useEffect } from "react";
import Breadcrumb from "../common/breadcrumb";
import filterFactory from "react-bootstrap-table2-filter";
import moment from "moment";
import ToolkitProvider, { CSVExport } from "react-bootstrap-table2-toolkit";
import {
  SplitButton,
  Dropdown,
  Form,
  InputGroup,
  Button,
  TextArea,
} from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

import { useQuery } from "@apollo/client";
import Loader from "../common/loader";
import { Row } from "react-bootstrap";
import * as XLSX from "xlsx";
import exampleFormat from "../../assets/images/dashboard/exampleForm.PNG";

const exampleData = require("../../assets/data/JSON/example.json");

const { ExportCSVButton } = CSVExport;

const Download = (props) => {
  const [orders, setOrders] = useState([]);
  const [items, setItems] = useState([]);
  const [contents, setcontents] = useState();
  const menual =
    "1.하단의 '예시폼 양식'을 확인 후 '예시폼 다운로드'버튼을 클릭하여 다운로드 해 주세요 \n\n" +
    "2. 발주자명, 사입팀명, 업체상호 ,상품코드,컬러, 사이즈, 단가, 수량, 합계, 가게주소, 전화번호 등의 내용을 입력해주세요. \n\n" +
    "3. 입력된 폼을 ‘메뉴’의 '업로드 및 발주'페이지를 통하여 업로드 해 주세요.";

  useEffect(() => {
    if (window.localStorage.getItem("logedin") !== "logedin") {
      window.alert("로그인 후 이용 가능합니다.");
      window.location = "/";
    }
    if (window.localStorage.getItem("user_active") !== "2") {
      window.alert("관리자의 사용 승인을 기다리고 있습니다.");
      window.location = "/";
    }

    setcontents("1");
  }, []);

  useEffect(() => {}, [contents]);

  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: "buffer" });

        const wsname = wb.SheetNames[0];

        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws);

        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((d) => {
      setItems(d);

      if (d.length == 0) {
        window.alert(
          "파일 확장자를 .xlsx형식으로 변환 후 다시 업로드 해 주세요"
        );
      } else {
      }
    });
  };

  const columns = [
    {
      text: "발주자명",
      dataField: "__EMPTY_13",
      headerStyle: {
        backgroundColor: "#f6f6ee",
        fontSize: "14px",
      },
    },
    {
      text: "사입팀명",
      dataField: "__EMPTY_14",
      headerStyle: {
        backgroundColor: "#f6f6ee",
        fontSize: "14px",
      },
    },
    {
      text: "업체상호 ",
      dataField: "__EMPTY",
      headerStyle: {
        backgroundColor: "#f6f6ee",
        fontSize: "14px",
      },
    },
    {
      text: "상품코드",
      dataField: "__EMPTY_3",
      headerStyle: {
        backgroundColor: "#f6f6ee",
        fontSize: "14px",
      },
    },

    {
      text: "컬러",
      dataField: "__EMPTY_4",
      headerStyle: {
        backgroundColor: "#f6f6ee",
        fontSize: "14px",
      },
    },

    {
      text: "사이즈",
      dataField: "__EMPTY_5",
      headerStyle: {
        backgroundColor: "#f6f6ee",
        fontSize: "14px",
      },
    },

    {
      text: "단가",
      dataField: "__EMPTY_6",
      headerStyle: {
        backgroundColor: "#f6f6ee",
        fontSize: "14px",
      },
    },

    {
      text: "수량",
      dataField: "__EMPTY_7",
      headerStyle: {
        backgroundColor: "#f6f6ee",
        fontSize: "14px",
      },
    },

    {
      text: "합계",
      dataField: "__EMPTY_8",
      headerStyle: {
        backgroundColor: "#f6f6ee",
        fontSize: "14px",
      },
    },

    {
      text: "가게주소",
      dataField: "__EMPTY_1",
      headerStyle: {
        backgroundColor: "#f6f6ee",
        fontSize: "14px",
      },
    },

    {
      text: "전화번호",
      dataField: "__EMPTY_2",
      headerStyle: {
        backgroundColor: "#f6f6ee",
        fontSize: "14px",
      },
    },

    {
      text: "비고1",
      dataField: "__EMPTY_9",
      headerStyle: {
        backgroundColor: "#f6f6ee",
        fontSize: "14px",
      },
    },

    {
      text: "비고2",
      dataField: "__EMPTY_9",
      headerStyle: {
        backgroundColor: "#f6f6ee",
        fontSize: "14px",
      },
    },

    {
      text: "출고날짜",
      dataField: "__EMPTY_10",
      headerStyle: {
        backgroundColor: "#f6f6ee",
        fontSize: "14px",
      },
    },
    {
      text: "지연사유",
      dataField: "__EMPTY_11",
      headerStyle: {
        backgroundColor: "#f6f6ee",
        fontSize: "14px",
      },
    },
    ,
    {
      text: "예금주명",
      dataField: "__EMPTY_15",
      headerStyle: {
        backgroundColor: "#f6f6ee",
        fontSize: "14px",
      },
    },
    {
      text: "결제방식",
      dataField: "__EMPTY_16",
      headerStyle: {
        backgroundColor: "#f6f6ee",
        fontSize: "14px",
      },
    },
    {
      text: "채팅링크",
      dataField: "__EMPTY_17",
      headerStyle: {
        backgroundColor: "#f6f6ee",
        fontSize: "14px",
      },
    },
  ];

  return (
    <Fragment>
      <Breadcrumb title="픽맨 예시폼" parent="픽맨" />
      <div className="align-self-center text-center">
        <div className="row">
          <div className="col-xl-12 col-sm-12">
            <Form.Group
              style={{
                marginTop: "50px",
              }}
            >
              <InputGroup>
                <InputGroup.Prepend>
                  <Button
                    variant="info"
                    style={{
                      borderTopLeftRadius: "20px",
                      borderBottomLeftRadius: "20px",
                      paddingRight: "50px",
                      paddingLeft: "50px",
                      fontWeight: "bold",
                    }}
                  >
                    사용방법
                  </Button>
                </InputGroup.Prepend>
                <textarea
                  readOnly
                  required=""
                  name="login[password]"
                  type="text"
                  className="form-control"
                  style={{
                    fontWeight: "bold",
                    height: "160px",
                  }}
                  value={menual}
                />
              </InputGroup>
            </Form.Group>
            <h4 className="f-w-600 f-20 mt-4 mb-4">예시폼 양식</h4>
            {/* <img src={exampleFormat} className="img-fluid" alt="" /> */}
          </div>
        </div>
        {contents && (
          <ToolkitProvider
            keyField="id"
            data={exampleData}
            columns={columns}
            bootstrap4
            search
            exportCSV
            exportCSV={{
              fileName: "예시폼양식(픽맨).csv",
            }}
          >
            {(tt) => {
              return (
                <div>
                  <BootstrapTable
                    {...tt.baseProps}
                    wrapperClasses="table-responsive"
                  />

                  <ExportCSVButton
                    {...tt.csvProps}
                    className="mr-2 mb-3"
                    style={{
                      backgroundColor: "green",
                      color: "white",
                      marginTop: "30px",
                    }}
                  >
                    예시폼 다운로드
                  </ExportCSVButton>
                </div>
              );
            }}
          </ToolkitProvider>
        )}
      </div>
    </Fragment>
  );
};

export default Download;
