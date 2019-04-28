import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const Rounds = new Mongo.Collection('Rounds');
export const users_account = new Mongo.Collection('users_account');
export const event_settings = new Mongo.Collection('Event_Settings');
export const Admin = new Mongo.Collection('admin');


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
    Meteor.publish('user_account_admin', function (id) {
        if (!this.userId) {
            return this.ready()
        }
        return users_account.find({});
    })
    Meteor.publish('event_settings_admin', function(id){
        if(!this.userId){
            return this.ready();
        }
        return event_settings.find({});
    })
}

// if (Meteor.isClient) {
//     Meteor.subscribe('Rounds');
// }