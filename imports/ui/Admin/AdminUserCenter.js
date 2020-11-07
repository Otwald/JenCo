import React, { useState, useEffect } from "react";

const usercenter = (props) => {
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [agefilter, setAgefilter] = useState(false);
  const [payfilter, setPayfilter] = useState(false);
  const [deleteUser, setDeleteUser] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    onSwitch();
    return () => {};
  });

  /**
   * calls MeteorServer to updatew the users List State
   */
  function onSwitch() {
    Meteor.call("getUsers", (err, resp) => {
      if (!err) {
        setUsers(resp);
      }
    });
  }

  /**
   * just translats booleans to words
   * @param {boolean} data
   */
  function outPay(data) {
    if (data) {
      return "hat bezahlt";
    } else {
      return "nicht bezahlt";
    }
  }

  /**
   * Makes Call to Backend to send Async a Conformatio Email
   * @param {JSON} data
   */
  function onClickUserConfirm(data) {
    Meteor.call("sendConfirm", data.profile.email, (err, res) => {
      setEmail("send");
    });
  }

  /**
   * Makes 2 Calls to the Server
   * Removes the User and Archives it into the users_archive collection
   * @param {JSON} data holds the local user data
   */
  function onClickUserDestroy(data) {
    Meteor.call("UserArchiveCreate", data._id);
    Meteor.call("AccountDeleteAdmin", data._id);
    onSwitch();
  }

  /**
   * handles the click event on the user managment table,
   * and saves user id in a state
   * @param Object data holds db Entry to user
   */
  mouseIn = (data) => {
    if (activeUser !== data._id) {
      setActiveUser(data._id);
    } else {
      setActiveUser(null);
      setEmail("");
    }
  };

  /**
   * small helper to convert timestamp age into
   * age in years with the event as the measurement
   *
   * @param Number timestamp holds the age in Timestamp format
   * @return Number Age
   */
  calcAge = (timestamp) => {
    if (props.event) {
      event_start = new Date(props.event.e_start);
      age = event_start.getTime() - timestamp;
      age = new Date(age);
      age = age.getFullYear() - 1970;
      return age;
    }
    return 0;
  };

  let user_block = "";
  let userMan = "";
  if (users.length > 0) {
    users.sort((a, b) =>
      a.profile.last > b.profile.last
        ? 1
        : b.profile.last > a.profile.last
        ? -1
        : 0
    );
    user_block = users.map((key, value) => {
      let age = calcAge(key.profile.age);
      if (agefilter === true) {
        if (age > 16) {
          return;
        }
      }
      if (payfilter === true) {
        if (key.profile.bill === true) {
          return;
        }
      }
      return (
        <tr
          onClick={() => {
            this.mouseIn(key);
            setDeleteUser("");
          }}
          key={"Table" + value}
        >
          <th scope="row">{value + 1}</th>
          <th>{key.profile.last}</th>
          <th>{outPay(key.profile.bill)}</th>
          <th>{age}</th>
        </tr>
      );
    });
    if (users) {
      userMan = users.map((value, index) => {
        return (
          <React.Fragment key={"User" + index}>
            {value._id == activeUser ? (
              <div className="card col-sm-8">
                <div className="card-body">
                  <div className="row">
                    <label className="col-sm-4">
                      <strong>Profil Name</strong>
                    </label>
                    <div className="col-sm-8 text-muted">
                      {value.profile.profil}
                    </div>
                  </div>
                  <div className="row">
                    <label className="col-sm-4">
                      <strong>Vorname</strong>
                    </label>
                    <div className="col-sm-8 text-muted">
                      {value.profile.first}
                    </div>
                  </div>
                  <div className="row">
                    <label className="col-sm-4">
                      <strong>Nachname</strong>
                    </label>
                    <div className="col-sm-8 text-muted">
                      {value.profile.last}
                    </div>
                  </div>
                  <div className="row">
                    <label className="col-sm-4">
                      <strong>Alter</strong>
                    </label>
                    <div className="col-sm-8 text-muted">
                      {new Date(value.profile.age).toDateString()}
                    </div>
                  </div>
                  <div className="row">
                    <label className="col-sm-4">
                      <strong>Status</strong>
                    </label>
                    <div className="col-sm-8 text-muted">
                      {value.profile.bill ? "Ja" : "Nein"}
                    </div>
                  </div>
                  <div className="row">
                    <label className="col-sm-4">
                      <strong>E-Mail</strong>
                    </label>
                    <div className="col-sm-8 text-muted">
                      {value.profile.email}
                    </div>
                  </div>
                  <div className="row justify-content-center">
                    <button
                      id="text"
                      className="btn btn-outline-dark col-sm-4"
                      onClick={(e) => {
                        Meteor.call("SwitchBill", value._id);
                        onSwitch();
                      }}
                    >
                      Wechsel Bezahlstatus
                    </button>
                    {email == "" ? (
                      <button
                        id="text"
                        className="btn btn-outline-dark col-sm-4"
                        onClick={(e) => {
                          onClickUserConfirm(value);
                          setEmail("sending");
                        }}
                      >
                        BestätigungsEmail
                      </button>
                    ) : (
                      ""
                    )}
                    {email == "sending" ? (
                      <button
                        id="text"
                        className="btn btn-outline-dark col-sm-4"
                      >
                        Sende Email ...
                      </button>
                    ) : (
                      ""
                    )}
                    {email == "send" ? (
                      <button
                        id="text"
                        className="btn btn-outline-dark col-sm-4"
                      >
                        Email gesendet!
                      </button>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="row justify-content-center">
                    <button
                      id="text"
                      className="btn btn-outline-dark col-sm-4"
                      onClick={() => setDeleteUser(value._id)}
                    >
                      Nutzer löschen
                    </button>
                    {deleteUser == value._id ? (
                      <React.Fragment>
                        <button
                          id="text"
                          className="btn btn-outline-dark col-sm-4"
                          onClick={() => setDeleteUser("")}
                        >
                          Abbruch
                        </button>
                        <button
                          id="text"
                          className="btn btn-outline-dark col-sm-4"
                          onClick={(e) => onClickUserDestroy(value)}
                        >
                          Wirklich Löschen?
                        </button>
                      </React.Fragment>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
          </React.Fragment>
        );
      });
    }
  }
  return (
    <div className="col-sm-9">
      <div className="table-responsive-sm">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Nachname</th>
              <th scope="col" onClick={() => setPayfilter(!payfilter)}>
                Status
                <p className="text-muted">
                  {payfilter ? "nicht bezahlt" : "Alle"}
                </p>
              </th>
              <th scope="col" onClick={() => setAgefilter(!agefilter)}>
                Alter
                <p className="text-muted">{agefilter ? "Jung" : "Alle"}</p>
              </th>
            </tr>
          </thead>
          <tbody>{user_block}</tbody>
        </table>
      </div>
      <div className="row justify-content-center">{userMan}</div>
    </div>
  );
};

export default usercenter;
