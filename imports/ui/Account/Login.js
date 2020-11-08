import React, { useState } from "react";
import { Accounts } from "meteor/accounts-base";
import { Meteor } from "meteor/meteor";

const login = (props) => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [fail, setFail] = useState(false);

  /**
   * handler that holds the Meteor Call to loginWithPassword
   * changes Tab to Account when Login Succesfull
   *
   * @param {String} user is state that should hold email adress Format
   * @param {String} password is stat that holds the user input password in clear
   */
  function onLogin() {
    Meteor.loginWithPassword(user, password, (err) => {
      if (!err) {
        setFail(false);
        props.onTabChange("account");
      } else {
        setFail(true);
      }
    });
  }

  return (
    <div className="row">
      <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
        <div className="card card-signin m-5">
          <div className="card-body">
            <h5 className="card-title text-center">Anmeldung</h5>
            <form
              className="form-signin"
              onSubmit={(event) => {
                onLogin();
                event.preventDefault();
              }}
            >
              <div className="form-label-group">
                <input
                  type="email"
                  onChange={(event) => setUser(event.target.value)}
                  id="inputEmail"
                  className="form-control"
                  placeholder="Email address"
                  required
                  autoFocus
                />
                <label htmlFor="inputEmail">Email-Address</label>
              </div>

              <div className="form-label-group">
                <input
                  type="password"
                  onChange={(event) => setPassword(event.target.value)}
                  id="inputPassword"
                  className="form-control"
                  placeholder="Password"
                  required
                />
                <label
                  onClick={() => props.handlerRegi("lostpw")}
                  htmlFor="inputPassword"
                >
                  Passwort <u>vergessen?</u>
                </label>
              </div>
              <button
                id="text"
                className="btn btn-lg btn-primary btn-block text-uppercase"
                type="submit"
              >
                Einloggen
              </button>
              {fail ? <div>Login ist Fehlgeschlagen</div> : ""}
            </form>
            <hr />
            <div className="text-muted clickable">
              Noch kein Account?
              <br />
              <div onClick={() => props.handlerRegi("regi")}>
                <u>Zur Regestrierung</u>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default login;
