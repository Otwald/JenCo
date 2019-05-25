import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';

import './../imports/api/mongo_export';
import { event_settings } from './../imports/api/mongo_export';

Meteor.startup(() => {
  console.log('Restart');
  // for initial Setup Creating one Empty Event Entry
  const cursor = event_settings.findOne();
  if(!cursor){
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
    const from ='no-reply@test.de'
    const subject = 'Hello from Meteor!'
    const text = 'This is a test of Email.send.'
    // Make sure that all arguments are strings.
    // check([to, from, subject, text], [String]);

    // Let other method calls from the same client start running, without
    // waiting for the email sending to complete.
    this.unblock();

    if(Email.send({ to, from, subject, text })){
      console.log('true')
    }else{
      console.log('false')
    }
  }
});