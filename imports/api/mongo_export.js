import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const users_account = new Mongo.Collection('users_account');
export const users_archive = new Mongo.Collection('users_archive');
export const event_settings = new Mongo.Collection('event_settings');
export const timeblock = new Mongo.Collection('timeblock');
export const Rounds = new Mongo.Collection('rounds', {
    transform: (round) => {
        let gm = users_account.findOne({ _id: round.round_gm_id });
        round.round_player = [];
        if (gm) {
            round.round_gm = gm.profil;
        }
        round.round_player_id.map((value) => {
            let player = users_account.findOne({ _id: value });
            if (player) {
                round.round_player.push(player.profil);
            }
        })
        delete round.round_player_id;
        delete round.round_gm_id;
        return round;
    }
});
export const Admin = new Mongo.Collection('admin');

if (Meteor.isServer) {
    Meteor.publish('rounds', function () {
        return Rounds.find({});
    });
    users_account.deny({
        insert() { return true; },
        update() { return true; },
        remove() { return true; },
    })
    Meteor.publish('users_account', function (id) {
        if (!this.userId) {
            return this.ready();
        }
        return users_account.find({ _id: this.userId });
    })
    Meteor.publish('user_account_admin', function (id) {
        let admin = Admin.findOne({ '_id': this.userId });
        if (this.userId) {
            if (admin) {
                return users_account.find({});
            }
        }
        return this.ready();
    })
    Meteor.publish('event_settings_admin', function (id) {
        let admin = Admin.findOne({ '_id': this.userId });
        if (this.userId) {
            if (admin) {
                return event_settings.find({});
            }
        }
        return this.ready();
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
    event_settings.deny({
        insert() { return true; },
        update() { return true; },
        remove() { return true; },
    })
    Meteor.publish('event_settings_round', function () {
        return event_settings.find({}, {
            fields: {
                tb: 1,
                table: 1,
            }
        })
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