const axios = require("axios");
const { JSDOM } = require("jsdom");

let country_codes_map = {
    AF: "afghanistan",
    AL: "albania",
    AD: "andorra",
    AR: "argentina",
    AM: "armenia",
    AU: "australia",
    AT: "austria",
    AZ: "azerbaijan",
    BD: "bangladesh",
    BY: "belarus",
    BE: "belgium",
    BR: "brazil",
    BG: "bulgaria",
    CA: "canada",
    CL: "chile",
    CN: "china",
    "countries-throughout-world": "countries throughout the world",
    HR: "croatia",
    CY: "cyprus",
    CZ: "czech republic",
    DK: "denmark",
    "eastern-mediterranean": "eastern mediterranean",
    EG: "egypt",
    england: "england",
    FI: "finland",
    FR: "france",
    GE: "georgia",
    DE: "germany",
    "great-britain": "great britain",
    GR: "greece",
    holland: "holland",
    HU: "hungary",
    IS: "iceland",
    IN: "india",
    IR: "iran",
    IQ: "iraq",
    IE: "ireland",
    IM: "isle of man",
    IL: "israel",
    IT: "italy",
    JP: "japan",
    JO: "jordan",
    LB: "lebanon",
    LT: "lithuania",
    MK: "macedonia",
    MR: "mauritania",
    MX: "mexico",
    "mexico-and-caribbean": "mexico and caribbean",
    "middle-east": "middle east",
    MN: "mongolia",
    NP: "nepal",
    NL: "netherlands",
    NZ: "new zealand",
    NO: "norway",
    PK: "pakistan",
    PS: "palestine",
    PL: "poland",
    PT: "portugal",
    RO: "romania",
    RU: "russia",
    scotland: "scotland",
    RS: "serbia",
    SK: "slovakia",
    ES: "spain",
    SZ: "swaziland",
    SE: "sweden",
    CH: "switzerland",
    SY: "syria",
    tibet: "tibet",
    TR: "turkey",
    UA: "ukraine",
    GB: "united kingdom",
    US: "united states",
    wales: "wales",
};

async function getCheeseInfo(link) {
    return axios
        .get(link)
        .then((response) => {
            const dom = new JSDOM(response.data);
            const { document } = dom.window;
            // absolutely horridly long, jesus
            const attrib_arr = Array.from(document.getElementsByClassName("summary-points")[0].getElementsByTagName("p"));
            const attribs = {
                made: null,
                countries: [], // "and" ","
                region: null,
                family: null,
                types: [], // ,
                fat: null,
                calcium: null,
                textures: [], // "and" ","
                rind: null,
                color: null,
                flavors: [], // ,
                aromas: [], // ,
                vegetarian: null,
                producers: [], // ,
                synonyms: [], // ,
                alternative_spellings: [], // ,
            };

            let milks = [];
            let country_codes = [];
            for (let attrib of attrib_arr) {
                if (attrib.textContent.includes("Made from")) {
                    attribs.made = attrib.textContent.trim();
                    arr = attrib.getElementsByTagName("a");
                    for (let i = 0; i < arr.length; i++) {
                        milks[i] = arr[i].textContent.toLowerCase().replace(/\s/g, "-");
                    }
                } else if (attrib.textContent.includes("Country of origin")) {
                    attribs.countries = Array.from(
                        attrib.querySelectorAll("a")
                    ).map((elem) => {
                        country_codes.push(Object.keys(country_codes_map).find((key) => country_codes_map[key] == elem.textContent.toLowerCase().trim()));
                        return elem.textContent.trim();
                    });
                } else if (attrib.textContent.includes("Region")) {
                    attribs.region = attrib.textContent.split(":")[1].trim();
                } else if (attrib.textContent.includes("Family")) {
                    attribs.family = attrib.textContent.split(":")[1].trim();
                } else if (attrib.textContent.includes("Type")) {
                    attribs.types = attrib.textContent
                        .split(":")[1]
                        .split(",")
                        .map((elem) => elem.trim().replace(/\s/g, "-"));
                } else if (attrib.textContent.includes("Fat")) {
                    attribs.fat = attrib.textContent.split(":")[1].trim();
                } else if (attrib.textContent.includes("Calcium")) {
                    attribs.calcium = attrib.textContent.split(":")[1].trim();
                } else if (attrib.textContent.includes("Texture")) {
                    attribs.textures = attrib.textContent
                        .split(":")[1]
                        .split(/,|\band/g)
                        .map((elem) => elem.trim().replace(/\s/g, "-"));
                } else if (attrib.textContent.includes("Rind")) {
                    attribs.rind = attrib.textContent.split(":")[1].trim();
                } else if (attrib.textContent.includes("Colour")) {
                    attribs.color = attrib.textContent.split(":")[1]
                    .trim()
                    .replace(/\s/g, "-");
                } else if (attrib.textContent.includes("Flavour")) {
                    attribs.flavors = attrib.textContent
                        .split(":")[1]
                        .split(",")
                        .map((elem) => elem.trim());
                } else if (attrib.textContent.includes("Aroma")) {
                    attribs.aromas = attrib.textContent
                        .split(":")[1]
                        .split(",")
                        .map((elem) => elem.trim());
                } else if (attrib.textContent.includes("Vegetarian")) {
                    let veg = attrib.textContent.split(":")[1].trim();
                    attribs.vegetarian =
                        veg == "yes" ? true : veg == "no" ? false : veg;
                } else if (attrib.textContent.includes("Producers")) {
                    attribs.producers = attrib.textContent
                        .split(":")[1]
                        .split(",")
                        .map((elem) => elem.trim().replace("&#39;", "'"));
                } else if (attrib.textContent.includes("Synonyms")) {
                    attribs.synonyms = attrib.textContent
                        .split(":")[1]
                        .split(",")
                        .map((elem) => elem.trim());
                } else if (
                    attrib.textContent.includes("Alternative spellings")
                ) {
                    attribs.alternative_spellings = attrib.textContent
                        .split(":")[1]
                        .split(",")
                        .map((elem) => elem.trim());
                }
            }
            const p_arr = document.getElementsByClassName("description")[0].getElementsByTagName("p");
            let paragraphs = [];
            for (let i = 0; i < p_arr.length; i++) {
                if (p_arr[i].textContent.includes("This cheese is currently unavailable on official site")) {
                    continue;
                }
                paragraphs.push(p_arr[i].textContent);
            }
            let desc = paragraphs.join("");
            let cheese_name = document.getElementsByClassName("unit")[0].querySelector("h1").textContent.trim();
            let image = "https://cheese.com" + document.getElementsByClassName("cheese-image")[0].querySelector("img").src.replace(/\.\.\//, "/");

            return {
                failed: false,
                status: 200,
                cheese: {
                    name: cheese_name,
                    link: link,
                    image: image,
                    attributes: attribs,
                    description: desc,
                    country_codes: country_codes,
                    milks: milks,
                },
            };
        })
        .catch((err) => {
            return {
                failed: true,
                status: 500,
                error: err.message,
            };
        });
}

async function scrapeByLetter(letter) {
    //final container for our cheeses of <letter>
    let data = [];
    //response to get page count for letter
    let response = await axios.get(`https://cheese.com/alphabetical/?i=${letter}&per_page=100&page=1`);
    //dom rep to parse
    let dom = new JSDOM(response.data);
    //inst value for pages to iter over
    let pages = 1;
    //pseudodom
    let { document } = dom.window;
    //ul of id id_page
    let ul = document.getElementById("id_page");
    if (ul) {
        let li_arr = ul.getElementsByTagName("li");
        pages = parseInt(li_arr[li_arr.length - 1].textContent);
    }

    //iter over pages in <letter>
    for (let i = 1; i <= pages; i++) {
        //response of page
        let response = await axios.get(`https://cheese.com/alphabetical/?i=${letter}&per_page=100&page=${i}`);
        let dom = new JSDOM(response.data);
        let { document } = dom.window;

        //divs representing all the cheeses on the page
        let divs = document.getElementsByClassName("grid row")[0].getElementsByClassName("cheese-item");

        // iter over cheeses
        for (let div of divs) {
            let scraped_data = await getCheeseInfo(`https://cheese.com${div.querySelector("a").href}`);

            if (scraped_data.failed || !scraped_data) {
                continue;
            }
            data.push(scraped_data.cheese);
        }
    }

    return data;
}

async function scrapeCheese() {
    return new Promise((resolve) => {
        let a = [];

        for (let i = 0; i < 26; i++) {
            let letter = (i + 10).toString(36);
            a.push(scrapeByLetter(letter));
        }

        Promise.all(a).then((a) => {
            let merged = [].concat.apply([], a);
            resolve(merged);
        });
    });
}

async function getCheeseOfDay() {
    return axios
        .get("https://cheese.com")
        .then((response) => {
            const div = response.data.match(/<div id="cheese-of-day" class="text-center">[\w\W]+?<\/div>/);
            const dirty_link = div[0].match(/<a href=(.+)>/)[1];
            link = `https://cheese.com${dirty_link.substring(dirty_link.indexOf("/"), dirty_link.lastIndexOf("/"))}`;
            return {
                failed: false,
                status: 200,
                link: link,
            };
        })
        .catch((err) => {
            return {
                failed: true,
                status: 500,
                error: err.message,
            };
        });
}

module.exports = {
    scrapeCheese,
    getCheeseOfDay,
    getCheeseInfo,
};
