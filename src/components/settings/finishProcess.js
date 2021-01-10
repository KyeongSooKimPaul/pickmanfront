import React, { useState, Fragment, useEffect } from "react";
import Breadcrumb from "../common/breadcrumb";
import { useQuery, useMutation } from "@apollo/client";
import {
  CREATE_ORDER,
  CREATE_BANKDATA,
  FILTERED_BANKDATA,
  DELETE_BANKDATA,
  CHANGE_USER_BACKDATA,
} from "../graphql/graphql";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory from "react-bootstrap-table2-filter";
import ToolkitProvider, { CSVExport } from "react-bootstrap-table2-toolkit";
import moment from "moment";
import Loader from "../common/loader";
import * as XLSX from "xlsx";
import {
  SplitButton,
  Dropdown,
  Form,
  InputGroup,
  Button,
  TextArea,
  Modal,
} from "react-bootstrap";
const { ExportCSVButton } = CSVExport;

var nums = 0;
var nums1 = 0;
var sameNumberCheck = 0;

function FinishProcess(props) {
  const [uploadData, setuploadData] = useState([]);
  const menual =
    "1.하단의 '파일 선택'버튼을 클릭 후 백데이터 엑셀을 업로드 해 주세요(.xlsx형식으로 변환 후 업로드)\n\n" +
    "2. 주문내역을 업로드 해 주세요.\n\n" +
    "3. 업로드 후 대량이체파일 생성결과 탭 밑의 정보를 확인해주세요.";
  const [items, setItems] = useState([
    {
      합계: "",
    },
  ]);
  const [filtered, setfiltered] = useState([]);
  const [filtered2, setfiltered2] = useState([]);
  const [filtercount, setfiltercount] = useState(-1);
  const [filtered3, setfiltered3] = useState([]);
  const [displayStatus, setdisplayStatus] = useState(false);
  const [displayStatus1, setdisplayStatus1] = useState(false);
  const [forStateCount, setforStateCount] = useState(-1);
  const [forStateCount2, setforStateCount2] = useState(-1);
  const [forStateCount3, setforStateCount3] = useState(-1);
  const [defaultModalShow, setdefaultModalShow] = useState(false);
  const [modalButtonShow, setmodalButtonShow] = useState(true);
  const [startfiltering, setstartfiltering] = useState([]);
  const [excelDataRaw, setexcelDataRaw] = useState([]);
  const [backdatanumber, setbackdatanumber] = useState([]);

  var aJsonArray = [];
  var aJson = new Object();
  var seller = "";
  var wholesaler = "";
  var counting = 0;

  const [changeusers] = useMutation(CHANGE_USER_BACKDATA, {
    onError: (error) => {
      if (error.message == "Error!") {
        window.location.reload();
      } else {
        setmodalButtonShow(false);
      }
    },
    onCompleted: (data) => {
      console.log("Successfully dtat", data);
    },
  });

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

  useEffect(() => {
    if (startfiltering !== [] && startfiltering.length !== undefined) {
      var jarrayfINAL = [];

      for (var i = 0; i < startfiltering.length; i++) {
        if (
          startfiltering[i].합계.toString().length > 0 &&
          Number(startfiltering[i].수량) > 0 &&
          Number(startfiltering[i].합계) > 0
        ) {
          jarrayfINAL = jarrayfINAL.concat(startfiltering[i]);
        }
        if (startfiltering.length - 1 == i) {
          setItems(jarrayfINAL);
        }
      }
    }
  }, [startfiltering]);

  useEffect(() => {
    if (nums > 0 || nums1 > 0) {
      if (nums - 1 === forStateCount) {
        //window.alert("백데이터 업로드가 완료되었습니다.");

        window.localStorage.setItem("user_backdata", "2");
        var backdata;
        var id = window.localStorage.getItem("user_id");
        changeusers({
          variables: {
            id,
            backdata: "2",
          },
        });
      } else if (nums1 - 1 === forStateCount) {
        //window.alert("백데이터 업로드가 완료되었습니다.");

        setmodalButtonShow(false);
      }
    }
  }, [forStateCount]);

  useEffect(() => {}, [forStateCount2]);

  useEffect(() => {
    if (window.localStorage.getItem("user_backdata") == "1") {
      setdisplayStatus(true);
      setdisplayStatus1(false);
    }
    if (window.localStorage.getItem("user_backdata") == "2") {
      setdisplayStatus(false);
      setdisplayStatus1(true);
    }
    if (items.length > 1) {
      setfiltercount(filtercount + 1);
    }
  }, [items]);

  useEffect(() => {
    if (filtercount > -1 && items.length > filtercount) {
      startMutation();
    }
  }, [filtercount]);

  useEffect(() => {
    if (filtered.length !== 0) {
      setfiltered2(filtered2.concat(filtered));
    }
  }, [filtered]);

  useEffect(() => {
    if (filtered.length !== 0) {
      aJson.a = items[filtercount];
      aJson.b = filtered2[filtercount];
      aJsonArray = aJson;
      setfiltered3(filtered3.concat(aJsonArray));
    }
  }, [filtered2]);

  useEffect(() => {
    if (filtered.length !== 0) {
      setfiltercount(filtercount + 1);
    }
  }, [filtered3]);

  const startMutation = () => {
    var userid = window.localStorage.getItem("user_id");
    if (
      items[filtercount].발주자명 == undefined ||
      items[filtercount].업체상호 == undefined
    ) {
      //window.alert("엑셀 양식을 다시 확인해주세요.");
      window.alert("엑셀 양식을 다시 확인해주세요.");
      window.location.reload();
      // window.location.reload();
    } else {
      filterdBankData({
        variables: {
          userid,
          seller: items[filtercount].발주자명.toString(),
          wholesaler: items[filtercount].업체상호.toString(),
        },
      });
    }
  };

  const closeAndReload = () => {
    window.location.reload();
  };

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

      fileReader.onerror = (error) => {};
    });

    promise.then((d) => {
      if (d.length == 0) {
        window.alert(
          "파일 확장자를 .xlsx형식으로 변환 후 다시 업로드 해 주세요"
        );
        window.location.reload();
      } else {
        for (var i = 0; i < d.length - 1; i++) {
          var arrayTest = d[i].업체상호;
          var arrayTest1 = d[i].발주자명;

          for (var j = i + 1; j < d.length; j++) {
            if (
              arrayTest == d[j].업체상호 &&
              arrayTest1 == d[j].발주자명 &&
              d[j].수량 !== 0 &&
              d[j].합계 !== 0
            ) {
              d[i].arrayTest = arrayTest;
              d[i].arrayTest1 = arrayTest1;

              if (d[i].수량 !== "") {
                d[i].수량 = Number(d[i].수량) + Number(d[j].수량);
                d[j].수량 = "";

                d[i].합계 = Number(d[i].합계) + Number(d[j].합계);
                d[j].합계 = "";
              }

              sameNumberCheck = sameNumberCheck + 1;

              if (d.length - 2 == i && d.length - 1 == j) {
                setstartfiltering(d);
              }
            } else {
              if (d.length - 2 == i && d.length - 1 == j) {
                setstartfiltering(d);
              }
            }
          }
        }

        //setItems(d);
      }
    });
  };

  const userColumns = [
    {
      text: "은행코드",
      dataField: "b.bankcode",
      sort: true,
      headerStyle: {
        backgroundColor: "#f6f6ee",
      },
      csvType: Text,
      csvFormatter: (cell, row, rowIndex) => {
        if (row.b.bankcode == undefined) {
          return console.log("undefined", row.b.bankcode);
        } else {
          if (row.b.bankcode.length == 3) {
            {
              return `${cell}`;
            }
          }
          if (row.b.bankcode.length == 2) {
            {
              // return `$ 0${cell}`;
              return `${cell}`;
            }
          }
          if (row.b.bankcode.length == 1) {
            {
              // return `$ 00${cell}`;
              return `${cell}`;
            }
          }
        }
      },
    },
    {
      text: "계좌번호",
      dataField: "b.bankaccount",
      sort: true,
      headerStyle: {
        backgroundColor: "#f6f6ee",
      },
    },
    {
      text: "금액",
      dataField: "a.합계",
      sort: true,
      headerStyle: {
        backgroundColor: "#f6f6ee",
      },
    },
    {
      text: "예금주",
      dataField: "b.bankowner",
      sort: true,
      headerStyle: {
        backgroundColor: "#f6f6ee",
      },
    },
    {
      text: "비고",
      dataField: "a.비고1",
      sort: true,
      headerStyle: {
        backgroundColor: "#f6f6ee",
      },
    },
    {
      text: "발주자명",
      dataField: "a.발주자명",
      sort: true,
      headerStyle: {
        backgroundColor: "#f6f6ee",
      },
    },
    {
      text: "업체상호 ",
      dataField: "a.업체상호",
      sort: true,
      headerStyle: {
        backgroundColor: "#f6f6ee",
      },
    },
  ];

  const DelteandreadBankExcel = (file) => {
    setdefaultModalShow(true);
    var userId = window.localStorage.getItem("user_id");
    deleteBackdata({
      variables: {
        userId: userId,
      },
    }).then(console.log("끝"));

    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: "buffer" });

        if (!null) {
          var userId = window.localStorage.getItem("user_id");
          var seller = "";
          var wholesaler = "";
          var bankcode = "";
          var bankaccount = "";
          var bankowner = "";

          for (var i = 0; i < wb.SheetNames.length; i++) {
            const wsname = wb.SheetNames[i];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws);
            for (var j = 0; j < data.length; j++) {
              if (
                data[j].거래처 == undefined ||
                data[j].업체상호 == undefined ||
                data[j].은행코드 == undefined ||
                data[j].계좌번호 == undefined ||
                data[j].예금주 == undefined
              ) {
                seller = "undefined";
                wholesaler = "undefined";
                bankcode = "undefined";
                bankaccount = "undefined";
                bankowner = "undefined";
              } else {
                nums1 = nums1 + 1;
                createBankdata({
                  variables: {
                    userId: userId,
                    seller: data[j].거래처.toString(),
                    wholesaler: data[j].업체상호.toString(),
                    bankcode: data[j].은행코드.toString(),
                    bankaccount: data[j].계좌번호.toString(),
                    bankowner: data[j].예금주.toString(),
                  },
                });
              }
            }
          }
        } else {
          window.alert("엑셀 데이터를 다시 확인해 주세요");
        }
      };

      fileReader.onerror = (error) => {};
    });

    promise.then((d) => {
      setItems(d);

      if (d.length == 0) {
        window.alert(
          "파일 확장자를 .xlsx형식으로 변환 후 다시 업로드 해 주세요"
        );
        window.location.reload();
      } else {
      }
    });
  };

  const readBankExcel = (file) => {
    setdefaultModalShow(true);
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: "buffer" });

        if (!null) {
          var userId = window.localStorage.getItem("user_id");
          var seller = "";
          var wholesaler = "";
          var bankcode = "";
          var bankaccount = "";
          var bankowner = "";

          for (var i = 0; i < wb.SheetNames.length; i++) {
            const wsname = wb.SheetNames[i];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws);

            // resolve(data);
            for (var j = 0; j < data.length; j++) {
              if (
                data[j].거래처 == undefined ||
                data[j].업체상호 == undefined ||
                data[j].은행코드 == undefined ||
                data[j].계좌번호 == undefined ||
                data[j].예금주 == undefined
              ) {
                seller = "undefined";
                wholesaler = "undefined";
                bankcode = "undefined";
                bankaccount = "undefined";
                bankowner = "undefined";
              } else {
                nums = nums + 1;
                console.log("nums", nums);
                backdatanumber(nums);
                setforStateCount2(forStateCount2 + 1);
                createBankdata({
                  variables: {
                    userId: userId,
                    seller: data[j].거래처.toString(),
                    wholesaler: data[j].업체상호.toString(),
                    bankcode: data[j].은행코드.toString(),
                    bankaccount: data[j].계좌번호.toString(),
                    bankowner: data[j].예금주.toString(),
                  },
                });
              }
            }
          }
        } else {
          window.alert("엑셀 데이터를 다시 확인해 주세요");
        }
      };

      fileReader.onerror = (error) => {};
    });

    promise.then((d) => {
      setItems(d);

      if (d.length == 0) {
        window.alert(
          "파일 확장자를 .xlsx형식으로 변환 후 다시 업로드 해 주세요"
        );
        window.location.reload();
      } else {
      }
    });
  };

  const columns = [
    {
      text: "업로드 일자",
      dataField: "createdAt",
      formatter: (rowContent, row) => {
        let timestamp = parseInt(row.createdAt);
        let date = new Date(timestamp);

        let date1 = moment(date).format("YY.MM.DD");
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
      text: "상품명 ",
      dataField: "name",
      formatter: (rowContent, row) => {
        return (
          <div>
            <span
              style={{
                fontWeight: "bold",
                color: "#343a40",
              }}
            >
              {row.name}
            </span>
          </div>
        );
      },
    },

    {
      text: "상세정보",
      dataField: "description",
      sort: true,
      style: {
        cursor: "pointer",
      },
      formatter: (rowContent, row) => {
        return (
          <div>
            <a
              style={{
                cursor: "pointer",
                backgroundColor: "#28a745",
                color: "white",
                borderRadius: "5px",
                paddingLeft: "15px",
                paddingRight: "15px",
                paddingTop: "5px",
                paddingBottom: "5px",
                fontSize: "14px",
                fontWeight: "bold",
              }}
              href={`/products/${row._id}`}
            >
              상세 보기
            </a>
          </div>
        );
      },
    },

    {
      text: "정보 수정",
      dataField: "__typename",
      sort: true,
      style: {
        cursor: "pointer",
      },
      events: {
        onClick: (e, column, columnIndex, row, rowIndex) => {
          props.history.push(`/products/${row._id}/update`);
        },
      },
      formatter: (rowContent, row) => {
        return (
          <div>
            <span
              style={{
                cursor: "pointer",
                backgroundColor: "#d9534f",
                color: "white",
                borderRadius: "5px",
                paddingLeft: "15px",
                paddingRight: "15px",
                paddingTop: "5px",
                paddingBottom: "5px",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              수정
            </span>
          </div>
        );
      },
    },
  ];

  const [createBankdata] = useMutation(CREATE_BANKDATA, {
    onError: (error) => console.log(error.message),
    onCompleted: (data) => {
      setforStateCount(forStateCount + 1);
      console.log("완료");
    },
  });

  const [deleteBackdata] = useMutation(DELETE_BANKDATA, {
    onError: (error) => {},
    onCompleted: (data) => {},
  });

  const [filterdBankData] = useMutation(FILTERED_BANKDATA, {
    onError: (error) => {
      window.alert("입력정보를 다시 확인해주세요");
      window.location.reload();
    },
    onCompleted: (data) => {
      setfiltered(data.filteredBank);
    },
  });

  return (
    <Fragment>
      {/* <Loader visible={loading} /> */}
      <div>
        <Breadcrumb title="사입완료 및 대량이체" parent="픽맨" />
        <Modal centered show={defaultModalShow} size={null}>
          <Modal.Header>
            <Modal.Title as="h5">백데이터 등록</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            {modalButtonShow ? (
              <span className="text-info">백데이터를 등록하고 있습니다.</span>
            ) : (
              <span className="text-info">백데이터 등록이 완료되었습니다.</span>
            )}
          </Modal.Body>
          <Modal.Footer>
            {modalButtonShow ? (
              <Button variant="danger" className="text-center">
                잠시만 기다려주세요.
              </Button>
            ) : (
              <Button
                variant="danger"
                onClick={closeAndReload}
                className="text-center"
              >
                확인
              </Button>
            )}
          </Modal.Footer>
        </Modal>
        <div className="align-self-center text-center">
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
                  height: "140px",
                }}
                value={menual}
              />
            </InputGroup>
          </Form.Group>

          {displayStatus && (
            <Form.Group
              style={{
                marginTop: "50px",
              }}
            >
              <InputGroup>
                <InputGroup.Prepend>
                  <Button
                    variant="danger"
                    style={{
                      borderTopLeftRadius: "20px",
                      borderBottomLeftRadius: "20px",
                      borderTopRightRadius: "20px",
                      borderBottomRightRadius: "20px",
                      paddingRight: "50px",
                      paddingLeft: "50px",
                      fontWeight: "bold",
                    }}
                  >
                    백데이터 업로드(우측의 "파일 선택" 버튼을 클릭하여
                    백데이터를 등록을 해주세요)
                  </Button>
                </InputGroup.Prepend>

                <input
                  type="file"
                  style={{
                    borderTopLeftRadius: "20px",
                    borderBottomLeftRadius: "20px",
                    borderTopRightRadius: "20px",
                    borderBottomRightRadius: "20px",
                    paddingRight: "50px",
                    paddingLeft: "50px",
                    fontWeight: "bold",
                  }}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    readBankExcel(file);
                  }}
                />
              </InputGroup>
            </Form.Group>
          )}

          {displayStatus1 && (
            <Form.Group
              style={{
                marginTop: "50px",
              }}
            >
              <InputGroup>
                <InputGroup.Prepend>
                  <Button
                    variant="danger"
                    style={{
                      borderTopLeftRadius: "20px",
                      borderBottomLeftRadius: "20px",
                      borderTopRightRadius: "20px",
                      borderBottomRightRadius: "20px",
                      paddingRight: "50px",
                      paddingLeft: "50px",
                      fontWeight: "bold",
                    }}
                  >
                    백데이터 업데이트(우측의 "파일 선택" 버튼을 클릭하여
                    백데이터를 업데이트 하실 수 있습니다)
                  </Button>
                </InputGroup.Prepend>

                <input
                  type="file"
                  style={{
                    borderTopLeftRadius: "20px",
                    borderBottomLeftRadius: "20px",
                    borderTopRightRadius: "20px",
                    borderBottomRightRadius: "20px",
                    paddingRight: "50px",
                    paddingLeft: "50px",
                    fontWeight: "bold",
                  }}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    DelteandreadBankExcel(file);
                  }}
                />
              </InputGroup>
            </Form.Group>
          )}

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
                    borderTopRightRadius: "20px",
                    borderBottomRightRadius: "20px",
                    paddingRight: "50px",
                    paddingLeft: "50px",
                    fontWeight: "bold",
                  }}
                >
                  주문내역 업로드(우측의 "파일 선택" 버튼을 클릭하여 주문내역을
                  업로드 해주세요)
                </Button>
              </InputGroup.Prepend>

              <input
                type="file"
                style={{
                  borderTopLeftRadius: "20px",
                  borderBottomLeftRadius: "20px",
                  borderTopRightRadius: "20px",
                  borderBottomRightRadius: "20px",
                  paddingRight: "50px",
                  paddingLeft: "50px",
                  fontWeight: "bold",
                }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  readExcel(file);
                }}
              />
            </InputGroup>
          </Form.Group>

          <div class="table-responsive mt-4">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">발주자명</th>
                  <th scope="col">업체상호 </th>
                  <th scope="col">가게주소</th>
                  <th scope="col">전화번호</th>
                  <th scope="col">상품코드</th>
                  <th scope="col">컬러</th>
                  <th scope="col">사이즈</th>
                  <th scope="col">단가</th>
                  <th scope="col">수량</th>
                  <th scope="col">합계</th>
                  <th scope="col">비고</th>
                </tr>
              </thead>
              <tbody>
                {items.map((d) => (
                  <tr key={d.비고}>
                    <td>{d.발주자명}</td>
                    <td>{d.업체상호}</td>
                    <td>{d.가게주소}</td>
                    <td>{d.전화번호}</td>
                    <td>{d.상품코드}</td>
                    <td>{d.컬러}</td>
                    <td>{d.사이즈}</td>
                    <td>{d.단가}</td>
                    <td>{d.수량}</td>
                    <td>{d.합계}</td>
                    <td>{d.비고}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button
            variant="dark"
            style={{
              fontWeight: "secondary",
              marginTop: "100px",
              marginBottom: "30px",
            }}
          >
            대량이체파일 생성결과
          </Button>

          <ToolkitProvider
            keyField="id"
            data={filtered3}
            columns={userColumns}
            bootstrap4
            search
            exportCSV={{
              fileName: "대량이체파일.csv",
              blobType: "text/csv;charset=utf8",
            }}
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
    </Fragment>
  );
}

export default FinishProcess;
