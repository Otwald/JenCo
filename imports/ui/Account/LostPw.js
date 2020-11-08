import React, { useState } from "react";
import { Accounts } from "meteor/accounts-base";
import { Meteor } from "meteor/meteor";

const lostpw = (props) => {
  const [user, setUser] = useState("");
  const [fail, setFail] = useState(false);
  const [error, setError] = useState("");

  /**
   * uses the Accounts package to handle sending the Email and Reseting Password
   * a Templete must be set in server/main.js
   *
   * @param {String} user is the users state and should be filled with a string in the email format
   */
  function onRecover() {
    Accounts.forgotPassword(
      {
        email: user,
      },
      (err) => {
        setFail(true);
      }
    );
  }

  return (
    <div className="row">
      <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
        <div className="card card-signin my-5">
          <div className="card-body">
            {fail ? (
              <React.Fragment>
                <h5 className="card-title text-center">Email versendet</h5>
                <div className="text-muted">
                  Falls ein Account mit dieser Email {user} gefunden wurde.
                </div>
                <hr />
                <div className="text-muted">
                  <div onClick={() => props.handlerRegi("login")}>
                    <u>Zurück</u> zur Anmeldung
                  </div>
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <h5 className="card-title text-center">
                  Passwort Wiederherstellung
                </h5>
                <form
                  className="form-signin"
                  onSubmit={(event) => {
                    onRecover();
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
                  <button
                    id="text"
                    className="btn btn-lg btn-primary btn-block text-uppercase"
                    type="submit"
                  >
                    Email Senden
                  </button>
                </form>
                <hr />
                <div className="text-muted">
                  <div onClick={() => props.handlerRegi("login")}>
                    <u>Zurück</u> zur Anmeldung
                  </div>
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default lostpw;
