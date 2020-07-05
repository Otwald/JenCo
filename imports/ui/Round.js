import React, { useState, useEffect, useRef } from "react";
import { Meteor } from "meteor/meteor";

import { getStringTime } from "./Helper";
import RoundCreate from "./RoundCreate";

const roundComponent = (props) => {
  const [round_create, setRoundCreate] = useState({
    _id: null,
    round_tb: "",
    round_name: "",
    setting: "",
    ruleset: "",
    own_char: true,
    round_gm: "Placeholder",
    round_gm_id: "",
    round_max_online_pl: 0,
    round_curr_pl: 0,
    round_max_pl: 0,
    round_desc: "",
    round_player: [],
    round_table: null,
  });
  const [edit_options_time_block, setEdit_Options_time_block] = useState([]);
  const [options_time_block, setOptions_time_block] = useState([]);
  const [rounds_box, setRounds_box] = useState([]);
  const [tableOptions, setTableOptions] = useState({});
  const [blockTab, setBlockTab] = useState(null);
  const [extendR, setExtendR] = useState("");
  const [addBlock, setAddBlock] = useState(false);
  const [gm, setGm] = useState({});
  const [player, setPlayer] = useState({});
  const [booked_tb, setBooked_tb] = useState([]);

  useEffect(() => {
    onCheck();
    return () => {
      setGm({});
      setPlayer({});
      setBooked_tb({});
      setOptions_time_block({});
    };
  }, [props.time_block, props.in_round]);

  /**
   * calls Server to build arrays freom checks if user is gm in given round, if user still cann book something in a timeblock usw
   */
  onCheck = () => {
    Meteor.call("GetRounds", (err, resp) => {
      if (!err) {
        setRounds_box(resp);
      }
    });
    Meteor.call("Check", (err, res) => {
      if (!err) {
        setGm(res.gm);
        setPlayer(res.player);
        setOptions_time_block(res.timeoptions);
        setBooked_tb(res.booked);
      }
    });
  };

  onInput = (e) => {
    let temp = round_create;
    let value = e.target.value;
    temp[e.target.name] = value;
    setRoundCreate(temp);
  };

  /**
   *  Creates Array for table choice form a given timeblock,
   * for roundcreate dropdown
   * @param String id the id of the timeblock
   * @return Array
   */
  createTableOptions = (id) => {
    setTableOptions([]);
    const block = props.time_block.filter((v) => {
      return v._id === id;
    });
    let table = [];
    for (let i = 1; i <= block[0].block_max_table; i++) {
      if (
        block[0].block_table.filter((v) => {
          return v == i;
        }).length === 0
      ) {
        table.push({ text: i, value: i });
        setTableOptions(table);
      }
    }
  };

  /**
   * loads rounds setting and adds this timeblock to the possible options of
   * timeblocks, to allow switching between them
   * @param States round /todo what is it?
   * @param Array time is array of timeblocks
   */
  onEdit = (round, time) => {
    setRoundCreate(round);
    time = props.time_block.filter((v) => {
      return v._id === time;
    });
    let temp = [...options_time_block];
    temp.push({
      text: time[0].block_name,
      value: time[0]._id,
    });
    setEdit_Options_time_block(temp);
  };

  /**
   * resets States to cancel the input of a new round
   */
  onCancel = () => {
    event.preventDefault();
    setRoundCreate({
      _id: null,
      round_tb: "",
      round_name: "Round Name",
      setting: "Setting",
      ruleset: "Rules",
      own_char: true,
      round_gm: "Placeholder",
      round_gm_id: Meteor.userId(),
      round_curr_pl: 0,
      round_max_online_pl: 0,
      round_max_pl: 5,
      round_desc: "",
      round_player: [],
      round_table: null,
    });
    setEdit_Options_time_block([]);
    setAddBlock("");
  };

  //destroys round in timeblock
  onDestroy = (data, time) => {
    Meteor.call("RoundDelete", data._id);
    props.onCallback({ key: time, value: true });
  };

  /**
   * sends Request to server to add player into player_id array
   * @param String id the id of the Round where you want to add a player
   */
  onJoin = (id) => {
    Meteor.call("RoundAddPlayer", id);
    onPlayerUpdate(id);
    onCheck();
  };

  /**
   * takes the id of an round and sends request to the server to remove player from player_ids
   * @param String id
   */
  onLeave = (id, time) => {
    props.onCallback({ key: time, value: true });
    Meteor.call("RoundRemovePlayer", id);
    onPlayerUpdate(id);
    onCheck();
  };

  /**
   * small helper to recheck after changes if player is in a round or not
   * @param String id
   */
  onPlayerUpdate = (id) => {
    Meteor.call("CheckPlayer", id, (err, res) => {
      setPlayer((prev) => {
        prev[id] = res;
        return prev;
      });
    });
  };

  /**
   * gets rounds player names to visiualize
   * @param {Array} data holds PlayerNameStrings
   * @returns {String} connected player names delimiter ","
   */
  function onPlayers(data) {
    if (data.length === 0) {
      return "";
    }
    let out = "";
    data.forEach((element) => {
      out += element + ", ";
    });
    out = out.slice(0, -2);
    return out;
  }

  /**
   * rounds over every timeblock and checks if there are still
   * tables free
   * and if the user is already booked for an table
   * if not adds the timeblock to possible options
   * @param Array block holds all possble timeblocks
   */
  timeOptions = () => {
    let temp = [];
    props.time_block.map((v) => {
      let test = v._id;
      if (booked_tb[test]) {
        console.log("test");
      }
      if (v.block_max_table < v.block_table.length) {
        return;
      }
      if (booked_tb[v._id] === true) {
        return;
      }
      temp.push({
        text: v.block_name,
        value: v._id,
      });
      setOptions_time_block(temp);
    });
  };

  blockTabControll = (id) => {
    if (blockTab !== id) {
      setBlockTab(id);
    } else {
      setBlockTab(null);
    }
  };

  onExtendRound = (k) => {
    if (k._id == extendR) {
      setExtendR("");
    } else {
      setExtendR(k._id);
    }
  };

  /**
   * takes a tableObj and returns the menu button's for it
   * to be rendered
   * @props props.user
   * @state gm
   * @param {Object} tableObj object that holds table properties
   * @param {String} time is id of the timeblock
   */
  function getTableButton(tableObj, time) {
    if (!props.user.profile.bill) {
      return "";
    }
    if (gm[tableObj._id] == true) {
      tisch = "1";
      props.onCallback({ key: time, value: false });
      out = (
        <React.Fragment>
          <button
            id="text"
            className="btn btn-outline-dark col-sm-4"
            onClick={() => {
              if (extendR != tableObj._id) {
                onExtendRound(tableObj);
              }
              this.onEdit(tableObj, time);
            }}
          >
            Ändern
          </button>
          <button
            id="text"
            className="btn btn-outline-dark col-sm-4"
            onClick={() => {
              this.onDestroy(tableObj, time);
              onExtendRound(tableObj);
            }}
          >
            Löschen
          </button>
        </React.Fragment>
      );
    } else if (player[tableObj._id] === true) {
      out = (
        <React.Fragment>
          <button
            id="text"
            className="btn btn-outline-dark col-sm-4"
            onClick={() => {
              this.onLeave(tableObj._id, time);
              onExtendRound(tableObj);
            }}
          >
            Austreten
          </button>
        </React.Fragment>
      );
    } else if (booked_tb[tableObj.round_tb] == false) {
      if (tableObj.round_curr_pl < tableObj.round_max_pl) {
        out = (
          <React.Fragment>
            <button
              id="text"
              className="btn btn-outline-dark col-sm-4"
              onClick={() => {
                this.onJoin(tableObj._id);
                onExtendRound(tableObj);
              }}
            >
              Beitreten
            </button>
          </React.Fragment>
        );
      }
    } else {
      out = "";
    }
    return out;
  }

  /**
   * serves the content of the tableObject to be rendered
   * @state extendR if set holds id of a tableobject and extends its information
   * @state round_create holds id when id same as tableobject id switches to edit
   * @props props.user
   * @param {Object} k tableObject
   * @param {String} time is the id of the TImeblock
   * @returns {JSX.Element} content
   */
  function getTableContent(k, time) {
    let out = "";
    if (Meteor.userId() && props.user) {
      out = getTableButton(k, time);
    }
    let content = (
      <div className="row">
        <div className="col-sm-2">
          {/*TODO place for the Icon */}
          <div className="text-center">
            <strong>{k.round_table}</strong>
          </div>
        </div>
        <div className="col-sm-10">
          <div className="text-left round text-break">
            <div className="roundZoom" onClick={() => onExtendRound(k)}>
              <div className="row">
                <label className="col-sm-4">Runden Name</label>
                <div className="col-sm-8 text-muted">{k.round_name}</div>
              </div>
              {extendR != k._id ? (
                ""
              ) : (
                <React.Fragment>
                  <div className="row text-left">
                    <label className="col-sm-4">Spielleiter</label>
                    <div className="col-sm-8 text-muted">{k.round_gm}</div>
                  </div>
                </React.Fragment>
              )}
              <div className="row">
                <label className="col-sm-4">Setting</label>
                <div className="col-sm-8 text-muted">{k.setting}</div>
              </div>
              <div className="row">
                <label className="col-sm-4">Regelwerk</label>
                <div className="col-sm-8 text-muted">{k.ruleset}</div>
              </div>
              {extendR != k._id ? (
                <React.Fragment>
                  <div className="row">
                    <label className="col-sm-4">Spieler</label>
                    <div className="col-sm-8 text-muted">
                      {k.round_curr_pl}/{k.round_max_online_pl}
                    </div>
                  </div>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div className="row text-left">
                    <label className="col-sm-4">maximale Spieler</label>
                    <div className="col-sm-8 text-muted">{k.round_max_pl}</div>
                  </div>
                  <div className="row text-left">
                    <label className="col-sm-4">maximale OnlineAnmeldung</label>
                    <div className="col-sm-8 text-muted">
                      {k.round_max_online_pl}
                    </div>
                  </div>
                  <div className="row">
                    <label className="col-sm-4">Teilnehmer</label>
                    <div className="col-sm-8 text-muted">
                      {onPlayers(k.round_player)}
                    </div>
                  </div>
                  <div className="row text-left">
                    <label className="col-sm-4">Vorgefertigte Charaktere</label>
                    <div className="col-sm-8 text-muted">
                      {JSON.parse(k.own_char) ? "Ja" : "Nein"}
                    </div>
                  </div>
                  <div className="row text-left">
                    <label className="col-sm-4">Rundenbeschreibung</label>
                    <div
                      className="col-sm-8 text-muted"
                      dangerouslySetInnerHTML={{ __html: k.round_desc }}
                    ></div>
                  </div>
                </React.Fragment>
              )}
            </div>
            {extendR != k._id ? (
              <React.Fragment>
                <div
                  className="row justify-content-center"
                  onClick={() => onExtendRound(k)}
                >
                  <i className="maximize_icon"></i>
                  {out}
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div
                  className="row justify-content-start"
                  onClick={() => onExtendRound(k)}
                >
                  <i className="minimize_icon"></i>
                  {out}
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    );
    if (round_create._id === k._id) {
      content = (
        <RoundCreate
          round_create={round_create}
          time_block={edit_options_time_block}
          onInput={this.onInput}
          createTableOptions={createTableOptions}
          tableOptions={tableOptions}
          onCancel={this.onCancel}
        />
      );
    }
    return content;
  }

  /**
   * visualizes the rounds in a timeblock
   * @param {String} time id of the Timeblock
   */
  timeBlockCreate = (time) => {
    let roundtemplate = "";
    if (rounds_box.length !== 0) {
      roundtemplate = rounds_box.map((k, v) => {
        if (k.round_tb === time) {
          content = getTableContent(k, time);
          return (
            <div className="col-sm-6" key={v}>
              {content}
            </div>
          );
        }
      });
    }
    return roundtemplate;
  };

  /**
   * creates Div for the Timeblock rendering
   * and populates it with content
   */
  function getTimeBlockContent() {
    let tb = "";
    if (props.time_block.length > 0) {
      props.time_block.sort(function (a, b) {
        if (a.block_start < b.block_start) {
          return -1;
        }
        if (a.block_start > b.block_start) {
          return +1;
        }
        return 0;
      });
      tb = props.time_block.map((k) => {
        if (!k.block_table) {
          return;
        }
        let round = "";
        round = this.timeBlockCreate(k._id);
        return (
          <div className="row" key={k._id}>
            <div className="col-sm time_block_container">
              <div
                className="row list-group-item time_block"
                onClick={() => blockTabControll(k._id)}
                id="time_block"
              >
                <h4 className="text-center">
                  <strong>{k.block_name}</strong>
                </h4>
                <p className="text-center">
                  <span className="col-sm-3">
                    <strong>Start:</strong>
                    {getStringTime(k.block_start)}
                  </span>
                  <span className="col-sm-3">
                    <strong>Ende:</strong>
                    {getStringTime(k.block_end)}
                  </span>
                  <span className="col-sm-3">
                    <strong>Tisch:</strong>
                    {k.block_table.length}/{k.block_max_table}
                  </span>
                </p>
                {/* <h4 className="col-sm-4">{k.block_name}</h4>
                            <p>
                                <div className='col-sm-3'>
                                    <label className='time_block'>Tische</label> <a className='text-muted' >{k.block_table.length}/{k.block_max_table}</a>
                                </div>
                            </p> */}
              </div>
              {blockTab === k._id ? <div className="row">{round}</div> : ""}
              <div className="row justify-content-center">
                {blockTab === k._id ? (
                  <i className="arrow_up_circle"></i>
                ) : (
                  <i className="arrow_down_circle"></i>
                )}
              </div>
            </div>
          </div>
        );
      });
    }
    return tb;
  }

  let tb = ""; // timbeblock
  let rc = ""; //round create
  if (extendR) {
    tableObj = rounds_box.filter(function (v) {
      return v._id == extendR;
    })[0];
    tb = getTableContent(tableObj, tableObj.round_tb);
  } else {
    tb = getTimeBlockContent();
    if (props.user) {
      if (
        props.user.profile.bill &&
        props.user.profile.profil &&
        options_time_block.length > 0
      ) {
        if (addBlock === true) {
          rc = (
            <RoundCreate
              round_create={round_create}
              time_block={options_time_block}
              onInput={this.onInput}
              createTableOptions={createTableOptions}
              tableOptions={tableOptions}
              onCancel={this.onCancel}
            />
          );
        } else {
          rc = (
            <div className="row justify-content-center">
              <button
                id="text"
                className="btn btn-outline-dark col-sm-4"
                onClick={() => setAddBlock(!addBlock)}
              >
                Neue Runde Hinzufügen
              </button>
            </div>
          );
        }
      }
    }
  }
  return (
    <React.Fragment>
      {tb}
      <div className="welcome">{rc}</div>
    </React.Fragment>
  );
};

export default roundComponent;
