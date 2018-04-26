var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');

const dbPath = '../db';

/* GET home page. */
router.get('/', function (req, res, next) {
    res.send('Api is live.');
});

const getDBPath = (table) => {
    return path.join(__dirname, dbPath, `${table}.json`)
}

/**
 * Generate ID.
 */
const genID = (length = 25) => {
    let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '';
    for (let i = 0; i < chars.length; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
};

/**
 * Get all data from JSON file.
 */
router.get('/:table', function (req, res, next) {
    // console.log(genID());
    // console.log(path.join(dbPath, `${req.params.table}.json`));
    // console.log(getDBPath(req.params.table));
    fs.readFile(
        getDBPath(req.params.table),
        'utf-8',
        (err, jsonData) => {
            if (err) {
                // console.error(err);
                return res.sendStatus(404);
                // return res.json({error: 'Entity not found'});
            }
            res.send(jsonData);
        });
});

/**
 * Get specified object from the JSON file.
 */
router.get('/:table/:id', function (req, res, next) {
    fs.readFile(
        getDBPath(req.params.table, req.params.id),
        'utf-8',
        (err, jsonData) => {
            if (err) {
                return res.sendStatus(404);
            }
            // TODO: find entity by _id. -> Id alapján kell visszaküldeni.
            res.send(jsonData);
        });
});


/**
 * Create object in JSON array.
 */
router.post('/:table', function (req, res, next) {
    const filePath = getDBPath(req.params.table);
    fs.readFile(
        filePath,
        'utf-8',
        (err, jsonData) => {
            if (err) {
                return res.sendStatus(404);
            }
            jsonData = JSON.parse(jsonData);
            req.body._id = genID();
            jsonData.push(req.body);

            fs.writeFileSync(filePath, JSON.stringify(jsonData), 'utf-8');
            res.json(req.body);
        });
});

module.exports = router;