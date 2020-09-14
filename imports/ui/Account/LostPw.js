import React, { useState } from "react";
import { Accounts } from "meteor/accounts-base";
import { Meteor } from "meteor/meteor";

const lostpw = (props) => {
  const [user, setUser] = useState("");
  const [fail, setFail] = useState(false);
  const [error, setError] = useState("");

  /**
   * sendes an Request to the Server to add a new User
   * Password will be Encrypted from the Accounts package,
   * user will be added to the users Collection
   *
   * @param {String} user is the users state and should be filled with a string in the email format
   * @param {String} password is state should hold the password with at least 6 character
   * @param {String} confirmpassword is a state that holds the password with at least 6 charakter is used to confirm the password
   */
  function onRecover() {
    Accounts.forgotPassword(
      {
        email: user,
      },
      (err) => {
        if (!err) {
          setFail(true);
          console.log(err);
          // setFail(false);
          // Meteor.call("sendEmail", user);
          // props.onTabChange("account");
        } else {
          setFail(true);
          console.log(err);
          //     setFail(true);
          //     setError("Nutzer schon vorhanden");
        }
      }
    );
    // Meteor.call("sendRecovermail" , user);
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
                  onSubmit={() => {
                    onRecover();
                    event.preventDefault();
                  }}
                >
                  <div className="form-label-group">
                    <input
                      type="email"
                      onChange={() => setUser(event.target.value)}
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
