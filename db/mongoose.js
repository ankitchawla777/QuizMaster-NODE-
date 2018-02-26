const mongoose=require('mongoose');
mongoose.promise=global.promise;

mongoose.connect('mongodb://localhost:27017/QuizMaster').catch((e)=>console.log(e));

module.exports={mongoose};