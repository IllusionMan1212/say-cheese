const express = require('express');
const axios = require('axios');
const router = express.Router();
const { scrapeCheese, getCheeseOfDay, getCheeseInfo } = require(`${__dirname}/../../scraper/scraper`); //absolutely horrible :(
const { JSDOM } = require('jsdom');

const Cheese = require(`${__dirname}/../models/cheese`);

router.get('/cheese/random', (req, res) => {
    Cheese.nextCount((err, count) => {
        if (err) {
            res.status(500).json({ failed: true, status: 500, error: err });
            return;
        }

        if (count) {
            let random = Math.floor(Math.random() * (count + 1));
            Cheese.find({ id: random })
            .select('-_id')
            .select('-__v')
            .exec((err, cheese) => {
                if (err) {
                    res.status(500).json({ failed: true, status: 500, error: err });
                    return;
                }
                res.status(200).json({ failed: false, status: 200, cheese: cheese[0] });
            });
        }
    });
});

router.get('/cheese/search', (req, res) => {
    if (Object.keys(req.query).length == 0 || !req.query.q) {
        res.status(400).json({ failed: true, status: 400, error: "Invalid or incomplete request" });
        return;
    }

    let page = parseInt(req.query.page) || 1;
    let per_page = parseInt(req.query.per_page) || 10;
    
    if (req.query.by) {
        // TODO: either country, type, milk, texture or color, maybe some other shit
    }

    Cheese.find({ $text: { $search: req.query.q } })
    .select("-_id")
    .select("-__v")
    .limit(per_page)
    .skip((page - 1) * per_page)
    .exec((err, cheeses) => {
        if (err) {
            res.status(500).json({ failed: true, status: 500, error: err });
            return;
        }
        res.status(200).json({ failed: false, status: 200, cheeses: cheeses });
        return;
    });
    // res.status(400).json({ failed: true, status: 400, error: "Invalid or incomplete request" });
});

router.get('/cheese/today', async (req, res) => {
    const cheeseOfDay = await getCheeseOfDay();

    if (!cheeseOfDay.link) {
        res.status(500).json({ failed: true, status: 500, error: "An error occurred while getting your cheese of the day" });
        return;
    }

    const cheese_data = await getCheeseInfo(cheeseOfDay.link)
    res.status(cheese_data.status).json(cheese_data);
});

router.get('/cheese/alphabetical', (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let per_page = parseInt(req.query.per_page) || 10;

    if (per_page > 50) {
        per_page = 50;
    }

    if (req.query.letter) {
        Cheese.find({ name: { "$regex": "^" + req.query.letter, "$options": "i" } })
        .select("-_id")
        .select("-__v")
        .limit(per_page)
        .skip((page - 1) * per_page)
        .exec((err, cheeses) => {
            if (err) {
                res.status(500).json({ failed: true, status: 500, error: err });
                return;
            }

            res.status(200).json({ failed: false, status: 200, cheeses: cheeses });
        });
        return;
    }
    res.status(400).json({ failed: true, status: 400, error: "Invalid or incomplete request" });
});

router.get('/cheese/vegetarian', (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let per_page = parseInt(req.query.per_page) || 10;

    if (per_page > 50) {
        per_page = 50;
    }

    Cheese.find({ "attributes.vegetarian": true })
    .select('-_id')
    .select('-__v')
    .limit(per_page)
    .skip((page - 1) * per_page)
    .exec((err, cheeses) => {
        if (err) {
            res.status(500).json({ failed: true, status: 500, error: err });
            return;
        }
        res.status(200).json({ failed: false, status: 200, cheeses: cheeses });
    });
});

router.get("/cheese/scrape", async (req, res) => {

    scrapeCheese().then(_res => {
        for(const i of _res) {
            let new_cheese = new Cheese();
            new_cheese.name = i.cheese.cheese_name;
            new_cheese.link = i.cheese.link;
            new_cheese.image = i.cheese.image;
            new_cheese.description = i.cheese.description;
            new_cheese.attributes = i.cheese.attributes;
            new_cheese.country_codes = i.cheese.country_codes;
            new_cheese.milks = i.cheese.milks;
            new_cheese.save(err => {
                if (err) {
                    res.status(500).json({ failed: true, status: 500, error: err });
                    return;
                }
            });
        }

        res.status(200).json({ failed: false, status: 200, cheeses: _res });
    })
});

router.get('/cheese/:cheese', (req, res) => {
    // TODO: query the db
});

module.exports = router;
