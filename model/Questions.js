const mongoose=require('mongoose');
var QuestionSchema = new mongoose.Schema({
    Ques :{
        type: String,
        required: true,
        minlength:10,
        unique: true,
        trim: true
    },
    OptionOne:{
        type:String,
        required:true,
        minlength:1
    },
    OptionTwo:{
        type:String,
        required:true,
        minlength:1
    },
    OptionThree:{
        type:String,
        required:true,
        minlength:1
    },
    OptionFour:{
        type:String,
        required:true,
        minlength:1
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

var Question=mongoose.model('Question',QuestionSchema);
module.exports={Question}