import React, { useState, Fragment } from "react";
import { Tabs, TabList, TabPanel, Tab } from "react-tabs";
import { User, Unlock } from "react-feather";
import { withRouter } from "react-router-dom";
import MyDropzone from "../common/dropzone";
import {
  SplitButton,
  Dropdown,
  Form,
  InputGroup,
  Button,
} from "react-bootstrap";
import { Mutation } from "react-apollo";
import { SIGNUP, SIGNIN, UPLOAD_BUSINESS } from "../graphql/graphql";
// import {ApolloProvider} from 'react-apollo';

// import  ApolloClient  from 'apollo-boost';
import {
  getAccessToken,
  setAccessToken,
  getAccessTokenMaster,
} from "../../accessToken/accessToken";

import { useMutation } from "@apollo/client";

import { ApolloProvider } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import {
  ApolloClient,
  InMemoryCache,
  gql,
  NormalizedCacheObject,
} from "@apollo/client";

const wholesaler = [];

function LoginTabset(props) {
  const [_id, set_id] = useState(1);
  const [activeShow, setactiveShow] = useState(true);
  const [roll, setRoll] = useState("1");
  const [userId, setuserId] = useState("");
  const [password, setpassword] = useState("");
  const [passwordConfirm, setpasswordConfirm] = useState("");
  const [market, setmarket] = useState("Chung Pyung Hwa");
  const [storeName, setstoreName] = useState("");
  const [storeNameEng, setstoreNameEng] = useState("");
  const [floor, setfloor] = useState("");
  const [building, setbuilding] = useState("");
  const [room, setroom] = useState("");
  const [storePhone, setstorePhone] = useState("");
  const [phone, setphone] = useState("");
  const [email, setemail] = useState("");
  const [businessname, setbusinessname] = useState("");
  const [file, setfile] = useState("");
  const [checked, setChecked] = useState(false);
  const active = "1";
  const backdata = "1";
  const reg_email = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;

  let [businessRegistration, setbusinessRegistration] = useState(1);

  const onValueBusinessname = (e) => {
    setbusinessname(e.target.value);
  };

  const onValueEmail = (e) => {
    setemail(e.target.value);
  };

  const onValuephone = (e) => {
    setphone(e.target.value);
  };
  const onValuestorePhone = (e) => {
    setstorePhone(e.target.value);
  };
  const onValueroom = (e) => {
    setroom(e.target.value);
  };
  const onValuebuilding = (e) => {
    setbuilding(e.target.value);
  };

  const onValuefloor = (e) => {
    setfloor(e.target.value);
  };
  const onValuestoreNameEng = (e) => {
    setstoreNameEng(e.target.value);
  };

  const onValuestoreName = (e) => {
    setstoreName(e.target.value);
  };
  const onValuemarket = (e) => {
    setmarket(e.target.value);
  };
  const onValuePassword = (e) => {
    setpassword(e.target.value);
  };
  const onValuePasswordConfirm = (e) => {
    setpasswordConfirm(e.target.value);
  };

  const onValueID = (e) => {
    setuserId(e.target.value);
  };

  const onCompleted = (data) => {
    if (data) {
      window.alert("회원가입 완료");

      window.location.reload();
    }
  };

  const clickActive = (event) => {
    document.querySelector(".nav-link").classList.remove("show");
    event.target.classList.add("show");
  };

  const onClickimg = () => {};

  const [loginCompleted] = useMutation(SIGNIN, {
    onError: (error) => alert("입력정보를 다시 확인해주세요"),
    onCompleted: (response) => {
      alert("로그인이 완료되었습니다.");

      window.localStorage.setItem("logedin", "logedin");
      window.localStorage.setItem("user_id", response.loginUser.id);
      window.localStorage.setItem("user_email", response.loginUser.email);
      window.localStorage.setItem(
        "user_businessname",
        response.loginUser.businessname
      );
      window.localStorage.setItem("user_active", response.loginUser.active);
      window.localStorage.setItem("user_backdata", response.loginUser.backdata);
      var userRoll = response.loginUser.roll;
      var userActive = response.loginUser.active;
      window.localStorage.setItem("user_roll", response.loginUser.roll);

      if (userRoll == 3) {
        window.location = "/dashboard";
      } else {
        window.location = "/assets/download";
      }
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    loginCompleted({ variables: { email, password } });
  };

  const [registerCompleted] = useMutation(SIGNUP, {
    onError: (error) => alert(error),
    onCompleted: (response) => {
      alert("회원가입이 완료되었습니다.");
      window.location.reload();
    },
  });

  const handleSubmitRegister = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      return window.alert("비밀번호 확인을 다시 해 주세요");
    } else if (!reg_email.test(email)) {
      return window.alert("이메일 확인을 다시 해 주세요");
    } else {
      registerCompleted({
        variables: { email, password, roll, active, businessname, backdata },
      });
    }
  };

  const handleFile = (e) => {
    setfile(e.target.files[0]);
  };

  const onValueChecked = () => {
    setChecked(!checked);
  };

  return (
    <div>
      <Fragment>
        <div
          style={{
            textAlign: "center",
            marginTop: "50px",
            fontSize: "24px",
            fontWeight: "500",
            marginBottom: "50px",
          }}
        >
          PICK MAN
        </div>
        <Tabs>
          <TabList
            className="nav nav-tabs tab-coupon"
            style={{
              borderBottom: "0px",
            }}
          >
            <Tab className="nav-link" onClick={(e) => clickActive(e)}>
              <User />
              로그인
            </Tab>
            <Tab className="nav-link" onClick={(e) => clickActive(e)}>
              <Unlock />
              회원가입
            </Tab>
          </TabList>

          <TabPanel>
            <form className="form-horizontal auth-form mt-5">
              <div className="form-group">
                <input
                  required=""
                  name="login[username]"
                  type="email"
                  className="form-control"
                  placeholder="이메일 입력"
                  id="exampleInputEmail1"
                  onChange={onValueEmail}
                />
              </div>
              <div className="form-group">
                <input
                  required=""
                  name="login[password]"
                  type="password"
                  className="form-control"
                  placeholder="비밀번호 입력"
                  onChange={onValuePassword}
                />
              </div>

              <div className="form-button">
                <button
                  className="btn btn-primary"
                  type="submit"
                  onClick={handleSubmit}
                >
                  로그인
                </button>
              </div>
            </form>
          </TabPanel>
          <TabPanel>
            <form className="form-horizontal auth-form mt-5">
              <div className="form-group">
                <div
                  className="ml-3"
                  style={{
                    fontWeight: "bold",
                    marginBottom: "10px",
                  }}
                >
                  상호명
                </div>

                <input
                  required=""
                  name="login[username]"
                  type="text"
                  className="form-control"
                  placeholder="상호명 입력"
                  onChange={onValueBusinessname}
                />
              </div>
              <div className="form-group">
                <div
                  className="ml-3"
                  style={{
                    fontWeight: "bold",
                    marginBottom: "10px",
                  }}
                >
                  이메일
                </div>

                <input
                  required=""
                  name="login[username]"
                  type="text"
                  className="form-control"
                  placeholder="이메일 입력"
                  onChange={onValueEmail}
                />
              </div>
              <div className="form-group">
                <div
                  className="ml-3"
                  style={{
                    fontWeight: "bold",
                    marginBottom: "10px",
                  }}
                >
                  비밀번호
                </div>
                <input
                  required=""
                  name="login[password]"
                  type="password"
                  className="form-control"
                  placeholder="비밀번호"
                  onChange={onValuePassword}
                />
              </div>
              <div className="form-group">
                <div
                  className="ml-3"
                  style={{
                    fontWeight: "bold",
                    marginBottom: "10px",
                  }}
                >
                  비밀번호 확인
                </div>
                <input
                  required=""
                  name="login[password]"
                  type="password"
                  className="form-control"
                  placeholder="비밀번호 확인"
                  onChange={onValuePasswordConfirm}
                />
              </div>
              <div className="form-group">
                <div
                  className="ml-3"
                  style={{
                    fontWeight: "bold",
                    marginBottom: "10px",
                  }}
                >
                  업종 선택
                </div>
                <Form.Control
                  as="select"
                  style={{
                    paddingTop: "0",
                    paddingBottom: "0",
                  }}
                  className="custom-select"
                  value={roll}
                  onChange={(e) => setRoll(e.target.value)}
                >
                  <option value="1"> 사입자 </option>
                  <option value="2"> 소매업체 </option>
                </Form.Control>
              </div>
              {/* <div className="form-group">
                <div
                  className="ml-3"
                  style={{
                    fontWeight: "bold",
                    marginBottom: "10px",
                  }}
                >
                  회사명
                </div>
                <input
                  required=""
                  name="login[password]"
                  type="text"
                  className="form-control"
                  placeholder="회사명"
                  onChange={onValuestoreName}
                />
              </div> */}

              <div className="form-button">
                <button
                  className="btn btn-primary"
                  type="submit"
                  onClick={handleSubmitRegister}
                >
                  회원가입
                </button>
              </div>
            </form>
          </TabPanel>
        </Tabs>
      </Fragment>
    </div>
  );
}

export default withRouter(LoginTabset);
