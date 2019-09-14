import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Email } from 'meteor/email';

import './../imports/api/mongo_export';
import { event_settings, timeblock, Rounds, users_archive, users_account, Admin } from './../imports/api/mongo_export';

Meteor.startup(() => {
  console.log('Restart');
  // for initial Setup Creating one Empty Event Entry
  // let cursor = event_settings.findOne();
  // if (!cursor) {
  //   event_settings.insert({
  //     e_start: null,
  //     e_end: null,
  //     e_loc: null,
  //     tb: [],
  //     table: null,
  //     price: null,
  //   });
  // }
});

MethodWrapper = (func) => {
  try {
    func()
  }
  catch (err) {
    console.log(err)
  }
}

/**
 * a handel to update the timeblocks, to hold the id and the used table from given new rounds in there scope
 * @param Object new_data holds the Information of the new round
 * @param Object old_data holds the old Information of the Round
 */
timeblock_update = (new_data = {}, old_data = {}) => {
  if (Object.keys(old_data).length > 0) {
    let old_tb = timeblock.findOne({ _id: old_data.round_tb });
    if (old_tb) {
      let filter_block_table = old_tb.block_table.filter((item) => item != old_data.round_table);
      let filter_block_table_id = old_tb.block_table_id.filter((item) => item != old_data._id);
      timeblock.update({ _id: old_tb._id }, { $set: { "block_table": filter_block_table, 'block_table_id': filter_block_table_id } });
    }
  }
  if (Object.keys(new_data).length > 0) {
    let new_tb = timeblock.findOne({ _id: new_data.round_tb });
    new_tb.block_table.push(new_data.round_table)
    new_tb.block_table_id.push(new_data._id)
    timeblock.update({ _id: new_tb._id }, { $set: { "block_table": new_tb.block_table, 'block_table_id': new_tb.block_table_id } });
  }
}

/**
 * small handler to check if this User is an Admin
 * @param {String} userId a string that holds the ID
 * @return {Boolean} admin true or false
 */
function handlerAdmin(userId) {
  if (Admin.findOne({ '_id': userId })) {
    return true;
  }
  return false;
}
if (Meteor.settings.private) {
  process.env.MAIL_URL = Meteor.settings.private.MAIL_URL;
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = Meteor.settings.private.NODE_TLS_REJECT_UNAUTHORIZED;
}

//todo: log send emails
// Server: Define a method that the client can call.
Meteor.methods({
  /**
   * fetches a cursoer of all users, and builds an array
   * @return {Array}({'_id' : String , 'profile': {'profil' : String, 'first' : String, 'last' : String, 'age' : Number, 'email':String}}, {...} )
   */
  getUsers() {
    try {
      let out = []
      if (handlerAdmin(this.userId) == true) {
        const cursor = Meteor.users.find({});
        cursor.forEach(element => {
          element.profile.email = element.emails[0].address
          out.push({ "_id": element._id, "profile": element.profile })
        });
      }
      return out;
    }
    catch (err) {
      console.log(err);
    }
  },
  sendEmail(to) {
    const from = 'papierkrieger-jena@web.de'
    const subject = 'Hello from Meteor!'
    const text = 'This is a test of Email.send.'
    // Make sure that all arguments are strings.
    // check([to, from, subject, text], [String]);

    // Let other method calls from the same client start running, without
    // waiting for the email sending to complete.
    this.unblock();

    if (Email.send({ to: to, from: from, subject: subject, text: text })) {
      console.log('true')
    } else {
      console.log('false')
    }
  },

  //todo: getting decorators to work
  BlockCreate(data) {
    try {
      check(data, {
        block_name: String,
        block_pnp: Boolean,
        block_start: Number,
        block_end: Number,
        block_max_table: Number
      })
      data.block_table = [];
      data.block_table_id = [];
      if (handlerAdmin) {
        timeblock.insert(data);
      }
    }
    catch (er) {
      console.log(er);
    }

  },
  BlockUpdate(data) {
    try {
      check(data, {
        _id: String,
        block_name: String,
        block_pnp: Boolean,
        block_start: Number,
        block_end: Number,
        block_max_table: Number
      })
      if (handlerAdmin(this.userId) == true) {
        timeblock.update({ _id: data._id },
          {
            $set: {
              block_name: data.block_name,
              block_pnp: data.block_pnp,
              block_start: data.block_start,
              block_end: data.block_end,
              block_max_table: data.block_max_table
            }
          })
      }
    }
    catch (err) {
      console.log(err)
    }
  },
  BlockDelete(id) {
    try {
      check(id, String);
      if (handlerAdmin(this.userId) == true) {
        timeblock.remove({ _id: id });
      }
    }
    catch (err) {
      console.log(err);
    }
  },
  RoundCreate(data) {
    check(data, {
      round_tb: String,
      round_name: String,
      setting: String,
      ruleset: String,
      own_char: Boolean,
      round_max_online_pl: Number,
      round_max_pl: Number,
      round_desc: String,
      round_table: Number
    })
    data.round_gm_id = this.userId;
    users_account.findOne({ '_id': this.userId });
    data.round_player_id = [];
    data.round_curr_pl = 0;
    Rounds.insert(data);
    let table = Rounds.findOne(data, { transform: null });
    timeblock_update(new_tb = table);
  },
  RoundUpdate(data) {
    check(data, {
      _id: String,
      round_tb: String,
      round_name: String,
      setting: String,
      ruleset: String,
      own_char: Boolean,
      round_max_online_pl: Number,
      round_max_pl: Number,
      round_desc: String,
      round_table: Number,
    })
    let round = Rounds.findOne({ _id: data._id }, { transform: null })
    if (round.round_gm_id === this.userId) {
      timeblock_update(data, round);
      Rounds.update({ _id: data._id },
        {
          $set: {
            round_tb: data.round_tb,
            round_name: data.round_name,
            setting: data.setting,
            ruleset: data.ruleset,
            own_char: data.own_char,
            round_max_online_pl: data.round_max_online_pl,
            round_max_pl: data.round_max_pl,
            round_desc: data.round_desc,
            round_table: data.round_table,

          }
        }
      )
    }
  },
  RoundDelete(id) {
    check(id, String);
    let table = Rounds.findOne({ _id: id }, { transform: null });
    if (table) {
      if (table.round_gm_id == this.userId) {
        Rounds.remove({ _id: id });
        // let block = timeblock.findOne({ _id: table.round_tb })
        // block.block_table.map((v, i) => {
        //   if (v === table.round_table) {
        //     block.block_table.splice(i, 1)
        //   }
        // })
        timeblock_update({}, old_data = table);
        // timeblock.update({ _id: block._id }, { $set: { "block_table": block.block_table } })
      }
    }
  },
  RoundAddPlayer(id) {
    try {
      check(id, String);
      let table = Rounds.findOne({ _id: id }, { transform: null });
      if (table) {
        let check_player = table.round_player_id.filter(id => id == this.userId);
        if (check_player.length == 0) {
          table.round_player_id.push(this.userId);
          table.round_curr_pl++
          Rounds.update({ _id: id }, {
            $set: {
              'round_player_id': table.round_player_id,
              'round_curr_pl': table.round_curr_pl
            }
          })
        }
      }
    }
    catch (err) {
    }
  },
  RoundRemovePlayer(id) {
    try {
      check(id, String);
      let table = Rounds.findOne({ _id: id }, { transform: null });
      if (table) {
        let check_player = table.round_player_id.filter(id => id != this.userId);
        table.round_curr_pl--
        Rounds.update({ _id: id }, {
          $set: {
            'round_player_id': check_player,
            'round_curr_pl': table.round_curr_pl
          }
        })
      }
    }
    catch (err) {
      console.log(err);
    }
  },
  AccountCreate(data) {
    check(data, {
      profil: String,
      first: String,
      last: String,
      age: Number
    })
    data._id = this.userId
    data.bill = false;
    users_account.insert(data);
  },
  AccountUpdate(data) {
    check(data, {
      profil: String,
      first: String,
      last: String,
      age: Number
    })
    users_account.update({ _id: this.userId }, {
      $set: {
        "first": data.first, "last": data.last, "profil": data.profil, "age": data.age
      }
    });
  },
  AccountDelete() {
    if (handlerAdmin(this.userId) == true) {
      users_account.remove({ _id: this.userId });
    }
  },
  UserArchiveCreate(data) {
    users_archive.insert(data);
  },
  /**
   * changes in the users collection the profile.bill boolean
   * @param {String} data holds a user id
   */
  SwitchBill(data) {
    if (handlerAdmin(this.userId) == true) {
      let user = Meteor.users.findOne({ _id: data });
      let temp = user.profile
      temp.bill = !user.profile.bill
      Meteor.users.update({ _id: data }, {
        $set: {
          "profile": temp
        }
      });
    }
  },
  EventCreate(data) {
    if (handlerAdmin(this.userId) == true) {
      event_settings.insert(data);
    }
  },
  EventUpdate(data) {
    if (handlerAdmin(this.userId) == true) {
      event_settings.update({ _id: data._id }, data);
    }
  },
  Check() {
    let gm = {};
    let player = {};
    let timeoptions = [];
    let booked = {}
    try {
      let blocks = timeblock.find({ 'block_pnp': true });
      blocks.map((tb) => {
        checkrounds = tb.block_table_id.map((value) => {
          let round = Rounds.findOne({ '_id': value }, { transform: null });
          if (round) {
            if (round.round_gm_id == this.userId) {
              gm[value] = true;
              booked[tb._id] = true;
            }
            else {
              gm[value] = false;
            }
            if (round.round_player_id.includes(this.userId)) {
              player[value] = true;
              booked[tb._id] = true;
            } else {
              player[value] = false;
            }
          }
        })
        if (!booked[tb._id]) {
          booked[tb._id] = false;
          timeoptions.push({
            text: tb.block_name,
            value: tb._id
          })
        }
      })
      return { gm: gm, player: player, timeoptions: timeoptions, booked: booked };
    }
    catch (err) {
      return { gm: gm, player: player, timeoptions: timeoptions, booked: booked };
    }
  },
  AdminCheck() {
    try {
      return handlerAdmin(this.userId);
    } catch (err) {
      console.log(err);
    }
  }
});