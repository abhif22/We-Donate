
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let NgoSchema = new Schema({
    ngoName : {
        required: true,
        type: String,
    },
    regNmber:{
        required: true,
        type: String,
    },
    authorisedPerson: String,
    description : {
        type: String
    },
    address : String,
    location: {
        country: {
            type: String
        },
        state:{
            type:String
        },
        city:{
            type:String
        }
    },
    authentication :{
        type:Boolean,
        default : false
    },
    coverPic:[{
        type: Schema.Types.ObjectId,
        ref: ''
    }],
    events:[{
        type: Schema.Types.ObjectId,
        ref: ''
    }],
    email:{
        type: String, //unique
        required: true,
        lowercase: true,
    },
    contactNumber : String,
    website: {
        url: {
            type: String
        },
    },
    password: {
        type: String,
    },
    stories:[{
        type: Schema.Types.ObjectId,
        ref: ''
    }],
    fundRaised:{
      type:Number
    },
    created_at: {
        type: Date,
    },
    socialLinks: {
        type: [String]
    },
    followerscount : {
        type:Number,
        default:0
    }

});

module.exports = mongoose.model('NgoSchema',NgoSchema );