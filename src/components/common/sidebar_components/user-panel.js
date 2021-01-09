import React, { Component } from "react";
import man from "../../../assets/images/dashboard/man.png";

var name = window.localStorage.getItem("user_email");

export class User_panel extends Component {
  render() {
    return (
      <div>
        <div className="sidebar-user text-center">
          <h5 className="mt-1">PickMan</h5>
          <h6>
            <span
              style={{
                fontSize: "12px",
              }}
            >
              {name}님, <br />
              반갑습니다.
            </span>
          </h6>
        </div>
      </div>
    );
  }
}

export default User_panel;
