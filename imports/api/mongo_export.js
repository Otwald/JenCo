import {Mongo} from 'meteor/mongo';
import Meteor from 'meteor/meteor';

export const Rounds = new Mongo.Collection('Rounds');


if(Meteor.isServer){
    Meteor.publish('Rounds', ()=>{
        return Rounds.find();
    });
}


