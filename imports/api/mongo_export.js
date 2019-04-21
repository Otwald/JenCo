import {Mongo} from 'meteor/mongo';
import Meteor from 'meteor/meteor';

export const Rounds = new Mongo.Collection('Rounds');

export const users_account = new Mongo.Collection('users_account');

if(Meteor.isServer){
    Meteor.publish('Rounds', ()=>{
        return Rounds.find();
    });
    Meteor.publish('users_account', ()=>{
        return users_account.find();
    })
}