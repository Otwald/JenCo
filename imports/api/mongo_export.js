import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const users_archive = new Mongo.Collection('users_archive');
export const event_settings = new Mongo.Collection('event_settings');
export const timeblock = new Mongo.Collection('timeblock');
export const Rounds = new Mongo.Collection('rounds');
export const Admin = new Mongo.Collection('admin');

if (Meteor.isServer) {
    Meteor.publish('rounds', function () {
        return Rounds.find({});
    });
    Meteor.users.deny({
        update() { return true; }
    });
    Meteor.publish('event_settings_admin', function (id) {
        let admin = Admin.findOne({ '_id': this.userId });
        if (this.userId) {
            if (admin) {
                return event_settings.find({});
            }
        }
        return this.ready();
    })
    event_settings.deny({
        insert() { return true; },
        update() { return true; },
        remove() { return true; },
    })
    Meteor.publish('event_settings', function (id) {
        return event_settings.find({});
    })
    Meteor.publish('event_settings_round', function () {
        return event_settings.find({}, {
            fields: {
                tb: 1,
                table: 1,
            }
        })
    })
    users_archive.deny({
        insert() { return true; },
        update() { return true; },
        remove() { return true; },
    })
    Meteor.publish('users_archive', function (id) {
        if (!this.userId) {
            return this.ready()
        }
        return users_archive.find({});
    })
    timeblock.deny({
        insert() { return true; },
        update() { return true; },
        remove() { return true; },
    })
    Meteor.publish('timeblock', function () {
        if (!this.userId) {
            return this.ready()
        }
        return timeblock.find({});
    })
    Meteor.publish('timeblock_table', function () {
        return timeblock.find({ "block_pnp": true });
    })
}