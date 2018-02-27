const mongoose=require('mongoose');

var TeamSchema= new mongoose.Schema({
    TeamName:{
        type:String,
        required:true,
        minlength:1
    },
    TeamMembers:{
        type:String,
        required:true,
        minlength:4
    },
    TeamScore:{
        type:Number,
        default:0
    },
    QuestionsAttempted:{
        type:Number,
        default:0
    },
    AnsweredPassedQuestions:{
        type:Number,
        default:0
    },
    AnswersCorrect:{
        type:Number,
        default:0
    }
})

var Team=mongoose.model('Team',TeamSchema);
module.exports={Team}