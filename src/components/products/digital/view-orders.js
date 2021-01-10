import React, { useState, Fragment, useEffect, useRef } from "react";
import Breadcrumb from "../../common/breadcrumb";
import Loader from "../../common/loader";
import { useMutation, useQuery } from "@apollo/client";
import { VIEW_ORDER, VIEW_PAGINATION } from "../../graphql/graphql";
import { Form, Button, Table } from "react-bootstrap";
import ToolkitProvider, { CSVExport } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory from "react-bootstrap-table2-filter";

const exampleData = require("../../../assets/data/JSON/example.json");

const ViewOrders = (props) => {
  useEffect(() => {
    if (window.localStorage.getItem("logedin") !== "logedin") {
      window.alert("로그인 후 이용 가능합니다.");
      window.location = "/";
    }
    if (window.localStorage.getItem("user_active") !== "2") {
      window.alert("관리자의 사용 승인을 기다리고 있습니다.");
      window.location = "/";
    }
  }, []);

  const { ExportCSVButton } = CSVExport;
  const [uploadData, setuploadData] = useState([]);
  const [id, setId] = useState(window.localStorage.getItem("user_id"));
  const [userId, setuserId] = useState(window.localStorage.getItem("user_id"));
  const [offset, setoffset] = useState(0);
  const [limit, setlimit] = useState(51);
  var roll = "";

  useEffect(() => {
    newData({
      variables: {
        userId: window.localStorage.getItem("user_id"),
        offset,
        limit,
      },
    });
  }, []);

  const [newData] = useMutation(VIEW_ORDER, {
    onCompleted: (data) => {
      var jArray = [];

      for (var i = 0; i < data.usersbyId.length; i++) {
        jArray = jArray.concat(data.usersbyId[i]);

        if (data.usersbyId.length - 1 == i) {
          return setuploadData(jArray);
        }
      }
    },
    onError: (error) => console.log(error),
    key: "graphql12",
  });

  const columns = [
    {
      text: "발주 날짜 / 시간",
      dataField: "date",
      sort: true,
      headerStyle: {
        backgroundColor: "#f6f6ee",
      },
    },
    {
      text: "발주서",
      dataField: "url",
      sort: true,
      headerStyle: {
        backgroundColor: "#f6f6ee",
      },
      style: {
        cursor: "pointer",
        color: "#3366ff",
      },
      formatter: (rowContent, row) => {
        return (
          <div>
            <span
              style={{
                fontWeight: "bold",
                color: "#007bff",
              }}
            >
              발주서보기
            </span>
          </div>
        );
      },
      events: {
        onClick: (e, column, columnIndex, row, rowIndex) => {
          window.open(row.url, "_blank");
        },
      },
    },
    {
      text: "업체상호 ",
      dataField: "name",
      sort: true,
      headerStyle: {
        backgroundColor: "#f6f6ee",
      },
    },
    {
      text: "가게주소",
      dataField: "address",
      sort: true,
      headerStyle: {
        backgroundColor: "#f6f6ee",
      },
    },
    {
      text: "전화번호",
      dataField: "phone",
      sort: true,
      headerStyle: {
        backgroundColor: "#f6f6ee",
      },
    },
    {
      text: "상품코드",
      dataField: "code",
      sort: true,
      headerStyle: {
        backgroundColor: "#f6f6ee",
      },
    },
    {
      text: "컬러",
      dataField: "color",
      sort: true,
      headerStyle: {
        backgroundColor: "#f6f6ee",
      },
    },

    {
      text: "사이즈",
      dataField: "size",
      sort: true,
      headerStyle: {
        backgroundColor: "#f6f6ee",
      },
    },

    {
      text: "단가",
      dataField: "price",
      sort: true,
      headerStyle: {
        backgroundColor: "#f6f6ee",
      },
    },

    {
      text: "수량",
      dataField: "amount",
      sort: true,
      headerStyle: {
        backgroundColor: "#f6f6ee",
      },
    },

    {
      text: "합계",
      dataField: "total",
      sort: true,
      headerStyle: {
        backgroundColor: "#f6f6ee",
      },
    },
  ];

  return (
    <Fragment>
      {/* <Loader visible={loading} /> */}
      {uploadData && (
        <div>
          <Breadcrumb title="발주내역 보기" parent="픽맨" />

          <div className="align-self-center text-center">
            <ToolkitProvider
              keyField="id"
              data={uploadData}
              columns={columns}
              bootstrap4
              search
              exportCSV
            >
              {(tt) => {
                return (
                  <div>
                    <BootstrapTable
                      {...tt.baseProps}
                      wrapperClasses="table-responsive"
                      pagination={paginationFactory({
                        classes: "bg-danger",
                        sizePerPage: 10,
                        hideSizePerPage: true,
                        onPageChange: (page, sizePerPage) => {
                          if (page > 5) {
                            newData({
                              variables: {
                                userId: window.localStorage.getItem("user_id"),
                                limit: page * 10 + 31,
                                offset: 0,
                              },
                            });
                          }
                        },
                      })}
                      filter={filterFactory()}
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
                      엑셀 다운로드
                    </ExportCSVButton>
                  </div>
                );
              }}
            </ToolkitProvider>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default ViewOrders;
