var router = require('express').Router();
var mongoUtils = require('../mongoUtils');


router.get('/chat/:room', function (req, res) {
    mongoUtils.chats().find({"_id": req.params.room})
        .toArray(function (err, docs) {
            if (err) {
                res.sendStatus(400);
                return;
            }
            // console.log(JSON.stringify(docs));
            var chat = docs.map(function (entity) {
                return entity;
            });
            res.json(chat);
        });
});

router.get('/renovation/:query&:value', function(req, res) {

    var query = {};
    query[req.params.query] = req.params.value;

    mongoUtils.renovations().find(query)
        .toArray(function (err, docs) {
            if (err) {
                res.sendStatus(400);
                return;
            }
            // console.log(JSON.stringify(docs));
            var renovation = docs.map(function (entity) {
                return entity;
            });
            res.json(renovation);
        });
});


module.exports = router;