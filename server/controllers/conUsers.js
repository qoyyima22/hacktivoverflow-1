const User = require('../models/User')
const hashing = require('../helpers/hashing')
const tokening = require('../helpers/jwt')
const cronJob = require('../helpers/kueSendEmail')

module.exports = {
    register: (req, res, next) => {
        let name = req.body.name
        let password = req.body.password
        let pp = req.body.pp
        let email = req.body.email
        let watchTags = req.body.watchTags
        let hashedPass = hashing.generateHash(password)
        return User.create({
                name,
                password: hashedPass,
                pp,
                email,
                watchTags
            })
            .then(result => {
                cronJob.sendEmailWelcome(email)
                res.status(201).json(result)
            })
            .catch(err => {
                next(err)
            })
    },
    login(req, res, next) {
        let email = req.body.email
        let password = req.body.password
        User.findOne({
                email: email
            })
            .then(result => {
                if (!result) {
                    next(new Error("Invalid login input"))
                } else {
                    if (hashing.compareHash(password, result.password)) {
                        let x = tokening.generateToken({
                            name: result.name,
                            pp: result.pp,
                            email: result.email,
                            id: result._id
                        })
                        res.status(200).json({
                            jwtoken: x,
                            userId: result._id,
                            name: result.name,
                            pp: result.pp,
                            watchTags: result.watchTags
                        })
                    } else {
                        next(new Error('Invalid login input'))
                    }
                }
            })
            .catch(err => {
                next(err)
            })
    },
    getUserInfo(req,res,next){
        User.findOne({_id: req.body.userId})
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            next(err)
        })
    },
    addTag(req,res,next){
        User.updateOne({_id:req.body.userId}, {$addToSet: {watchTags: req.params.tag}})
        .then(data => {
            console.log(data)
            res.status(201).json(data)
        })
        .catch(err => {
            next(err)
        })
    },
    removeTag(req,res,next){
        console.log(req.params.tag)
        User.updateOne({_id:req.body.userId}, {$pull: {watchTags: req.params.tag}})
        .then(data => {
            console.log(data)
            res.status(201).json(data)
        })
        .catch(err => {
            console.log(err)
            next(err)
        })
    }
}