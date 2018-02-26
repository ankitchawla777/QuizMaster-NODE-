const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt = require('bcryptjs');

var UserSchema= new mongoose.Schema({
    email :{
        type: String,
        required : true,
        minlength: 5,
        trim:true,
        unique: true,
        validate : {
            validator : validator.isEmail,
            message: '{VALUE} is not a valid Mail'
        }
    },
    password :{
        type: String,
        required : true,
        minLength : 6
    },
    isAdmin :{
        type: Boolean,
        required: true
    }
    // tokens : [{
    //   access: {
    //       type : String,
    //       required
    //   }  
    // }]
})
UserSchema.statics.findByCredentials=function(email,password) 
{
    var User=this;
    //console.log(JSON.stringify(User));
    return User.findOne({email}).then((user)=>{
        if(!user)
        {
            return Promise.reject;
        }
        return new Promise((resolve,reject)=>{
            bcrypt.compare(password,user.password,(err,res)=>{
                if(res){
                    resolve(user);
                }
                else{
                    reject();
                }
            })
        })
    })
};
UserSchema.pre('save',function(next){
    var user= this;
    //console.log(JSON.stringify(user));
    if(user.isModified('password'))
    {
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password,salt,(err,hash)=>{
                user.password=hash;
                next();
            });
        });
    }else {
        next();
      }
    
});

var User =mongoose.model('User',UserSchema);
module.exports={User}