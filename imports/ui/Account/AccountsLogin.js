import React, { useState } from "react";
import { Accounts } from "meteor/accounts-base";
import { Meteor } from "meteor/meteor";

import Login from "./Login";
import Regist from "./Regist";
import LostPw from "./LostPw";

const accountslogin = (props) => {
  const [regi, setRegi] = useState("login");

  /**
   * small Handler to switch between Login and Register Tab
   * @param {Boolean} data holds a Boolean to set the state regi
   */
  function handlerRegi(data) {
    setRegi(data);
  }
  return (
    <React.Fragment>
      {regi == "regi" ? (
        <Regist onTabChange={props.onTabChange} handlerRegi={handlerRegi} />
      ) : (
        ""
      )}
      {regi == "login" ? (
        <Login onTabChange={props.onTabChange} handlerRegi={handlerRegi} />
      ) : (
        ""
      )}
      {regi === "lostpw" ? (
        <LostPw onTabChange={props.onTabChange} handlerRegi={handlerRegi} />
      ) : (
        ""
      )}
    </React.Fragment>
  );
};

export default accountslogin;
