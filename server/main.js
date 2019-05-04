import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';

import './../imports/api/mongo_export';

Meteor.startup(() => {
  // code to run on server at startup
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