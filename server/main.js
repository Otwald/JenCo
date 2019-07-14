import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Email } from 'meteor/email';

import './../imports/api/mongo_export';
import { event_settings, timeblock, Rounds, users_archive, users_account } from './../imports/api/mongo_export';

Meteor.startup(() => {
  console.log('Restart');
  // for initial Setup Creating one Empty Event Entry
  // const cursor = event_settings.findOne();
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

//todo: log send emails
// Server: Define a method that the client can call.
Meteor.methods({
  sendEmail(to) {
    const from = 'no-reply@test.de'
    const subject = 'Hello from Meteor!'
    const text = 'This is a test of Email.send.'
    // Make sure that all arguments are strings.
    // check([to, from, subject, text], [String]);

    // Let other method calls from the same client start running, without
    // waiting for the email sending to complete.
    this.unblock();

    if (Email.send({ to, from, subject, text })) {
      console.log('true')
    } else {
      console.log('false')
    }
  },

  //todo: getting decorators to work
  BlockCreate(data) {
    console.log(data);
    try {
      check(data, {
        block_name: String,
        block_pnp: Boolean,
        block_start: Number,
        block_end: Number,
        block_table: Array,
        block_max_table: Number
      })
      timeblock.insert(data);
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
        block_table: Array,
        block_max_table: Number
      })
      //todo admincheck
      timeblock.update({ _id: data._id }, data)
    }
    catch (err) {
      console.log(err)
    }
  },
  BlockDelete(id) {
    try {
      check(id, String);
      timeblock.remove({ _id: id });
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
      round_curr_pl: Number,
      round_max_pl: Number,
      round_desc: String,
      round_player: Array,
      round_table: Number
    })
    data.round_gm_id = this.userId;
    users_account.findOne({ '_id': this.userId });
    data.round_gm = users_account.profil,
    data.round_player_id = [];
      Rounds.insert(data);
    const table = Rounds.findOne(data);
    const block = timeblock.findOne({ _id: data.round_tb });
    block.block_table.push(table.round_table)
    timeblock.update({ _id: block._id }, { $set: { "block_table": block.block_table } })
  },
  RoundUpdate(data) {
    console.log(data);
    check(data, {
      _id: String,
      round_tb: String,
      round_name: String,
      setting: String,
      ruleset: String,
      own_char: Boolean,
      round_max_online_pl: Number,
      round_curr_pl: Number,
      round_max_pl: Number,
      round_desc: String,
      round_player: Array,
      round_table: Number,
      round_gm: String
    })
    const round = Rounds.findOne({ _id: data._id })
    if (round.round_gm_id === this.userId) {
      data['round_gm_id'] = this.userId;
      Rounds.update({ _id: data._id }, data)
    }
  },
  RoundDelete(id) {
    check(id, String);
    const table = Rounds.findOne({ _id: id });
    if (table) {
      if (table.round_gm_id == this.userId) {
        Rounds.remove({ _id: id });
        const block = timeblock.findOne({ _id: table.round_tb })
        block.block_table.map((v, i) => {
          if (v === table.round_table) {
            block.block_table.splice(i, 1)
          }
        })
        timeblock.update({ _id: block._id }, { $set: { "block_table": block.block_table } })
      }
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
    users_account.remove({ _id: this.userId });
  },
  UserArchiveCreate(data) {
    users_archive.insert(data);
  },
  SwitchBill(data) {
    const user = users_account.findOne({ _id: data });
    users_account.update({ _id: data }, {
      $set: {
        "bill": !user.bill
      }
    });
  },
  EventCreate(data) {
    event_settings.insert(data);
  },
  EventUpdate(data) {
    event_settings.update({ _id: data._id }, data);
  },
  CheckGM(id) {
    try {
      check(id, String);
      let round = Rounds.findOne({ '_id': id });
      if (round.round_gm_id === this.userId) {
        return true;
      } else {
        return false;
      }
    }
    catch (err) {
      return false;
    }
  },
  CheckPlayer(id) {
    try {
      check(id, String);
      let round = Rounds.findOne({ '_id': id });
      if (round) {
        round.player_id.map((v) => {
          if (value == this.userId) {
            return true;
          }
        })
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  }
});