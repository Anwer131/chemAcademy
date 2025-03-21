const express = require("express");
const router = express.Router();
const authenticate = require('../authenticate');
const cors = require('./cors');
const Room = require('../models/room');


//create a new room
router.post('/',cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    if(!req.body.name || !req.body.description){
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        return res.json({err:`${!req.body.name ? 'Name' : 'Description'} is required`});
    }
    req.body.owner = req.user._id;
    var newRoom = new Room(req.body);
    newRoom.members.push(req.user._id);
    newRoom.save()
    .then((room) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(room);
    }, (err) => next(err))
    .catch(err => next(err))
})

//get room details
router.get('/:id',cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Room.findById(req.params.id)
    .populate('owner')
    .populate('members')
    .populate('joinRequests')
    .then((room) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(room);
    }, (err) => next(err))
    .catch(err => next(err))
})

//join a room
router.post('/:id/join',cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Room.findById(req.params.id)
    .then((room) => {
        if(room.members.includes(req.user._id)){
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.json({err:'You are already a member of this room'});
        }else if(room.joinRequests.includes(req.user._id)){
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.json({err:'You have already requested to join this room'});
        }else if(room.isPrivate){
            room.joinRequests.push(req.user._id);
            room.save()
            .then((room) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(room);
            }, (err) => next(err))
            .catch(err => next(err))
        }else{
            room.members.push(req.user._id);
            room.save()
            .then((room) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(room);
            }, (err) => next(err))
            .catch(err => next(err))
        }
    }, (err) => next(err))
    .catch(err => next(err))
})

//approve or reject a join request
router.post('/:id/join/:userId',cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Room.findById(req.params.id)
    .then((room) => {
        if(room.admin != req.user._id){
            res.statusCode = 403;
            res.setHeader('Content-Type', 'application/json');
            res.json({err:'You are not authorized to perform this action'});
        }else if(room.joinRequests.includes(req.params.userId)){
            room.joinRequests = room.joinRequests.filter(id => id != req.params.userId);
            room.members.push(req.params.userId);
            room.save()
            .then((room) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(room);
            }, (err) => next(err))
            .catch(err => next(err))
        }else{
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.json({err:'No such request found'});
        }
    }, (err) => next(err))
    .catch(err => next(err))
})

//Exit a room
router.post('/:id/exit',cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Room.findById(req.params.id)
    .then((room) => {
        if(room.members.includes(req.user._id)){
            room.members = room.members.filter(id => id != req.user._id);
            room.save()
            .then((room) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(room);
            }, (err) => next(err))
            .catch(err => next(err))
        }else{
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.json({err:'You are not a member of this room'});
        }
    }, (err) => next(err))
    .catch(err => next(err))
})

module.exports = router;