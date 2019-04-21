import {Mongo} from 'meteor/mongo';
import Meteor from 'meteor/meteor';

export const Rounds = new Mongo.Collection('Rounds');

export const users_account = new Mongo.Collection('users_account');

if(Meteor.isServer){
    Meteor.publish('Rounds', ()=>{
        return Rounds.find();
    });
    Meteor.publish('users_account', ()=>{
        console.log(this.userId)
        return users_account.find({_id : this.userId});
    })
}