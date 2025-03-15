const express = require('express');
const router = express.Router();
const authenticate = require("../authenticate");
const {Thread, Message} = require("../models/thread");
const cors = require('./cors');
const Room = require("../models/room");

router.get('/', cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    return res.json({ message: 'GET operation not supported on /threads' });
})
router.get('/:roomId', cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Thread.find({ roomId: req.params.roomId })
        .populate('user')
        .then((threads) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(threads);
        }, (err) => next(err))
        .catch(err => next(err))
})
router.post('/:roomId',cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Room.findById(req.params.roomId)
    .then((room) => {
        if (!room) {
            res.statusCode = 404;
            return res.json({ message: 'Room not found' });
        }
        req.body.roomId = req.params.roomId;
        req.body.author = req.user._id;
        const newThread = new Thread(req.body);
        return newThread.save();
    })
    .then((thread) => {
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.json(thread);
    })
    .catch(err => next(err));
})
router.delete('/:roomId/:threadId', cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    Room.findById(req.params.roomId)
    .then((room) => {
        if (!room) {
            res.statusCode = 404;
            return res.json({ message: 'Room not found' });
        }
        return Thread.findById(req.params.threadId);
    })
    .then((thread) => {
        if (!thread) {
            res.statusCode = 404;
            return res.json({ message: 'Thread not found' });
        }
        if (thread.author.toString() !== req.user._id.toString()) {
            res.statusCode = 403;
            return res.json({ message: 'You are not authorized to delete this thread' });
        }
        return thread.remove();
    }, (err) => next(err))
    .then(() => {
        res.statusCode = 200;
        res.json({ message: 'Thread deleted successfully' });
    })
    .catch(err => next(err));
})

router.get('/:roomId/:threadId', cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Room.findById(req.params.roomId)
    .then((room) => {
        if (!room) {
            res.statusCode = 404;
            return res.json({ message: 'Room not found' });
        }
        return Thread.findById(req.params.threadId)
        .populate('author')
        .populate('messages');
    })
    .then((thread) => {
        if (!thread) {
            res.statusCode = 404;
            return res.json({ message: 'Thread not found' });
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(thread);
    }, (err) => next(err))
    .catch(err => next(err));
})

//posting messages
router.post('/:threadId', cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    
    Thread.findById(req.params.threadId)
    .then((thread) => {
        if (!thread) {
            res.statusCode = 404;
            return res.json({ message: 'Thread not found' });
        }
        req.body.author = req.user._id;
        const newMessage = new Message(req.body);
        return newMessage.save();
    })
    .then((message) => {
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.json(message);
    })
    .catch(err => next(err));
})
module.exports = router;