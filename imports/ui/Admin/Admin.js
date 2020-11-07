import React, { useState, useEffect } from "react";

import AdminBlock from "./AdminBlock";
import Settings from "./AdminSettings";
import UserCenter from "./AdminUserCenter";

const admin = (props) => {
  // capache abfragen für anmeldung

  // mail mit konto info beim account erstellen,
  const [eventTab, setEventTab] = useState(false);
  const [userTab, setUserTab] = useState(false);
  const [tbTab, setTbTab] = useState(false);

  useEffect(() => {
    return () => {};
  }, [props.event]);

  onTabChange = (e) => {
    let temp = activeTab;
    temp[e] = !temp[e];
    setActivTab(Object.assign(temp));
  };

  return (
    <div className="welcome">
      <div className="row">
        <div
          className="col-sm-3"
          onClick={() => {
            setUserTab(!userTab);
          }}
        >
          Nutzerverwaltung
        </div>
        {userTab ? <UserCenter props={props} /> : ""}
      </div>
      <div className="row">
        <div className="col-sm-3" onClick={() => setEventTab(!eventTab)}>
          Eventsettings
        </div>
        {eventTab ? <Settings event={props.event} users={props.users} /> : ""}
      </div>
      <div className="row">
        {/* Reminder beim Intialiseren ein Default Datum oder Exception abgreifen */}
        <div className="col-sm-3" onClick={() => setTbTab(!tbTab)}>
          {" "}
          ZeitBlock Einstellungen
        </div>
        {tbTab ? (
          <AdminBlock event={props.event} timeblock={props.timeblock} />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default admin;
