import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';

import './../imports/api/mongo_export';
import { event_settings, timeblock, Rounds, users_archive, users_account } from './../imports/api/mongo_export';

Meteor.startup(() => {
  console.log('Restart');
  // for initial Setup Creating one Empty Event Entry
  const cursor = event_settings.findOne();
  if (!cursor) {
    event_settings.insert({
      e_start: null,
      e_end: null,
      e_loc: null,
      tb: [],
      table: null,
      price: null,
    });
  }
});


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

  BlockCreate(data) {
    timeblock.insert(data);

  },
  BlockUpdate(data) {
    timeblock.update({ _id: data._id }, data)
  },
  BlockDelete(id) {
    timeblock.remove({ _id: id });
  },
  RoundCreate(data) {
    Rounds.insert(data);
    const table = Rounds.findOne(data);
    const block = timeblock.findOne({ _id: data.round_tb });
    block.block_table.push(table.round_table)
    timeblock.update({ _id: block._id }, { $set: { "block_table": block.block_table } })
  },
  RoundUpdate(data) {
    Rounds.update({ _id: data._id }, data)
  },
  RoundDelete(id) {
    const table = Rounds.findOne({ _id: id });
    Rounds.remove({ _id: id });
    const block = timeblock.findOne({ _id: table.round_tb })
    block.block_table.map((v, i) => {
      if (v === table.round_table) {
        block.block_table.splice(i, 1)
      }
    })
    timeblock.update({ _id: block._id }, { $set: { "block_table": block.block_table } })
  },
  AccountCreate(data) {
    data._id = this.userId
    data.bill = false;
    users_account.insert(data);
  },
  AccountUpdate(data) {
    users_account.update({ _id: this.userId }, {
      $set: {
        "first": data.first, "last": data.last, "profil": data.profil, "age": data.age
      }
    });
  },
  AccountDelete(id) {
    users_account.remove({ _id: this.userId });
  },
  UserArchiveCreate(data) {
    users_archive.insert(data);
  },
  SwitchBill(data) {
    const user = users_account.findOne({ _id: data });  
    users_account.update({ _id: data}, {
      $set: {
        "bill": !user.bill
      }
    });
  },
  EventUpdate(data) {
    event_settings.update({ _id: data._id }, data);
  },
});