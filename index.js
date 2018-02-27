const express = require('express');
const { ObjectId } = require('mongodb');
const _ = require('lodash');
const bodyParser = require('body-parser');
const session = require('express-session');
const Random = require('random-js')();

const { Question } = require('./model/Questions');
const { User } = require('./model/users');
const { Team } = require('./model/Teams')
const { mongoose } = require('./db/mongoose');

app = express();
app.use(bodyParser.json());
app.use(session({ secret: "bvbjdsvbjvjddj6756778hjgj", resave: false, saveUninitialized: true }));

app.get('/', (req, res) => {
    res.status(200).send('<h1>LIST OF APIs</h1><ul><li>GET /users</li><li>GET /users/:id</li><li>POST /users</li><li>PATCH /users/:id</li><li>DELETE /users/:id</li><li>POST /login</li></ul>');
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
    let body = _.pick(req.body, ['Ques', 'OptionOne', 'OptionTwo', 'OptionThree', 'OptionFour', 'Answer', 'QuestionType']);
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
    let body = _.pick(req.body, ['Ques', 'OptionOne', 'OptionTwo', 'OptionThree', 'OptionFour', 'Answer', 'QuestionType']);
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
    User.findByIdAndRemove(id).then((question) => {
        if (!question) {
            res.status(404).send();
        }
        else {
            res.status(200).send({ question })
        }
    }).catch(e => res.status(400).send(e));
})
//GET /random
app.get('/random/:type', (req, res) => {
    let QuestionType = req.params.type;
    if (!req.session.ignore) {
        res.status(401).send({ message: "Please Login first" });
    }
    else {
        Question.count({ QuestionType }).exec((err, c) => {
            if (err)
                res.status(400).send(err);
            let randQues;
            if (req.session.ignore.length < c) {
                let rand = Random.integer(0, c - 1);
                while (req.session.ignore.includes(rand)) {
                    rand = Random.integer(0, c - 1);
                }
                Question.findOne({ QuestionType }).skip(rand).then((question) => {
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
app.listen(3000, () => console.log("app started at port:3000"));