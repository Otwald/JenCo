import React, { useState, useEffect } from "react";

import useDate from "../Helper";

const settings = (props) => {
  const [eventEdit, setEventEdit] = useState(false);
  const [eventPay, setEventPay] = useState(0);
  const [e_start, setStart] = useState("");
  const [e_end, setEnd] = useState("");
  const [e_loc, setLoc] = useState("");
  const [t_price, setTicketPrice] = useState(0);
  const [e_price, setEventPrice] = useState(0);

  useEffect(() => {
    if (props.event) {
      setStart(props.event.e_start);
      setEnd(props.event.e_end);
      setLoc(props.event.e_loc);
      setTicketPrice(props.event.t_price);
      setEventPrice(props.event.e_price);
    }
    if (props.users) {
      let money = 0;
      props.users.map((v) => {
        if (v.bill) {
          money = money + parseInt(props.t_price);
          setEventPay(money);
        }
      });
    }
    return () => {
      setStart("");
      setEnd("");
      setLoc("");
      setTicketPrice(0);
      setEventPrice(0);
    };
  }, [props.event, props.users]);

  /**
   * saves state.setting to mongo
   */
  function onSave() {
    let settings = {
      e_end: e_end,
      e_loc: e_loc,
      e_start: e_start,
      t_price: Number(t_price),
      e_price: Number(e_price),
    };
    if (props.event) {
      settings._id = props.event._id;
      Meteor.call("EventUpdate", settings);
    } else {
      Meteor.call("EventCreate", settings);
    }
    setEventEdit(false);
  }

  return (
    <div className="col-sm-9">
      {eventEdit ? (
        <form className="was-validated">
          <div className="form-row">
            <div className="input-group mb-3">
              <span className="input-group-prepend input-group-text col-sm-3">
                Event Start
              </span>
              <input
                required
                className="form-control"
                type="date"
                name="e_start"
                onChange={(event) => setStart(event.target.value)}
                value={useDate(e_start)}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="input-group mb-3">
              <span className="input-group-prepend input-group-text col-sm-3">
                Event End
              </span>
              <input
                required
                className="form-control"
                type="date"
                name="e_end"
                onChange={(event) => setEnd(event.target.value)}
                value={useDate(e_end)}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="input-group mb-3">
              <span className="input-group-prepend input-group-text col-sm-3">
                Event Location
              </span>
              <input
                required
                className="form-control"
                type="text"
                name="e_loc"
                onChange={(event) => setLoc(event.target.value)}
                value={e_loc}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="input-group mb-3">
              <span className="input-group-prepend input-group-text col-sm-3">
                Teilnahme Preis
              </span>
              <input
                required
                min="0"
                className="form-control"
                type="number"
                name="t_price"
                onChange={(event) => setTicketPrice(event.target.value)}
                value={t_price}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="input-group mb-3">
              <span className="input-group-prepend input-group-text col-sm-3">
                Event Kosten
              </span>
              <input
                required
                min="0"
                className="form-control"
                type="number"
                name="e_price"
                onChange={(event) => setEventPrice(event.target.value)}
                value={e_price}
              />
            </div>
          </div>
          <div className="row justify-content-center">
            <button
              className="btn btn-outline-dark col-sm-4"
              onClick={() => {
                setEventEdit(false);
                preventDefault();
              }}
            >
              Abbrechen
            </button>
            <button className="btn btn-outline-dark col-sm-4" onClick={onSave}>
              Speichern
            </button>
          </div>
        </form>
      ) : (
        <div className="text-left">
          <div className="row">
            <label className="col-sm-4">Event Start</label>
            <div className="col-sm-8 text-muted">{e_start}</div>
          </div>
          <div className="row">
            <label className="col-sm-4">Event End</label>
            <div className="text-muted col-sm-8">{e_end}</div>
          </div>
          <div className="row">
            <label className="col-sm-4">Event Location</label>
            <div className="text-muted col-sm-8">{e_loc}</div>
          </div>
          <div className="row">
            <label className="col-sm-4">Teilnahme Preis</label>
            <div className="text-muted col-sm-8">{t_price}</div>
          </div>
          <div className="row">
            <label className="col-sm-4">Event Kosten</label>
            <div className="text-muted col-sm-8">{e_price} </div>
          </div>
          <div className="row">
            <label className="col-sm-4">Event Rechnung</label>
            <div className="text-muted col-sm-8">
              {(eventPay / e_price) * 100}% bezahlt
            </div>
          </div>
          <div className="row justify-content-center">
            <button
              className="btn btn-outline-dark col-sm-5"
              onClick={() => setEventEdit(true)}
            >
              Edit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default settings;
