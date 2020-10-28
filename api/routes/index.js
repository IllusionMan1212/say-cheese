const express = require('express');
const axios = require('axios');
const router = express.Router();
const scraper = require(`${__dirname}/../../scraper/scraper`);
const { JSDOM } = require('jsdom');

const Cheese = require(`${__dirname}/../models/cheese`);

router.get('/cheese', (req, res) => {
    // TODO: no idea
});

router.get('/cheese/search', (req, res) => {
    if (Object.keys(req.query).length == 0 || !req.query.q) {
        res.status(400).json({ failed: true, status: 400, error: "Invalid or incomplete request" });
        return;
    }
    if (req.query.q) {
        // TODO: yes
    }
    if (req.query.by) {
        // TODO: either country, type, milk, texture or color, maybe some other shit
    }
    if (req.query.per_page) {
        // TODO: default to 20
    }
    if (req.query.page) {
        // TODO: default to 1
    }
    res.status(400).json({ failed: true, status: 400, error: "Invalid or incomplete request" });
});

router.get('/cheese/today', async (req, res) => {
    const cheeseOfDay = await scraper.getCheeseOfDay();

    if (!cheeseOfDay.link) {
        res.status(500).json({ failed: true, status: 500, error: "An error occurred while getting your cheese of the day" });
        return;
    }

    const cheese_data = await scraper.getCheeseInfo(cheeseOfDay.link)
    res.status(cheese_data.status).json(cheese_data);
});

router.get('/cheese/alphabetical', (req, res) => {// TODO: maybe use query strings, still haven't thought it out
    // TODO: do custom per_page when using a db
    let page = req.query.page || 1;
    let per_page = req.query.per_page || 20;
    if (req.query.letter) {
        // TODO: query the db
        return;
    }
    res.status(400).json({ failed: true, status: 400, error: "Invalid or incomplete request" });
});

router.get('/cheese/vegetarian', (req, res) => {// TODO: maybe use query strings, still haven't thought it out
    // TODO: fucking vegetarians making my life harder.
});

router.get("/cheese/scrape", async (req, res) => {
    let pages = 1;
    let all_cheeses = [];
    for (let l = 0; l < 26; l++) {
        let letter = (l + 10).toString(36);
        let response = await axios.get(`https://cheese.com/alphabetical/?i=${letter}&per_page=100&page=1`);
        const dom = new JSDOM(response.data);
        const { document } = dom.window;
        const ul = document.getElementById("id_page");
        if (ul) {
            let li_arr = ul.getElementsByTagName("li");
            pages = li_arr[li_arr.length - 1].textContent;
        }
        for (let i = 1; i <= pages; i++) {
            let response = await axios.get(`https://cheese.com/alphabetical/?i=${letter}&per_page=100&page=${i}`)
            const dom = new JSDOM(response.data);
            const { document } = dom.window;
            const divs = document.getElementsByClassName("grid row")[0].getElementsByClassName("cheese-item");
            for (let div of divs) {
                let scraped_data = await scraper.getCheeseInfo(`https://cheese.com${div.querySelector("a").href}`);
                all_cheeses.push(scraped_data.cheese);
                console.log(scraped_data);
                if (scraped_data.failed) {
                    console.log(scraped_data.error);
                    return;
                }
                await new Promise((resolve, reject) => {
                    Cheese.find({}, null, { sort: { id: 1 } }, (err, cheeses) => {
                    let new_cheese = new Cheese();
                    if (err) {
                        reject();
                        // NOTE: no idea if the status will even be hit
                        res.status(500).json({ failed: true, status: 500, error: err });
                        return;
                    }
                    
                    console.log(cheeses.length + 1);
                    new_cheese.id = cheeses.length + 1;
                    new_cheese.name = scraped_data.cheese.cheese_name;
                    new_cheese.link = scraped_data.cheese.link;
                    new_cheese.image = scraped_data.cheese.image;
                    new_cheese.description = scraped_data.cheese.description;
                    new_cheese.attributes = scraped_data.cheese.attributes;
                    new_cheese.types = scraped_data.cheese.types;
                    new_cheese.countries = scraped_data.cheese.countries;
                    new_cheese.milks = scraped_data.cheese.milks;
                    new_cheese.textures = scraped_data.cheese.textures;
                    new_cheese.colors = scraped_data.cheese.colors;
                    new_cheese.save(err => {
                        if (err) {
                            reject();
                            // NOTE: ditto
                            res.status(500).json({ failed: true, status: 500, error: err });
                            return;
                        }
                    });
                    resolve();
                });});
            }
        }
    }
    res.status(200).json({ failed: false, status: 200, cheeses: all_cheeses });
});

router.get('/cheese/:cheese', (req, res) => {
    // TODO: query the db
});

module.exports = router;
