require('../config/config')
const mongoose=require('mongoose');
mongoose.promise=global.promise;

mongoose.connect(process.env.MONGODB_URI).catch((e)=>console.log(e));

module.exports={mongoose};