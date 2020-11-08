import React, { useState, useEffect } from "react";

const adminblockform = (props) => {
  const [time, setTime] = useState({
    start: null,
    end: null,
  });
  const [date, setDate] = useState({
    start: null,
    end: null,
  });
  const [phTime, setPhTime] = useState({
    start: "Start",
    end: "Ende",
  });
  const [showdp_start, setShowdp_start] = useState("");
  const [showdp_end, setShowdp_end] = useState("");
  const [clock_end, setClock_end] = useState("00:00");
  const [clock_start, setClock_start] = useState("00:00");
  const [name, setName] = useState("");
  const [table_number, setTable_number] = useState(0);
  const [pnp, setPnp] = useState(false);

  useEffect(() => {
    if (props.block) {
      setName(props.block.block_name);
      setPhTime({
        start: props.getStringDate(props.block.block_start),
        end: props.getStringDate(props.block.block_end),
      });
      setTable_number(props.block.block_max_table);
      setClock_start(props.getStringClock(props.block.block_start));
      setClock_end(props.getStringClock(props.block.block_end));
      setDate({
        start:
          props.block.block_start -
          onTimeInput(props.getStringClock(props.block.block_start)),
        end:
          props.block.block_end -
          onTimeInput(props.getStringClock(props.block.block_end)),
      });
      setPnp(props.block.block_pnp);
    }
  }, [props.block]);

  /**
   * reads all states into one json to hand them over to the server
   * and add the new timeblock to the db
   * checks if name empty and a times exist
   */
  onBlockSave = (event) => {
    let temp = {
      block_name: name,
      block_pnp: pnp,
      block_max_table: Number(table_number),
    };
    event.preventDefault();
    if (temp.block_name.length < 1) {
      return;
    }
    if (date.start === null || date.end === null) {
      return;
    }
    temp.block_start = date.start + onTimeInput(clock_start);
    temp.block_end = date.end + onTimeInput(clock_end);
    if (temp.block_start > temp.block_end) {
      return;
    }
    if (props.block) {
      temp._id = props.block._id;
      Meteor.call("BlockUpdate", temp);
    } else {
      Meteor.call("BlockCreate", temp);
    }
    props.onCancelButton();
  };

  /**
   * Builds an Array of valid Dates from the Event, to Build the Event Timetable
   * takes Dates in Form of TimeStamps
   *
   * @param Number start
   * @param Number end
   */
  inBetweenTime = (start, end) => {
    const week = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
    start = new Date(start).getTime();
    end = new Date(end).getTime();
    let out = [];
    let temp = new Date();
    for (let i = start; i <= end; ) {
      temp = new Date(i);
      let text =
        week[temp.getDay()] +
        " " +
        temp.getDate() +
        "." +
        (temp.getMonth() + 1);
      out.push({ value: i, text: text });
      i = i + 60 * 60 * 24 * 1000;
    }
    return out;
  };

  /**
   * takes clock times to convert them into timestamp
   *
   * @param String data , holds the clock in format 00:00
   * @return Numbe holds timestamp
   */
  onTimeInput = (data) => {
    let time = "1970-01-01T" + data + "Z";
    let date = new Date(time);
    return date.getTime() - 1000 * 60 * 60 * 2;
  };
  return (
    <div className="row justify-content-center">
      <form className="col-sm-7 was-validated">
        <div className="form-row">
          <div className="input-group mb-3">
            <span className="input-group-prepend input-group-text col-sm-3">
              Name
            </span>
            <input
              required
              minLength="2"
              maxLength="32"
              className="form-control"
              type="text"
              name="block_name"
              onChange={() => setName(event.target.value)}
              placeholder="Hier Namen einfügen"
              value={name}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="input-group mb-3">
            <button
              id="text"
              className="btn btn-outline-secondary dropdown-toggle col-sm-3"
              data-toggle="dropdown"
              onClick={() =>
                setShowdp_start((prev) => {
                  if (prev.length > 0) {
                    return "";
                  }
                  return " show";
                })
              }
              type="button"
            >
              {phTime.start}
            </button>
            <div className={"dropdown-menu" + showdp_start}>
              {inBetweenTime(props.event.e_start, props.event.e_end).map(
                (v) => {
                  return (
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={() => {
                        setShowdp_start("");
                        setDate((prev) => {
                          prev.start = Number(v.value);
                          return prev;
                        });
                        setPhTime((prev) => {
                          prev.start = v.text;
                          return prev;
                        });
                      }}
                      key={v.value}
                    >
                      {v.text}
                    </a>
                  );
                }
              )}
            </div>
            <input
              required
              className="form-control"
              type="time"
              name="start"
              onChange={() => setClock_start(event.target.value)}
              value={clock_start}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="input-group mb-3">
            <button
              id="text"
              className="btn btn-outline-secondary dropdown-toggle col-sm-3"
              data-toggle="dropdown"
              onClick={() =>
                setShowdp_end((prev) => {
                  if (prev.length > 0) {
                    return "";
                  }
                  return " show";
                })
              }
              type="button"
            >
              {phTime.end}
            </button>
            <div className={"dropdown-menu" + showdp_end}>
              {inBetweenTime(props.event.e_start, props.event.e_end).map(
                (v) => {
                  return (
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={() => {
                        setShowdp_end("");
                        setDate((prev) => {
                          prev.end = Number(v.value);
                          return prev;
                        });
                        setPhTime((prev) => {
                          prev.end = v.text;
                          return prev;
                        });
                      }}
                      key={v.value}
                    >
                      {v.text}
                    </a>
                  );
                }
              )}
            </div>
            <input
              className="form-control"
              type="time"
              name="end"
              onChange={() => setClock_end(event.target.value)}
              value={clock_end}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="input-group mb3">
            <span className="input-group-prepend input-group-text col-sm-3">
              Tisch Anzahl
            </span>
            <input
              required
              min="0"
              className="form-control"
              type="number"
              name="block_max_table"
              onChange={() => setTable_number(Number(event.target.value))}
              value={table_number}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="input-group mb3">
            <span className="input-group-prepend input-group-text col-sm-3">
              Spielblock
            </span>
            <input
              className="form-control col-sm-1"
              type="checkbox"
              name="block_pnp"
              checked={pnp}
              onChange={() => setPnp(!pnp)}
            />
          </div>
        </div>
        <div className="form-row justify-content-center">
          <button
            id="text"
            className="btn btn-outline-dark col-sm-4"
            onClick={props.onCancelButton}
          >
            Abbrechen
          </button>
          <button
            id="text"
            className="btn btn-outline-dark col-sm-4"
            onClick={this.onBlockSave}
          >
            Speichern
          </button>
        </div>
      </form>
    </div>
  );
};

export default adminblockform;
