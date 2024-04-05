import mongoose from "mongoose";

const appealSchema = mongoose.Schema({
    appealNumber:{
        type:Number,
        default: null,
    },
    fullname:{
        type:String,
        default: null,
    },
    phone:{
        type:String,
        default: null,
    },
    address:{
        type:String,
        default: null,
    },
    appealType:{
        type:String,
        required:true,
        num: ['anonymous', 'register'],
    },
    appealText:{
        type:String,
        required:true,
    },
    appealFile:{
        type:String,
        default: null,
    },
    active:{
        type:Boolean,
        default:true,
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at' ,
    }
})

const AppealModel = mongoose.model('AppealModel', appealSchema);
export default  AppealModel;