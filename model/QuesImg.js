const mongoose=require('mongoose');
var QuesImgSchema = new mongoose.Schema({
    Ques :{
        type: String,
        required: true,
        minlength:10,
        unique: true,
        trim: true
    },
    ImgUrl:{
        type:String,
        required:true
    },
    Answer:{
        type:String,
        required:true,
        minlength:1
    },
    Category:{
        type:String,
        required:true,
        minlength:1
    }
}) 

var QuesImg=mongoose.model('QuesImg',QuesImgSchema);
module.exports={QuesImg}