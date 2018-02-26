const express = require('express');
const { ObjectId } = require('mongodb');
const _ = require('lodash');
const bodyParser = require('body-parser');
const session = require('express-session');

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
    var id = req.params.id;
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
    var body = _.pick(req.body, ['email', 'password', 'isAdmin']);
    // console.log(JSON.stringify(body))
    var user = new User(body);
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
    var id = req.params.id;
    var body = _.pick(req.body, ['email', 'password', 'isAdmin']);
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
    var id = req.params.id;
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
    var body = _.pick(req.body, ['email', 'password']);
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
    var id = req.params.id;
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
    var body = _.pick(req.body, ['TeamName', 'TeamMemebers', 'TeamScore', 'QuestionsAttempted', 'AnsweredPassedQuestions', 'AnswersCorrect']);
    // console.log(JSON.stringify(body))
    var team = new Team(body);
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
    var id = req.params.id;
    var body = _.pick(req.body, ['TeamName', 'TeamMemebers', 'TeamScore', 'QuestionsAttempted', 'AnsweredPassedQuestions', 'AnswersCorrect']);
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
    var id = req.params.id;
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
    var id = req.params.id;
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
    var body = _.pick(req.body, ['Ques', 'OptionOne', 'OptionTwo', 'OptionThree', 'OptionFour', 'Answer', 'QuestionType']);
    // console.log(JSON.stringify(body))
    var question = new Question(body);
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
    var id = req.params.id;
    var body = _.pick(req.body, ['Ques', 'OptionOne', 'OptionTwo', 'OptionThree', 'OptionFour', 'Answer', 'QuestionType']);
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
    var id = req.params.id;
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
app.get('/random', (req, res) => {
    var count;
    Question.count().exec((err, c) => {
        if (err)
            res.status(400).send(err);
        var rand = Math.floor(Math.random() * c);
        var randQues;
        console.log(req.session.ignore.length, c)
        if (req.session.ignore.length < c) {
            console.log(req.session.ignore)
            Question.findOne().skip(rand).then((question) => {
                randQues=question;
                console.log(JSON.stringify(randQues._id));
                console.log("STATUS:"+req.session.ignore.includes(randQues._id.toString()))
                if(req.session.ignore.includes(randQues._id.toString())) {
                    var random = Math.floor(Math.random() * c);
                    debugger;
                    Question.findOne().skip(random).then( question=>{ console.log(question);
                        randQues = question
                    }).catch((e) => res.send(e));
                }
                console.log(JSON.stringify(randQues))
                req.session.ignore.push(randQues._id);
                res.send({ randQues })
            }).catch((e) => res.send(e))
           
        }
        // console.log(JSON.stringify(req.session.user));
        else
            res.status(404).send({ message: "Quiz Over" });
    });
})

app.listen(3000, () => console.log("app started at port:3000"));