import React, { useState, Fragment, useEffect } from "react";
import Breadcrumb from "../../common/breadcrumb";
import { useQuery, useMutation } from "@apollo/client";
import { CREATE_ORDER, VIEW_PAGINATION } from "../../graphql/graphql";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory from "react-bootstrap-table2-filter";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import moment from "moment";
import Loader from "../../common/loader";
import * as XLSX from "xlsx";
import ReactS3 from "react-s3";
import AWS from "aws-sdk";
import S3 from "react-aws-s3";
import html2canvas from "html2canvas";
import jsPdf from "jspdf";
import { Tabs, TabList, TabPanel, Tab } from "react-tabs";
import {
  SplitButton,
  Dropdown,
  Form,
  InputGroup,
  Button,
  TextArea,
  Table,
  Modal,
} from "react-bootstrap";
import { ValuesOfCorrectTypeRule } from "graphql";

var wholetotalhh = 0;

var wholetotal1 = 0;
var wholetotalProducts1 = 0;
var arrCheckVal = new Array();
var sameNumberCheck = 0;

var now1 = Date.now();
let date1 = new Date(now1);
let orderDate = moment(date1).format("YYYY-MM-DD");

function UploadOrder(props) {
  const captureRef = React.createRef();
  const displayRef = React.createRef();

  const [excelDataRaw, setexcelDataRaw] = useState([]);
  const [excelDataRaw2, setexcelDataRaw2] = useState([]);

  const [filtercount, setfiltercount] = useState(-1);
  const [displayStatus, setdisplayStatus] = useState(true);
  const [resultData, setresultData] = useState([]);
  const [resultData2, setresultData2] = useState([]);
  const [contestview, setcontestview] = useState(true);
  const [ButtonView, setButtonView] = useState(false);
  const [ButtonView1, setButtonView1] = useState(false);
  const [ButtonView2, setButtonView2] = useState(false);

  const [finalCount, setfinalCount] = useState(-1);

  const [defaultModalShow, setdefaultModalShow] = useState(false);
  const [defaultModalShow1, setdefaultModalShow1] = useState(false);
  const [modalButtonShow, setmodalButtonShow] = useState(false);
  const [noticeShow, setnoticeShow] = useState(false);

  const [sameArray, setsameArray] = useState([]);

  const [wholetotal, setwholetotal] = useState(0);
  const [wholetotalProducts, setwholetotalProducts] = useState(0);

  const [startfiltering, setstartfiltering] = useState([]);

  var aJsonArray = [];

  var aJson = new Object();
  var aJson1 = new Object();
  var finalStatus = false;

  //210107

  useEffect(() => {
    if (startfiltering !== [] && startfiltering.length !== undefined) {
      var jarrayfINAL = [];

      for (var i = 0; i < startfiltering.length; i++) {
        if (startfiltering[i].상품코드.toString().length > 0) {
          jarrayfINAL = jarrayfINAL.concat(startfiltering[i]);
        }
        if (startfiltering.length - 1 == i) {
          console.log("jarrayfINAL", jarrayfINAL);
          setexcelDataRaw(jarrayfINAL);
        }
      }
    }
  }, [startfiltering]);

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

  useEffect(() => {}, [, wholetotal]);

  useEffect(() => {}, [wholetotalProducts]);

  useEffect(() => {
    html2canvas(captureRef.current).then((canvas) => {
      if (resultData[filtercount] !== undefined) {
        var blob = dataURLtoBlob(canvas.toDataURL("image/png"));
        var fd = new File(
          [blobToFile(blob, `${new Date().toISOString()}.png`)],
          `${new Date().toISOString()}.png`
        );

        ReactS3Client.uploadFile(fd)
          .then((data) => {
            if (excelDataRaw2[0].samename !== undefined) {
              var aJsonArrayNew = new Array();
              var totalValue = 0;

              for (
                var j = 0;
                j < excelDataRaw2[0].상품코드.toString().split("--dd--").length;
                j++
              ) {
                var arrarr = excelDataRaw2[0].단가.toString().split("--dd--");
                var arrarr1 = excelDataRaw2[0].상품코드
                  .toString()
                  .split("--dd--");
                var arrarr2 = excelDataRaw2[0].컬러.toString().split("--dd--");
                var arrarr3 = excelDataRaw2[0].사이즈
                  .toString()
                  .split("--dd--");
                var arrarr4 = excelDataRaw2[0].수량.toString().split("--dd--");
                var arrarr5 = excelDataRaw2[0].합계.toString().split("--dd--");

                aJson1.상품코드 = arrarr1;
                wholetotalhh = wholetotalhh + Number(arrarr5[j]);

                wholetotal1 = wholetotal1 + Number(arrarr5[j]);
                wholetotalProducts1 = wholetotalProducts1 + Number(arrarr4[j]);
                totalValue = totalValue + Number(arrarr5[j]);

                var aJsonNew = new Object();
                aJsonNew.단가 = `${arrarr[j]}`;
                aJsonNew.상품코드 = `${arrarr1[j]}`;
                aJsonNew.컬러 = `${arrarr2[j]}`;
                aJsonNew.사이즈 = `${arrarr3[j]}`;
                aJsonNew.수량 = `${arrarr4[j]}`;
                aJsonNew.합계 = `${arrarr5[j]}`;

                aJsonArrayNew.push(aJsonNew);

                if (
                  excelDataRaw2[0].상품코드.toString().split("--dd--").length -
                    1 ==
                  j
                ) {
                  setwholetotal(wholetotalhh);
                  setwholetotalProducts(wholetotalProducts1);
                  console.log("wholetotalhh", wholetotalhh);
                  console.log("wholetotalProducts1", wholetotalProducts1);

                  aJson.totalValue = totalValue;
                  aJson.totalValueComa = totalValue
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                  aJson.비고1 = excelDataRaw2[0].비고1.toString();
                  aJson.비고2 = excelDataRaw2[0].비고2.toString();
                  aJson.업체상호 = excelDataRaw2[0].업체상호.toString();
                  aJson.가게주소 = excelDataRaw2[0].가게주소.toString();
                  aJson.전화번호 = excelDataRaw2[0].전화번호.toString();
                  aJson.전화번호1 = excelDataRaw2[0].전화번호
                    .replaceAll("-", "")
                    .substr(1)
                    .replace("1", "821");
                  aJson.상품코드 = excelDataRaw2[0].상품코드.toString();
                  aJson.컬러 = excelDataRaw2[0].컬러.toString();
                  aJson.사이즈 = excelDataRaw2[0].사이즈.toString();
                  aJson.단가 = excelDataRaw2[0].단가.toString();
                  aJson.수량 = excelDataRaw2[0].수량.toString();
                  aJson.합계 = excelDataRaw2[0].합계.toString();
                  aJson.채팅링크 = excelDataRaw2[0].채팅링크.toString();
                  aJson.사입팀명 = excelDataRaw2[0].사입팀명.toString();

                  aJson.합계 = excelDataRaw2[0].합계.toString();
                  aJson.a = data.location;
                  aJson.결제방식 = excelDataRaw2[0].결제방식.toString();
                  aJson.예금주명 = excelDataRaw2[0].예금주명.toString();

                  aJson.발주자명 = excelDataRaw2[0].발주자명.toString();
                  aJson.비고1 = excelDataRaw2[0].비고1.toString();
                  aJson.비고2 = excelDataRaw2[0].비고2.toString();
                  aJson.sameArray = aJsonArrayNew;
                  aJson.sameArray2 = aJsonArrayNew;
                  aJsonArray = aJson;
                  setresultData2(resultData2.concat(aJsonArray));
                  console.log("resultData2", resultData2);
                }
              }
            } else {
              setwholetotal(wholetotal + Number(excelDataRaw2[0].합계));

              setwholetotalProducts(
                wholetotalProducts + Number(excelDataRaw2[0].수량)
              );
              console.log("wholetotalhh", wholetotalhh);
              console.log("wholetotalProducts1", wholetotalProducts1);
              wholetotalhh = wholetotalhh + Number(excelDataRaw2[0].합계);
              wholetotalProducts1 =
                wholetotalProducts1 + Number(excelDataRaw2[0].수량);

              aJson.비고1 = excelDataRaw2[0].비고1.toString();
              aJson.비고2 = excelDataRaw2[0].비고2.toString();
              aJson.업체상호 = excelDataRaw2[0].업체상호.toString();
              aJson.가게주소 = excelDataRaw2[0].가게주소.toString();
              aJson.전화번호 = excelDataRaw2[0].전화번호.toString();
              aJson.전화번호1 = excelDataRaw2[0].전화번호
                .replaceAll("-", "")
                .substr(1)
                .replace("1", "821");
              aJson.상품코드 = excelDataRaw2[0].상품코드.toString();
              aJson.컬러 = excelDataRaw2[0].컬러.toString();
              aJson.사이즈 = excelDataRaw2[0].사이즈.toString();
              aJson.단가 = excelDataRaw2[0].단가.toString();
              aJson.수량 = excelDataRaw2[0].수량.toString();
              aJson.합계 = excelDataRaw2[0].합계.toString();
              aJson.totalValue = excelDataRaw2[0].합계.toString();

              aJson.totalValueComa = excelDataRaw2[0].합계
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

              aJson.a = data.location;
              aJson.사입팀명 = excelDataRaw2[0].사입팀명.toString();
              aJson.발주자명 = excelDataRaw2[0].발주자명.toString();
              aJson.채팅링크 = excelDataRaw2[0].채팅링크.toString();
              aJson.합계 = excelDataRaw2[0].합계.toString();
              aJson.결제방식 = excelDataRaw2[0].결제방식.toString();
              aJson.예금주명 = excelDataRaw2[0].예금주명.toString();
              aJson.비고1 = excelDataRaw2[0].비고1.toString();
              aJson.비고2 = excelDataRaw2[0].비고2.toString();

              aJsonArray = aJson;
              setresultData2(resultData2.concat(aJsonArray));
              console.log("resultData2", resultData2);
            }
          })
          .catch((err) => console.error("error", err));
      }
    });
  }, [resultData]);

  useEffect(() => {
    if (resultData[filtercount] !== undefined) {
      setfiltercount(filtercount + 1);
    }
  }, [resultData2]);

  useEffect(() => {
    if (excelDataRaw2[0] !== undefined) {
      if (excelDataRaw2[0].samename !== undefined) {
        var aJsonArrayNew = new Array();
        var totalValue = 0;
        for (
          var j = 0;
          j < excelDataRaw2[0].상품코드.toString().split("--dd--").length;
          j++
        ) {
          var arrarr = excelDataRaw2[0].단가.toString().split("--dd--");
          var arrarr1 = excelDataRaw2[0].상품코드.toString().split("--dd--");
          var arrarr2 = excelDataRaw2[0].컬러.toString().split("--dd--");
          var arrarr3 = excelDataRaw2[0].사이즈.toString().split("--dd--");
          var arrarr4 = excelDataRaw2[0].수량.toString().split("--dd--");
          var arrarr5 = excelDataRaw2[0].합계.toString().split("--dd--");

          totalValue = totalValue + Number(arrarr5[j]);

          aJson1.상품코드 = arrarr1;

          var aJsonNew = new Object();
          aJsonNew.단가 = `${arrarr[j]}`;
          aJsonNew.상품코드 = `${arrarr1[j]}`;
          aJsonNew.컬러 = `${arrarr2[j]}`;
          aJsonNew.사이즈 = `${arrarr3[j]}`;
          aJsonNew.수량 = `${arrarr4[j]}`;
          aJsonNew.합계 = `${arrarr5[j]}`;
          aJsonNew.단가coma = `${arrarr[j]
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
          console.log("단가coma", aJsonNew.단가coma);
          aJsonNew.합계coma = `${arrarr5[j]
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

          aJsonArrayNew.push(aJsonNew);

          if (
            excelDataRaw2[0].상품코드.toString().split("--dd--").length - 1 ==
            j
          ) {
            aJson.업체상호 = excelDataRaw2[0].업체상호.toString();
            aJson.가게주소 = excelDataRaw2[0].가게주소.toString();
            aJson.전화번호 = excelDataRaw2[0].전화번호.toString();
            aJson.전화번호1 = excelDataRaw2[0].전화번호
              .replaceAll("-", "")
              .substr(1)
              .replace("1", "821");
            aJson.상품코드 = excelDataRaw2[0].상품코드.toString();
            aJson.컬러 = excelDataRaw2[0].컬러.toString();
            aJson.사이즈 = excelDataRaw2[0].사이즈.toString();
            aJson.단가 = excelDataRaw2[0].단가.toString();
            aJson.수량 = excelDataRaw2[0].수량.toString();
            aJson.합계 = excelDataRaw2[0].합계.toString();

            aJson.totalValue = totalValue;

            aJson.totalValueComa = totalValue
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

            aJson.단가coma = excelDataRaw2[0].단가
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            aJson.수량 = excelDataRaw2[0].수량.toString();
            aJson.합계coma = excelDataRaw2[0].합계
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

            aJson.사입팀명 = excelDataRaw2[0].사입팀명.toString();

            aJson.합계 = excelDataRaw2[0].합계.toString();
            aJson.a = "link";
            aJson.결제방식 = excelDataRaw2[0].결제방식.toString();
            aJson.예금주명 = excelDataRaw2[0].예금주명.toString();
            aJson.발주자명 = excelDataRaw2[0].발주자명.toString();
            aJson.비고1 = excelDataRaw2[0].비고1.toString();
            aJson.비고2 = excelDataRaw2[0].비고2.toString();
            aJson.sameArray = aJsonArrayNew;
            aJson.sameArray2 = aJsonArrayNew;
            aJsonArray = aJson;

            setresultData(resultData.concat(aJsonArray));
          }
        }
      } else {
        aJson.비고1 = excelDataRaw2[0].비고1.toString();
        aJson.비고2 = excelDataRaw2[0].비고2.toString();
        aJson.업체상호 = excelDataRaw2[0].업체상호.toString();
        aJson.가게주소 = excelDataRaw2[0].가게주소.toString();
        aJson.전화번호 = excelDataRaw2[0].전화번호.toString();
        aJson.전화번호1 = excelDataRaw2[0].전화번호
          .replaceAll("-", "")
          .substr(1)
          .replace("1", "821");
        aJson.상품코드 = excelDataRaw2[0].상품코드.toString();
        aJson.컬러 = excelDataRaw2[0].컬러.toString();
        aJson.사이즈 = excelDataRaw2[0].사이즈.toString();
        aJson.단가 = excelDataRaw2[0].단가.toString();
        aJson.수량 = excelDataRaw2[0].수량.toString();
        aJson.합계 = excelDataRaw2[0].합계.toString();
        aJson.totalValue = excelDataRaw2[0].합계.toString();
        aJson.totalValueComa = excelDataRaw2[0].합계
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        aJson.a = "link";
        aJson.사입팀명 = excelDataRaw2[0].사입팀명.toString();
        aJson.발주자명 = excelDataRaw2[0].발주자명.toString();
        aJson.합계 = excelDataRaw2[0].합계.toString();
        aJson.결제방식 = excelDataRaw2[0].결제방식.toString();
        aJson.예금주명 = excelDataRaw2[0].예금주명.toString();
        aJson.비고1 = excelDataRaw2[0].비고1.toString();
        aJson.비고2 = excelDataRaw2[0].비고2.toString();

        aJson.단가coma = excelDataRaw2[0].단가
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        aJson.합계coma = excelDataRaw2[0].합계
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        aJsonArray = aJson;
        setresultData(resultData.concat(aJsonArray));
      }
    }
  }, [excelDataRaw2]);

  useEffect(() => {
    if (filtercount > -1 && excelDataRaw.length > filtercount) {
      setexcelDataRaw2([excelDataRaw[filtercount]]);
      setcontestview(true);
    } else {
      if (excelDataRaw[0] !== undefined) {
        setcontestview(false);
        setButtonView(true);
        setButtonView1(true);
        setButtonView2(true);
      }
      setdisplayStatus(true);
    }
  }, [filtercount]);

  useEffect(() => {
    if (excelDataRaw.length !== 0) {
      setdefaultModalShow1(true);
    }
  }, [excelDataRaw]);

  useEffect(() => {
    if (displayStatus === false && excelDataRaw[0] !== undefined) {
      setfiltercount(filtercount + 1);
    }
  }, [displayStatus]);

  useEffect(() => {
    if (finalCount == resultData.length - 1 && excelDataRaw[0] !== undefined) {
      setmodalButtonShow(true);
    }
  }, [finalCount]);

  const closeAndReload = () => {
    window.location.reload();
  };

  const closeAndReload1 = () => {
    setnoticeShow(true);
    testdd();
  };

  const createComa = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const finalOrder = async () => {
    setdefaultModalShow(true);

    var now = Date.now();
    let date = new Date(now);

    let date1 = moment(date).format("YY년MM월DD일 HH:mm");
    try {
      var aJsonArray = new Array();

      for (var i = 0; i < resultData2.length; i++) {
        var aJson = new Object();
        aJson.message_type = "at";
        aJson.phn = `${resultData2[i].전화번호1}`;
        aJson.profile = "f1be83880075422f15c32b4ca7b56f5dcfef46a7";
        aJson.reserveDt = "00000000000000";
        aJson.msg =
          "발주자명 : " +
          `${resultData2[i].발주자명}` +
          "\n발주날짜 : " +
          `${date1}` +
          "\n\n" +
          `${resultData2[i].비고1}` +
          "\n\n발주서보기 > " +
          `${resultData2[i].a}` +
          "\n\n문의하기 > " +
          `${resultData2[i].채팅링크}`;
        aJson.tmplId = "pickman004";
        aJsonArray.push(aJson);
      }

      var result = await fetch(
        "https://alimtalk-api.bizmsg.kr/v2/sender/send",

        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            userid: "jinwoo7836",
          },
          body: JSON.stringify(aJsonArray),
        }
      );

      if (result.status !== 200) {
        window.alert("발주양식을 다시 확인해주세요.");
        window.location.reload();
      }
      if (result.status == 200) {
        handleSubmit();
      }
    } catch (e) {
      window.alert("발주양식을 다시 확인해주세요.");
      window.location.reload();
    }
  };

  const config = {
    bucketName: "jwparkbucket",
    region: "ap-northeast-2",
    accessKeyId: "AKIAICMXEOVCKDCYF66A",
    secretAccessKey: "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",
  };
  const ReactS3Client = new S3(config);

  const blobToFile = (theBlob, fileName) => {
    var date = new Date();
    theBlob.lastModifiedDate = date;
    theBlob.lastModified = date.getTime();
    theBlob.name = fileName;
    return theBlob;
  };
  const dataURLtoBlob = (dataurl) => {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: "image/png" });
  };

  const testdd = () => {
    if (displayStatus == true && excelDataRaw[0] !== undefined) {
      setdisplayStatus(false);
    } else {
    }
  };

  const [uploadData, setuploadData] = useState([]);
  const menual =
    "1. (필수) 사용하시기 전 '이용자 메뉴얼'에 나와있는 대로 사용해주세요.\n\n" +
    "2.하단의 '파일 선택'버튼을 클릭 후 엑셀을 업로드 해 주세요(.xlsx형식으로 변환 후 업로드)\n\n" +
    "3. 입력한 양식과 자동 생성된 발주서양식이 맞는지 확인해주세요(엑셀을 업로드 하신 후, 하단의 '발주서 링크' 테이블 밑으로 생성된 발주서의 링크를 클릭하여 확인하실 수 있습니다)\n\n" +
    "4. 주문한 내역을 '발주내역 보기' 페이지에서 확인해 주세요";

  var count = "";

  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      let last_dot = file.name.lastIndexOf(".");
      let ext = file.name.slice(last_dot + 1);

      if (ext !== "xlsx") {
        window.alert(
          "업로드하신 파일의 확장자명이 xlsx 인지 다시 확인해주세요."
        );
        window.location.reload();
      }

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
      var finalData = [];
      if (d.length == 0) {
        window.alert(
          "파일 확장자를 .xlsx형식으로 변환 후 다시 업로드 해 주세요"
        );
        window.location.reload();
      } else {
        console.log("d", d);
        for (var i = 0; i < d.length - 1; i++) {
          var arrayTest = d[i].업체상호;

          for (var j = i + 1; j < d.length; j++) {
            if (arrayTest == d[j].업체상호) {
              d[i].samename = arrayTest;
              d[j].samename = arrayTest;

              if (d[i].상품코드 !== "") {
                d[i].상품코드 = d[i].상품코드 + "--dd--" + d[j].상품코드;
                d[j].상품코드 = "";

                d[i].컬러 = d[i].컬러 + "--dd--" + d[j].컬러;
                d[j].컬러 = "";

                d[i].사이즈 = d[i].사이즈 + "--dd--" + d[j].사이즈;
                d[j].사이즈 = "";

                d[i].단가 = d[i].단가 + "--dd--" + d[j].단가;
                d[j].단가 = "";

                d[i].수량 = d[i].수량 + "--dd--" + d[j].수량;
                d[j].수량 = "";

                d[i].합계 = d[i].합계 + "--dd--" + d[j].합계;
                d[j].합계 = "";
              }

              sameNumberCheck = sameNumberCheck + 1;

              finalData.push(arrayTest);

              if (d.length - 2 == i && d.length - 1 == j) {
                setstartfiltering(d);
                if (d.length - 2 == i && d.length - 1 == j) {
                  setstartfiltering(d);
                }
              }
            } else {
              if (d.length - 2 == i && d.length - 1 == j) {
                setstartfiltering(d);
                if (d.length - 2 == i && d.length - 1 == j) {
                  setstartfiltering(d);
                }
              }
            }
          }
        }
      }
    });
  };

  const finalColum = [
    {
      text: "업체상호",
      dataField: "업체상호",
      sort: true,
      headerStyle: {
        backgroundColor: "#3366ff",
        color: "white",
      },
      style: {
        cursor: "pointer",
      },
    },
    {
      text: "생성된 발주서 링크",
      dataField: "a",
      sort: true,
      headerStyle: {
        backgroundColor: "#3366ff",
        color: "white",
      },
      style: {
        cursor: "pointer",
        color: "#3366ff",
      },
      events: {
        onClick: (e, column, columnIndex, row, rowIndex) => {
          window.open(row.a, "_blank");
        },
      },
    },
  ];

  const [newData] = useMutation(VIEW_PAGINATION, {
    onCompleted: (data) => {
      var jArray = [];

      for (var i = 0; i < data.usersbyRollPagination.length; i++) {
        jArray = jArray.concat(data.usersbyRollPagination[i]);

        if (data.usersbyRollPagination.length - 1 == i) {
          return;
        }
      }
    },
    onError: (error) => console.log(error),
    key: "graphql12",
  });

  const [createOrder] = useMutation(CREATE_ORDER, {
    onError: (error) => console.log(error.message),
    onCompleted: () => {
      setfinalCount(finalCount + 1);
    },
  });

  const handleSubmit = async () => {
    var date = Date.now();
    var date1 = moment(date).format("YY.MM.DD HH:mm:ss");

    if (!null) {
      var userId = window.localStorage.getItem("user_id");
      var roll = window.localStorage.getItem("user_roll");
      var email = window.localStorage.getItem("user_email");

      for (var i = 0; i < resultData.length; i++) {
        count = i;
        createOrder({
          variables: {
            userId: userId,
            date: date1.toString(),
            name: resultData2[i].업체상호.toString(),
            address: resultData2[i].가게주소.toString(),
            phone: resultData2[i].전화번호.toString(),
            code: resultData2[i].상품코드.toString().substr(0, 3) + "...",
            color: resultData2[i].컬러.toString().substr(0, 3) + "...",
            size: resultData2[i].사이즈.toString().substr(0, 3) + "...",
            price: resultData2[i].단가.toString().substr(0, 3) + "...",
            amount: resultData2[i].수량.toString().substr(0, 3) + "...",
            total: resultData2[i].totalValue.toString(),
            roll: roll,
            email: email,
            url: resultData2[i].a.toString(),
          },
        });
      }
    } else {
      window.alert("엑셀 데이터를 다시 확인해 주세요");
    }
  };

  return (
    <Fragment>
      <div
        ref={captureRef}
        style={{
          paddingBottom: "100px",
        }}
      >
        <Breadcrumb title="업로드 및 발주" parent="픽맨" />

        <Modal centered show={defaultModalShow} size={null}>
          <Modal.Header>
            <Modal.Title as="h5">발주서 전송</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            {modalButtonShow ? (
              <span className="text-info">발주서 전송을 완료하였습니다.</span>
            ) : (
              <span className="text-info">
                발주서를 발주처에게 카카오톡 전송 중 입니다.
              </span>
            )}
          </Modal.Body>
          <Modal.Footer>
            {modalButtonShow ? (
              <Button
                variant="danger"
                onClick={closeAndReload}
                className="text-center"
              >
                확인
              </Button>
            ) : (
              <Button variant="danger" className="text-center">
                잠시만 기다려주세요.
              </Button>
            )}
          </Modal.Footer>
        </Modal>

        {noticeShow ? (
          <div></div>
        ) : (
          <Modal centered show={defaultModalShow1} size={null}>
            <Modal.Header>
              <Modal.Title as="h5">확인사항</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
              <span className="text-info">
                발주서를 자동 생성하는 동안 컴퓨터 화면을 움직이시면,
              </span>
              <br />
              <span className="text-info">
                발주서 생성 시 오류가 발생할 수 있습니다.
              </span>
              <br />
              <span className="text-info">
                생성 완료 후 다음 작업을 진행해주세요.
              </span>
              <br />
              <span className="text-info">위 사항들을 숙지하셨으면,</span>
              <br />
              <span className="text-info">
                아래의 "발주서 생성 시작" 버튼을 눌러 생성을 시작해주세요.
              </span>
            </Modal.Body>
            <Modal.Footer className="text-center">
              <Button variant="danger" onClick={closeAndReload1}>
                발주서 생성 시작
              </Button>
            </Modal.Footer>
          </Modal>
        )}

        <div className="align-self-center text-center">
          {displayStatus && (
            <div style={{}}>
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
              <input
                type="file"
                style={{
                  marginBottom: "20px",
                }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  readExcel(file);
                }}
              />
            </div>
          )}
          <div>
            <div
              style={{
                marginLeft: "100px",
                marginRight: "100px",
                overflowWrap: "break-word",
              }}
            >
              <Fragment>
                {excelDataRaw2[0] !== undefined &&
                  contestview &&
                  resultData[filtercount] !== undefined && (
                    <form className="form-horizontal auth-form mt-5">
                      <div className="row">
                        <div
                          className="col-sm-12"
                          style={{
                            textAlign: "center",
                            marginTop: "50px",
                            marginBottom: "40px",
                            fontSize: "56px",
                            fontWeight: "800",
                          }}
                        >
                          발주서
                        </div>
                        <div className="col-sm-6">
                          <Form.Group>
                            <InputGroup>
                              <InputGroup.Prepend>
                                <Button
                                  variant="danger"
                                  style={{
                                    width: "300px",
                                    backgroundColor: "#ff8084 !important",
                                    fontSize: "34px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  동대문 도매업체
                                </Button>
                              </InputGroup.Prepend>
                              <Form.Control
                                placeholder="예) E"
                                value={resultData[filtercount].업체상호}
                                style={{
                                  fontSize: "34px",
                                  fontWeight: "bold",
                                }}
                              />
                            </InputGroup>
                          </Form.Group>
                        </div>
                        <div className="col-sm-6">
                          <Form.Group>
                            <InputGroup>
                              <InputGroup.Prepend>
                                <Button
                                  variant="danger"
                                  style={{
                                    width: "300px",
                                    backgroundColor: "#ff8084 !important",
                                    fontSize: "34px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  발주자명
                                </Button>
                              </InputGroup.Prepend>
                              <Form.Control
                                placeholder="예) E"
                                value={resultData[filtercount].발주자명}
                                style={{
                                  fontSize: "34px",
                                  fontWeight: "bold",
                                }}
                              />
                            </InputGroup>
                          </Form.Group>
                        </div>
                        <div className="col-sm-6">
                          {" "}
                          <Form.Group>
                            <InputGroup>
                              <InputGroup.Prepend>
                                <Button
                                  variant="danger"
                                  style={{
                                    width: "300px",
                                    backgroundColor: "#ff8084 !important",
                                    fontSize: "34px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  발주날짜
                                </Button>
                              </InputGroup.Prepend>
                              <Form.Control
                                placeholder="예) E"
                                style={{
                                  fontSize: "34px",
                                  fontWeight: "bold",
                                }}
                                value={orderDate}
                              />
                            </InputGroup>
                          </Form.Group>
                        </div>
                        <div className="col-sm-6">
                          {" "}
                          <Form.Group>
                            <InputGroup>
                              <InputGroup.Prepend>
                                <Button
                                  variant="danger"
                                  style={{
                                    width: "300px",
                                    backgroundColor: "#ff8084 !important",
                                    fontSize: "34px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  사입팀명
                                </Button>
                              </InputGroup.Prepend>
                              <Form.Control
                                placeholder="예) E"
                                style={{
                                  fontSize: "34px",
                                  fontWeight: "bold",
                                }}
                                value={resultData[filtercount].사입팀명}
                              />
                            </InputGroup>
                          </Form.Group>
                        </div>{" "}
                      </div>

                      <div className="row">
                        <div
                          className="col-sm-12"
                          style={{
                            textAlign: "center",
                            marginTop: "50px",
                            marginBottom: "20px",
                            fontSize: "56px",
                            fontWeight: "800",
                          }}
                        >
                          발주내용
                        </div>
                      </div>
                      {/* {excelDataRaw2[0] !== undefined ? ( */}
                      <div class="row">
                        {" "}
                        <div class="col-sm-12">
                          <div class="table-responsive mt-4">
                            <table class="table">
                              <thead
                                style={{
                                  fontSize: "32px",
                                  fontWeight: "bold",
                                  lineHeight: "70px",
                                }}
                              >
                                <tr>
                                  <th scope="col">상품명(상품코드)</th>
                                  <th scope="col">칼라</th>
                                  <th scope="col">사이즈</th>
                                  <th scope="col">단가</th>
                                  <th scope="col">수량</th>
                                  <th scope="col">합계</th>
                                </tr>
                              </thead>
                              {resultData[filtercount].sameArray ===
                              undefined ? (
                                <tbody
                                  style={{
                                    fontSize: "28px",
                                    fontWeight: "bold",
                                    lineHeight: "70px",
                                  }}
                                >
                                  <tr>
                                    <td>{resultData[filtercount].상품코드}</td>
                                    <td>{resultData[filtercount].컬러}</td>
                                    <td>{resultData[filtercount].사이즈}</td>
                                    <td>{resultData[filtercount].단가coma}</td>
                                    <td>{resultData[filtercount].수량}</td>
                                    <td>{resultData[filtercount].합계coma}</td>
                                  </tr>
                                </tbody>
                              ) : (
                                <tbody
                                  style={{
                                    fontSize: "28px",
                                    fontWeight: "bold",
                                    lineHeight: "70px",
                                  }}
                                >
                                  {resultData[filtercount].sameArray2.map(
                                    (d) => (
                                      // <tr key={d.상품코드}>
                                      <tr
                                        style={{
                                          verticalAlign: "middle",
                                        }}
                                      >
                                        <td style={{}}>{d.상품코드}</td>
                                        <td>{d.컬러}</td>
                                        <td>{d.사이즈}</td>
                                        <td>{d.단가coma}</td>
                                        <td>{d.수량}</td>
                                        <td>{d.합계coma}</td>
                                      </tr>
                                    )
                                  )}
                                </tbody>
                              )}
                            </table>
                          </div>
                        </div>{" "}
                      </div>

                      <div
                        className="row"
                        style={{
                          marginTop: "50px",
                        }}
                      >
                        <div className="col-sm-7"></div>
                        <div className="col-sm-5">
                          <Form.Group>
                            <InputGroup>
                              <InputGroup.Prepend>
                                <Button
                                  variant="danger"
                                  style={{
                                    backgroundColor: "#ff8084 !important",
                                    width: "200px",
                                    fontSize: "28px",
                                    fontWeight: "bold",
                                    textAlign: "right !important",
                                  }}
                                >
                                  합계
                                </Button>
                              </InputGroup.Prepend>

                              {resultData[filtercount].sameArray ===
                              undefined ? (
                                <Form.Control
                                  placeholder="예) E"
                                  style={{
                                    fontSize: "28px",
                                    fontWeight: "bold",
                                    textAlign: "right !important",
                                  }}
                                  value={resultData[filtercount].합계coma}
                                />
                              ) : (
                                <Form.Control
                                  placeholder="예) E"
                                  style={{
                                    fontSize: "28px",
                                    fontWeight: "bold",
                                  }}
                                  value={resultData[filtercount].totalValueComa}
                                />
                              )}
                            </InputGroup>
                          </Form.Group>
                        </div>

                        <div className="col-sm-12">
                          {" "}
                          <Form.Group
                            style={{
                              fontSize: "28px",
                              fontWeight: "bold",
                            }}
                          >
                            <InputGroup>
                              <InputGroup.Prepend>
                                <Button
                                  variant="danger"
                                  style={{
                                    backgroundColor: "#ff8084 !important",
                                    width: "200px",
                                    fontSize: "28px",
                                    fontWeight: "bold",
                                    fontSize: "28px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  결제방식
                                </Button>
                              </InputGroup.Prepend>
                              <Form.Control
                                style={{
                                  fontSize: "28px",
                                  fontWeight: "bold",
                                }}
                                placeholder="예) E"
                                style={{
                                  fontSize: "28px",
                                  fontWeight: "bold",
                                }}
                                value={resultData[filtercount].결제방식}
                              />
                            </InputGroup>
                          </Form.Group>
                        </div>

                        <div className="col-sm-12">
                          {" "}
                          <Form.Group>
                            <InputGroup>
                              <InputGroup.Prepend>
                                <Button
                                  variant="danger"
                                  style={{
                                    backgroundColor: "#ff8084 !important",
                                    width: "200px",
                                    fontSize: "28px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  예금주명
                                </Button>
                              </InputGroup.Prepend>
                              <Form.Control
                                placeholder="예) E"
                                style={{
                                  fontSize: "28px",
                                  fontWeight: "bold",
                                }}
                                value={resultData[filtercount].예금주명}
                              />
                            </InputGroup>
                          </Form.Group>
                        </div>
                      </div>
                      <div
                        className="row"
                        style={{
                          flexDirection: "row",
                        }}
                      >
                        <div className="col-sm-12">
                          {" "}
                          <Form.Group>
                            <InputGroup>
                              <InputGroup.Prepend>
                                <Button
                                  variant="danger"
                                  style={{
                                    backgroundColor: "#ff8084 !important",
                                    width: "200px",
                                    fontSize: "28px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  비고1
                                </Button>
                              </InputGroup.Prepend>
                              <Form.Control
                                placeholder="예) E"
                                style={{
                                  fontSize: "28px",
                                  fontWeight: "bold",
                                }}
                                value={resultData[filtercount].비고1}
                              />
                            </InputGroup>
                          </Form.Group>
                        </div>{" "}
                        <div className="col-sm-12">
                          {" "}
                          <Form.Group>
                            <InputGroup>
                              <InputGroup.Prepend style={{}}>
                                <Button
                                  variant="danger"
                                  style={{
                                    backgroundColor: "#ff8084 !important",
                                    width: "200px",
                                    fontSize: "28px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  비고2
                                </Button>
                              </InputGroup.Prepend>

                              <span
                                style={{
                                  fontSize: "28px",
                                  fontWeight: "bold",
                                  marginLeft: "30px",
                                  verticalAlign: "middle",
                                  marginTop: "10px",
                                  textAlign: "left",
                                }}
                              >
                                {" "}
                                {resultData[filtercount].비고2}
                              </span>
                            </InputGroup>
                          </Form.Group>
                        </div>{" "}
                      </div>
                      <div className="form-button"></div>
                    </form>
                  )}
                {displayStatus && resultData2 && (
                  <ToolkitProvider
                    keyField="id"
                    data={resultData2}
                    columns={finalColum}
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
                            filter={filterFactory()}
                          />
                        </div>
                      );
                    }}
                  </ToolkitProvider>
                )}{" "}
                {ButtonView && (
                  <div>
                    <span className="text-info">
                      총 발주금액 : {wholetotal}원
                    </span>
                    <br />
                    <span className="text-info">
                      총 발주수량 : {wholetotalProducts}개
                    </span>
                    <br />
                    <Button
                      style={{
                        marginTop: "20px",
                      }}
                      onClick={finalOrder}
                    >
                      최종발주
                    </Button>{" "}
                  </div>
                )}
              </Fragment>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default UploadOrder;
