import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const Rounds = new Mongo.Collection('rounds');
export const users_account = new Mongo.Collection('users_account');
export const users_archive = new Mongo.Collection('users_archive');
export const event_settings = new Mongo.Collection('event_settings');
export const timeblock = new Mongo.Collection('timeblock');

if (Meteor.isServer) {
    export const Admin = new Mongo.Collection('admin');
    var all_admin = Admin.find().fetch()
    Meteor.publish('rounds', function () {
        return Rounds.find();
    });
    Meteor.publish('users_account', function (id) {
        if (!this.userId) {
            return this.ready();
        }
        return users_account.find({ _id: this.userId });
    })
    Meteor.publish('user_account_admin', function (id) {
        if (!this.userId) {
            return this.ready()
        }
        return users_account.find({});
    })
    Meteor.publish('event_settings_admin', function (id) {
        if (!this.userId) {
            return this.ready();
        }
        return event_settings.find({});
    })
    Meteor.publish('users_archive', function(id){
        if(!this.userId){
            return this.ready()
        }
        return users_archive.find({});
    })
    Meteor.publish('event_settings_round', function () {
        return event_settings.find({}, {
            fields: {
                tb: 1,
                table: 1,
            }
        })
    })
    Meteor.publish('timeblock', function(){
        if(!this.userId){
            return this.ready()
        }
        return timeblock.find({});
    })
}