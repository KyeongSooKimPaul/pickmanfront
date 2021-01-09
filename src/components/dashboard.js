import React, { useState, Fragment, useEffect } from "react";
import Breadcrumb from "./common/breadcrumb";
import {
  VIEW_ORDER_BYROLL,
  VIEW_USER,
  CHANGE_USER_ACTIVE,
  VIEW_PAGINATION,
} from "./graphql/graphql";
import { useQuery, useMutation } from "@apollo/client";
import Loader from "./common/loader";
import { Tabs, TabList, TabPanel, Tab } from "react-tabs";
import ToolkitProvider, { CSVExport } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory from "react-bootstrap-table2-filter";
import moment from "moment";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import { Button, Card, Modal } from "react-bootstrap";
import html2canvas from "html2canvas";
import jsPdf from "jspdf";

const Dashboard = (props) => {
  const [totalOrder, setTotalOrder] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [items, setItems] = useState([]);

  const { ExportCSVButton } = CSVExport;
  const [userData, setuserData] = useState([]);
  const [uploadData, setuploadData] = useState([]);
  const [uploadData1, setuploadData1] = useState([]);
  const [uploadData2, setuploadData2] = useState([]);
  const [id, setid] = useState("");
  const [active, setactive] = useState("");
  const [offset, setoffset] = useState(0);
  const [limit, setlimit] = useState(51);
  const [dd, setdd] = useState("0");
  var idstat = "";
  var activestat = "";
  // const [id, setid] = useState("");
  // const [active, setactive] = useState("");
  const [businessname, setbusinessname] = useState("");
  const [defaultModalShow, setdefaultModalShow] = useState(false);
  const [status, setstatus] = useState("");

  const [changeusers] = useMutation(CHANGE_USER_ACTIVE, {
    onError: (error) => console.log(error.message),
    onCompleted: (data) => {
      console.log("Successfully dtat", data);
    },
  });

  const onDefaultModalClose = () => {
    setdefaultModalShow(false);
  };

  useEffect(() => {
    if (window.localStorage.getItem("user_roll") !== "3") {
      window.alert("관리자만 사용 가능합니다.");
      window.location = "/";
    }
  }, []);

  useEffect(() => {
    console.log("dd없데이트", dd);

    newData({
      variables: {
        roll: "1",
        offset,
        limit,
      },
    });

    newData2({
      variables: {
        roll: "2",
        offset,
        limit,
      },
    });
  }, []);

  const userColumns = [
    {
      text: "상호명",
      dataField: "businessname",
      sort: true,
      headerStyle: {
        backgroundColor: "#f6f6ee",
      },
    },
    {
      text: "업종",
      dataField: "roll",
      sort: true,
      headerStyle: {
        backgroundColor: "#f6f6ee",
      },
      formatter: (rowContent, row) => {
        return row.roll == "1" ? (
          <div>
            <span
              style={{
                fontWeight: "bold",
                color: "#fd7e14",
              }}
            >
              사입자
            </span>
          </div>
        ) : (
          <div>
            <span
              style={{
                fontWeight: "bold",
                color: "#fd7e14",
              }}
            >
              소매업자
            </span>
          </div>
        );
      },
    },
    {
      text: "이메일",
      dataField: "email",
      sort: true,
      headerStyle: {
        backgroundColor: "#f6f6ee",
      },
    },
    {
      text: "가입날짜",
      dataField: "createdAt",
      sort: true,
      headerStyle: {
        backgroundColor: "#f6f6ee",
      },
      formatter: (rowContent, row) => {
        let timestamp = parseInt(row.createdAt);
        let date = new Date(timestamp);
        console.log("date", date);
        let date1 = moment(date).format("YY.MM.DD HH:mm:ss");
        return (
          <div>
            <span
              style={{
                fontWeight: "bold",
                color: "#007bff",
              }}
            >
              {date1}
            </span>
          </div>
        );
      },
    },
    {
      text: "활성화여부",
      dataField: "active",
      sort: true,
      headerStyle: {
        backgroundColor: "#f6f6ee",
      },
      events: {
        onClick: (e, column, columnIndex, row, rowIndex) => {
          idstat = row.id;
          setid(row.id);
          console.log("id값", row.id);
          setbusinessname(row.businessname);
          if (row.active == 1) {
            setstatus("활성화");
          } else {
            setstatus("비활성화");
          }
          setdefaultModalShow(true);
        },
      },
      formatter: (rowContent, row) => {
        return row.active == "1" ? (
          <BootstrapSwitchButton checked={false} />
        ) : (
          <BootstrapSwitchButton checked={true} />
        );
      },
    },
  ];

  const handleChangeActive = async (e) => {
    e.preventDefault();
    if (status == "활성화") {
      console.log("id", id);
      console.log("active", active);
      changeusers({
        variables: {
          id,
          active: "2",
        },
      });

      return window.location.reload();
    } else {
      console.log("id2", id);
      console.log("active2", active);
      changeusers({
        variables: {
          id,
          active: "1",
        },
      });

      console.log("결과2", id + active);
      return window.location.reload();
    }
  };

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
          console.log("e값", row);
          window.open(row.url, "_blank");
        },
      },
    },
    {
      text: "발주자 메일",
      dataField: "email",
      sort: true,
      headerStyle: {
        backgroundColor: "#f6f6ee",
      },
    },
    {
      text: "업체상호",
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

  const [newData] = useMutation(VIEW_PAGINATION, {
    onCompleted: (data) => {
      var jArray = [];
      console.log("data입니다", data);
      //console.log("data.length1", data.usersbyRollPagination.length);
      for (var i = 0; i < data.usersbyRollPagination.length; i++) {
        jArray = jArray.concat(data.usersbyRollPagination[i]);
        //console.log("jArray", jArray);
        if (data.usersbyRollPagination.length - 1 == i) {
          console.log("data1finish", jArray);
          return setuploadData(jArray);
        }
      }
    },
    onError: (error) => console.log(error),
    key: "graphql12",
  });

  const [newData2] = useMutation(VIEW_PAGINATION, {
    onCompleted: (data) => {
      var jArray = [];
      //console.log("data.length1", data.usersbyRollPagination.length);
      for (var i = 0; i < data.usersbyRollPagination.length; i++) {
        jArray = jArray.concat(data.usersbyRollPagination[i]);
        //console.log("jArray", jArray);
        if (data.usersbyRollPagination.length - 1 == i) {
          console.log("data1finish", jArray);
          return setuploadData2(jArray);
        }
      }
    },
    onError: (error) => console.log(error),
    key: "graphql12",
  });

  const { viewusers } = useQuery(VIEW_USER, {
    onCompleted: (data) => {
      return setuserData(data.users);
    },
    onError: (error) => console.log(error.message),
    key: "graphql12",
  });

  const { loading } = useQuery(VIEW_ORDER_BYROLL, {
    variables: { roll: "1" },
    onCompleted: (data) => {
      console.log("data.length2", data.usersbyRoll);
      // var jArray = [];
      // for (var i = 0; i < data.usersbyRoll.length; i++) {
      //   jArray = jArray.concat(data.usersbyRoll[i].rawexcels);
      //   console.log("jArray", jArray);
      //   if (data.usersbyRoll.length - 1 == i) {
      //     console.log("data1finish", jArray);
      //     return setuploadData(jArray);
      //   }
      // }
    },
    onError: (error) => console.log(error.message),
    key: "graphql12",
  });

  const { loading1 } = useQuery(VIEW_ORDER_BYROLL, {
    variables: { roll: "2" },
    onCompleted: (data) => {
      var jArray = [];
      for (var i = 0; i < data.usersbyRoll.length; i++) {
        jArray = jArray.concat(data.usersbyRoll[i].rawexcels);
        console.log("jArray", jArray);
        if (data.usersbyRoll.length - 1 == i) {
          console.log("data1finish", jArray);
          return setuploadData1(jArray);
        }
      }
    },
    onError: (error) => console.log(error.message),
    key: "graphql12",
  });

  return (
    <Fragment id="frag">
      <Loader visible={loading1} />
      {uploadData && uploadData1 && (
        <div id="photozone">
          <Breadcrumb title="대시보드" parent="픽맨" />
          <Modal
            show={defaultModalShow}
            size={null}
            onHide={onDefaultModalClose}
          >
            <Modal.Header closeButton>
              <Modal.Title as="h5">활성화여부 변경</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
              <span className="text-info"> {businessname} </span>의 상태를
              <span className="text-info"> {status} </span>로 변경하시겠습니까?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={handleChangeActive}>
                변경
              </Button>
              <Button variant="default" onClick={onDefaultModalClose}>
                취소
              </Button>
            </Modal.Footer>
          </Modal>
          <Tabs>
            <TabList className="nav nav-tabs tab-coupon">
              <Tab className="nav-link">권한승인</Tab>
              <Tab className="nav-link">사입자</Tab>
              <Tab className="nav-link">소매업체</Tab>
            </TabList>
            <TabPanel>
              <ToolkitProvider
                keyField="id"
                data={userData}
                columns={userColumns}
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

                          // sizePerPage: 10,
                          // hideSizePerPage: true,
                        })}
                        filter={filterFactory()}
                      />
                    </div>
                  );
                }}
              </ToolkitProvider>
            </TabPanel>
            <TabPanel>
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
                            console.log("Newest page:" + page);
                            if (page > 5) {
                              newData({
                                variables: {
                                  roll: "1",
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
            </TabPanel>
            <TabPanel>
              <ToolkitProvider
                keyField="id"
                data={uploadData2}
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
                            console.log("Newest page:" + page);
                            if (page > 5) {
                              newData2({
                                variables: {
                                  roll: "2",
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
            </TabPanel>
          </Tabs>
        </div>
      )}
    </Fragment>
  );
};

export default Dashboard;
