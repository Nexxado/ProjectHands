var router = require('express').Router();
var mongoUtils = require('../mongoUtils');

router.get('/chat', function (req, res) {
    res.json(mongoUtils.chats().find());
});

// router.post('/chat/:room&:message', function (req, res) {
//     console.log('POST req = ', req);
//     console.log('POST params = ', req.params);
//     // mongoUtils.chats().update({"_id": req.params.room}, {$push: req.params.message});
//     res.sendStatus(200);
// });

router.get('/chat/:room', function (req, res) {
    mongoUtils.chats().find({"_id": req.params.room})
        .toArray(function (err, docs) {
            if (err) {
                res.sendStatus(400);
                return;
            }
            console.log(JSON.stringify(docs));
            var chat = docs.map(function (entity) {
                return entity;
            });
            res.json(chat);
        });
});


module.exports = router;