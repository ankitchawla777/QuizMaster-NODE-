require('./config/config');
require('isomorphic-fetch'); 

const Dropbox = require('dropbox').Dropbox;
const express = require('express');
const { ObjectId } = require('mongodb');
const _ = require('lodash');
const bodyParser = require('body-parser');
const session = require('express-session');
const Random = require('random-js')();
const path=require('path');
const fs= require('fs');
const multer  = require('multer');

const { Question } = require('./model/Questions');
const { User } = require('./model/users');
const { Team } = require('./model/Teams')
const { QuesImg }= require('./model/QuesImg');
const { mongoose } = require('./db/mongoose');

const port= process.env.PORT ;
const upload = multer({ dest: 'uploads/' });

let dbx=new Dropbox({accessToken: 'YB3e3FnueRAAAAAAAAAAO-p4YByPLyn8RoU0CCMelf7KvgzILwc2RW_KCBUzZqsl'})

app = express();
app.use(bodyParser.json());
app.use(session({ secret: "bvbjdsvbjvjddj6756778hjgj", resave: false, saveUninitialized: true }));

app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname + '/index.html'));
})
// USER API's
//GET /users
app.get('/users', (req, res) => {
    User.find().then((users) => {
        res.send({ users })
    },
        (error) => {
            res.status(400).send(error);
        }
    ).catch((e) => console.log(e));
})
//GET /users:id
app.get('/users/:id', (req, res) => {
    let id = req.params.id;
    if (!ObjectId.isValid(id)) {
        res.send(400).send();
    }
    User.findById(id).then((user) => {
        if (!user) {
            res.status(404).send();
        }
        else {
            res.status(200).send({ user })
        }
    },
        (error) => {
            res.status(400).send(error);
        }
    ).catch((e) => console.log(e));
})
//POST /users
app.post('/users', (req, res) => {
    let body = _.pick(req.body, ['email', 'password', 'isAdmin']);
    // console.log(JSON.stringify(body))
    let user = new User(body);
    user.save().then((user) => {
        if (!user) {
            res.status(404).send();
        }
        else {
            res.status(200).send({ user })
        }
    }).catch(e => res.status(400).send(e));
})
//PATCH /users/:id
app.patch('/users/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['email', 'password', 'isAdmin']);
    if (!ObjectId.isValid(id)) {
        res.send(400).send();
    }
    User.findByIdAndUpdate(id, { $set: body }, { new: true }).then((user) => {
        if (!user) {
            res.status(404).send();
        }
        else {
            res.status(200).send({ user })
        }
    }).catch(e => res.status(400).send(e));
})
//DELETE /users/:id
app.delete('/users/:id', (req, res) => {
    let id = req.params.id;
    if (!ObjectId.isValid(id)) {
        res.send(400).send();
    }
    User.findByIdAndRemove(id).then((user) => {
        if (!user) {
            res.status(404).send();
        }
        else {
            res.status(200).send({ user })
        }
    }).catch(e => res.status(400).send(e));
})
//POST /login
app.post('/login', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    User.findByCredentials(body.email, body.password).then((user) => {
        if (!user.email) {
            res.status(404).send();
        }
        else {
            req.session.user = user;
            req.session.ignore = [];
            res.status(200).send({ user });
        }
    }).catch((e) => {
        res.status(400).send();
    }).catch(e => res.status(400).send(e));
})
//GET /me
app.get('/me',(req,res)=>{
    if(!req.session.user)
    {
        res.send(404).send()
    }
    let body=_.pick(req.session.user,['email','isAdmin'])
    res.send(body)
})

// Teams API's
//GET /teams
app.get('/teams', (req, res) => {
    Team.find().then((teams) => {
        res.send({ teams })
    },
        (error) => {
            res.status(400).send(error);
        }
    ).catch((e) => console.log(e));
})
//GET /teams:id
app.get('/teams/:id', (req, res) => {
    let id = req.params.id;
    if (!ObjectId.isValid(id)) {
        res.send(400).send();
    }
    Team.findById(id).then((team) => {
        if (!team) {
            res.status(404).send();
        }
        else {
            res.status(200).send({ team })
        }
    },
        (error) => {
            res.status(400).send(error);
        }
    ).catch((e) => console.log(e));
})
//POST /teams
app.post('/teams', (req, res) => {
    let body = _.pick(req.body, ['TeamName', 'TeamMembers', 'TeamScore', 'QuestionsAttempted', 'AnsweredPassedQuestions', 'AnswersCorrect']);
    // console.log(JSON.stringify(body))
    let team = new Team(body);
    team.save().then((team) => {
        if (!team) {
            res.status(404).send();
        }
        else {
            res.status(200).send({ team })
        }
    }).catch(e => res.status(400).send(e));
})
//PATCH /teams/:id
app.patch('/teams/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['TeamName', 'TeamMembers', 'TeamScore', 'QuestionsAttempted', 'AnsweredPassedQuestions', 'AnswersCorrect']);
    if (!ObjectId.isValid(id)) {
        res.send(400).send();
    }
    Team.findByIdAndUpdate(id, { $set: body }, { new: true }).then((team) => {
        if (!question) {
            res.status(404).send();
        }
        else {
            res.status(200).send({ question })
        }
    }).catch(e => res.status(400).send(e));
})
//DELETE /teams/:id
app.delete('/teams/:id', (req, res) => {
    let id = req.params.id;
    if (!ObjectId.isValid(id)) {
        res.send(400).send();
    }
    Team.findByIdAndRemove(id).then((team) => {
        if (!team) {
            res.status(404).send();
        }
        else {
            res.status(200).send({ team })
        }
    }).catch(e => res.status(400).send(e));
})

// Questions API's
//GET /questions
app.get('/questions', (req, res) => {
    Question.find().then((questions) => {
        res.send({ questions })
    },
        (error) => {
            res.status(400).send(error);
        }
    ).catch((e) => console.log(e));
})
//GET /questions:id
app.get('/questions/:id', (req, res) => {
    let id = req.params.id;
    if (!ObjectId.isValid(id)) {
        res.send(400).send();
    }
    Question.findById(id).then((question) => {
        if (!question) {
            res.status(404).send();
        }
        else {
            res.status(200).send({ question })
        }
    },
        (error) => {
            res.status(400).send(error);
        }
    ).catch((e) => console.log(e));
})
//POST /questions
app.post('/questions', (req, res) => {
    let body = _.pick(req.body, ['Ques', 'OptionOne', 'OptionTwo', 'OptionThree', 'OptionFour', 'Answer', 'Category']);
    // console.log(JSON.stringify(body))
    let question = new Question(body);
    question.save().then((question) => {
        if (!question) {
            res.status(404).send();
        }
        else {
            res.status(200).send({ question })
        }
    }).catch(e => res.status(400).send(e));
})
//PATCH /questions/:id
app.patch('/questions/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['Ques', 'OptionOne', 'OptionTwo', 'OptionThree', 'OptionFour', 'Answer', 'Category']);
    if (!ObjectId.isValid(id)) {
        res.send(400).send();
    }
    Question.findByIdAndUpdate(id, { $set: body }, { new: true }).then((question) => {
        if (!question) {
            res.status(404).send();
        }
        else {
            res.status(200).send({ question })
        }
    }).catch(e => res.status(400).send(e));
})
//DELETE /questions/:id
app.delete('/questions/:id', (req, res) => {
    let id = req.params.id;
    if (!ObjectId.isValid(id)) {
        res.send(400).send();
    }
    Question.findByIdAndRemove(id).then((question) => {
        if (!question) {
            res.status(404).send();
        }
        else {
            res.status(200).send({ question })
        }
    }).catch(e => res.status(400).send(e));
})
//GET /random
app.get('/random/:category', (req, res) => {
    let Category = req.params.category;
    if (!req.session.ignore) {
        res.status(401).send({ message: "Please Login first" });
    }
    else {
        Question.count({ Category }).exec((err, c) => {
            if (err)
                res.status(400).send(err);
            let randQues;
            if (req.session.ignore.length < c) {
                let rand = Random.integer(0, c - 1);
                while (req.session.ignore.includes(rand)) {
                    rand = Random.integer(0, c - 1);
                }
                Question.findOne({ Category }).skip(rand).then((question) => {
                    randQues = question;
                    req.session.ignore.push(rand);
                    res.send({ randQues })
                }).catch((e) => res.send(e))

            }
            else
                res.status(404).send({ message: "Quiz Over" });
        });
    }
})
//GET /reset        ----------->rests ignore list to empty
app.get('/reset', (req, res) => {
    req.session.ignore = [];
    res.send({ message: "Reset Successfull" });
})
//GET /check        ----------->checks the answer and updates the score
app.post('/check', (req, res) => {
    let qId = req.body.qId;
    let tId = req.body.tId;
    let answer = req.body.answer;
    let PassFLAG = req.body.PassFLAG;
  
    Team.findById(tId).then((team) => {
        Question.findById(qId).then((question) => {
            if ((!question) || (!team)) {
                res.status(400).send("Error");
            }
            else if(question.Answer===answer)
            {
                if(PassFLAG==0)
                {
                    let body={
                        QuestionsAttempted : team.QuestionsAttempted+1,
                        AnswersCorrect: team.AnswersCorrect+1,
                        TeamScore: team.TeamScore + 10
                    }
                    Team.findByIdAndUpdate(tId,{$set:body},{new :true}).then(()=>res.send({message:"Correct Answer"})).catch((e)=>res.status(500).send(e))
                }
                else if(PassFLAG==1)
                {
                    let body={
                        QuestionsAttempted : team.QuestionsAttempted+1,
                        AnswersCorrect: team.AnswersCorrect+1,
                        AnsweredPassedQuestions: team.AnsweredPassedQuestions+1,
                        TeamScore: team.TeamScore + 5
                    }
                    Team.findByIdAndUpdate(tId,{$set:body},{new :true}).then(()=>res.send({message:"Correct Answer"})).catch((e)=>res.status(500).send(e))
                }
            }
            else
            {
                Team.findByIdAndUpdate(tId,{$set: {QuestionsAttempted:team.QuestionsAttempted+1}},{new :true}).then((team,err)=>{
                    res.send({message:"Wrong Answer"});
                    if(err)
                    console.log(err)
                }).catch((e)=>res.status(500).send(e))
            }
        }).catch((e) => res.status(404).send(JSON.stringify(e)));
    }).catch((e) => res.status(404).send(JSON.stringify(e)));
})
//QuesImg API's
//GET /quesimg
app.get('/quesimg',(req,res)=>{
    QuesImg.find().then((quesimgs) => {
        res.send(quesimgs)
    },
        (error) => {
            res.status(400).send(error);
        }
    ).catch((e) => console.log(e));
})
//GET /quesimg/:id
app.get('/quesimg/:id', (req, res) => {
    let id = req.params.id;
    if (!ObjectId.isValid(id)) {
        res.send(400).send();
    }
    QuesImg.findById(id).then((question) => {
        if (!question) {
            res.status(404).send();
        }
        else {
            res.status(200).send({ question })
        }
    },
        (error) => {
            res.status(400).send(error);
        }
    ).catch((e) => console.log(e));
})
//POST /quesimg
app.post('/quesimg',upload.single('img'),(req,res)=>{
    let body = _.pick(req.body, ['Ques','Answer','Category']);
    let quesimg = new QuesImg(body);
    try{
    var img=fs.readFileSync(req.file.path);
    var type = req.file.mimetype;
    var filename=Date.now()+req.file.originalname.toString();
    dbx.filesUpload({path:`/test/${filename}`,contents:img}).then((file)=>{
        dbx.sharingCreateSharedLink({path:`/test/${filename}`}).then((file)=>{
                        var url=file.url;
                       quesimg.ImgUrl=url.substring(0,url.length-1)+"1";
                        quesimg.save().then((question,err) => {
                            if (err) {
                                res.status(404).send();
                            }
                            else {
                                res.status(200).send({ message: "Question Added" })
                            }
                        }).catch(e => res.status(400).send(e));
                    }).catch((e)=>console.log(e));
                    
        }).catch((e)=>console.log(e));
     }
    catch(e){
        res.status(404).send({message: "No Image Found"});
        res.end();
        return;
    }
})
//PATCH /quesimg/:id
app.patch('/quesimg/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['Ques','Answer', 'Category']);
    if (!ObjectId.isValid(id)) {
        res.send(400).send();
    }
    QuesImg.findByIdAndUpdate(id, { $set: body }, { new: true }).then((question) => {
        if (!question) {
            res.status(404).send();
        }
        else {
            res.status(200).send({ question })
        }
    }).catch(e => res.status(400).send(e));
})
//DELETE /quesimg/:id
app.delete('/quesimg/:id', (req, res) => {
    let id = req.params.id;
    if (!ObjectId.isValid(id)) {
        res.send(400).send();
    }
    QuesImg.findByIdAndRemove(id).then((question) => {
        if (!question) {
            res.status(404).send();
        }
        else {
            res.status(200).send({ question })
        }
    }).catch(e => res.status(400).send(e));
})
//GET /randomimg
app.get('/randomimg/:category', (req, res) => {
    let Category = req.params.category;
    if (!req.session.ignore) {
        res.status(401).send({ message: "Please Login first" });
    }
    else {
        QuesImg.count({ Category }).exec((err, c) => {
            if (err)
                res.status(400).send(err);
            let randQues;
            if (req.session.ignore.length < c) {
                let rand = Random.integer(0, c - 1);
                while (req.session.ignore.includes(rand)) {
                    rand = Random.integer(0, c - 1);
                }
                QuesImg.findOne({ Category }).skip(rand).then((question) => {
                    randQues = question;
                    req.session.ignore.push(rand);
                    res.send({ randQues })
                }).catch((e) => res.send(e))

            }
            else
                res.status(404).send({ message: "Quiz Over" });
        });
    }
})
//GET /checkimg        ----------->checks the answer and updates the score
app.post('/checkimg', (req, res) => {
    let qId = req.body.qId;
    let tId = req.body.tId;
    let answer = req.body.answer;
    let PassFLAG = req.body.PassFLAG;
  
    Team.findById(tId).then((team) => {
        QuesImg.findById(qId).then((question) => {
            if ((!question) || (!team)) {
                res.status(400).send("Error");
            }
            else if(question.Answer===answer)
            {
                if(PassFLAG==0)
                {
                    let body={
                        QuestionsAttempted : team.QuestionsAttempted+1,
                        AnswersCorrect: team.AnswersCorrect+1,
                        TeamScore: team.TeamScore + 10
                    }
                    Team.findByIdAndUpdate(tId,{$set:body},{new :true}).then(()=>res.send({message:"Correct Answer"})).catch((e)=>res.status(500).send(e))
                }
                else if(PassFLAG==1)
                {
                    let body={
                        QuestionsAttempted : team.QuestionsAttempted+1,
                        AnswersCorrect: team.AnswersCorrect+1,
                        AnsweredPassedQuestions: team.AnsweredPassedQuestions+1,
                        TeamScore: team.TeamScore + 5
                    }
                    Team.findByIdAndUpdate(tId,{$set:body},{new :true}).then(()=>res.send({message:"Correct Answer"})).catch((e)=>res.status(500).send(e))
                }
            }
            else
            {
                Team.findByIdAndUpdate(tId,{$set: {QuestionsAttempted:team.QuestionsAttempted+1}},{new :true}).then((team,err)=>{
                    res.send({message:"Wrong Answer"});
                    if(err)
                    console.log(err)
                }).catch((e)=>res.status(500).send(e))
            }
        }).catch((e) => res.status(404).send(JSON.stringify(e)));
    }).catch((e) => res.status(404).send(JSON.stringify(e)));
})
app.listen(port, () => console.log(`app started at port:${port}`));