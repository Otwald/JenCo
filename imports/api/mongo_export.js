import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const Rounds = new Mongo.Collection('Rounds');

export const users_account = new Mongo.Collection('users_account');

export const event_settings = new Mongo.Collection('Event_Settings');


if (Meteor.isServer) {
    Meteor.publish('rounds', function () {
        return Rounds.find();
    });
    Meteor.publish('users_account', function (id) {
        if (!this.userId) {
            return this.ready();
        }
        return users_account.find({ _id: id });
    })
}

// if (Meteor.isClient) {
//     Meteor.subscribe('Rounds');
// }