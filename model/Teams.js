const mongoose=require('mongoose');

var TeamSchema= new mongoose.Schema({
    TeamName:{
        type:String,
        required:true,
        minlength:1
    },
    TeamMemebers:{
        type:String,
        required:true,
        minlength:4
    },
    TeamScore:{
        type:Number
    },
    QuestionsAttempted:{
        type:Number
    },
    AnsweredPassedQuestions:{
        type:Number
    },
    AnswersCorrect:{
        type:Number
    }
})

var Team=mongoose.model('Team',TeamSchema);
module.exports={Team}