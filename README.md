# Say Cheese
A RESTful api with over 1800 cheeses.

## Routes
---
| Route | Parameter | Description |
| --- | --- | --- |
| `/random` | None | Returns a random cheese from the db |
| `/search` | `q`, `page`, `per_page` | Search for cheeses by name |
| `/today` | None | Returns cheese of the day |
| `/alphabetical` | `l`, `page`, `per_page` | Find cheeses by their first letter |
| `/vegetarian` | `page`, `per_page` | Returns an array of all vegetarian cheeses |

#### Parameters
---
```
q        => The search query you want to perform. (required)
l        => The letter you want to display the cheeses for. (required)
page     => Pagination number. (default = 1)
per_page => Number of cheeses to display in a single page. (max = 50; default = 10)
```

## Example successful response
---
```json
{
    "failed": false,
    "status": "200",
    "cheese": {
        "country_codes": ["IT"],
        "milks": ["sheep"],
        "name": "Pecorino dei Malatesta al Sangiovese",
        "link": "https://cheese.com/pecorino-dei-malatesta-al-sangiovese/",
        "image": "https://cheese.com/media/img/icon-cheese-default.svg",
        "description": "Produced by Romaniae Terrae, Pecorino dei Malatesta al Sangiovese is an Italian cheese made with highly selected sheep's milk pasteurized at optimum temperature. Cheese wheels are first matured in a cold room at 6° - 8°C. Later, during the final stage of maturation they are treated with Sangiovese red wine and kept in a cold room at 8°C for about 30 days.The Sangiovese red wine gives the cheese a dark burgundy rind beneath which lies a smooth white paste with a delicate mouthfeel and a sweet sheep's milk flavour with an aftertaste of wine.",
        "attributes": {
            "made": "Made from pasteurized sheep's milk",
            "countries": ["Italy"],
            "region": "Emilia-Romagna",
            "family": "Pecorino",
            "types": ["semi-soft","artisan"],
            "fat": null,
            "calcium": null,
            "textures": ["smooth"],
            "rind": "natural",
            "color": "white",
            "flavors": ["acidic","smooth","subtle","sweet"],
            "aromas": ["pleasant"],
            "vegetarian": null,
            "producers": ["Romaniae Terrae"],
            "synonyms": [],
            "alternative_spellings": []
            },
        "id": 1273
    }
}
```

## Example Error response
---
```json
{
    "failed": true,
    "status": "400",
    "error": "Error message"
}
```

| Property | Description |
| --- | --- |
| `failed` | Whether the request failed or not (boolean) |
| `status` | HTTP status code |
| `cheese` | Cheese object |
| `id` | Unique cheese id |

#### status values
---
200 `OK`: The request was successful and that is returned. \
304 `Not Modified`: You already have the latest data. \
400 `Bad Request`: You submitted an invalid or incomplete request. \
404 `Not Found`: The requested data does not exist. \
500 `Internal Server Error`: Something went wrong on our end, please open an issue on the [github](https://github.com/illusionman1212/say-cheese/issues) if this persists.

#### country_codes values
---
`AF`= Afghanistan, \
`AL`= Albania, \
`AD`= Andorra, \
`AR`= Argentina, \
`AM`= Armenia, \
`AU`= Australia, \
`AT`= Austria, \
`AZ`= Azerbaijan, \
`BD`= Bangladesh, \
`BY`= Belarus, \
`BE`= Belgium, \
`BR`= Brazil, \
`BG`= Bulgaria, \
`CA`= Canada, \
`CL`= Chile, \
`CN`= China, \
`countries-throughout-world`= Other Countries, \
`HR`= Croatia, \
`CY`= Cyprus, \
`CZ`= Czech Republic, \
`DK`= Denmark, \
`eastern-mediterranean`= Eastern Mediterranean, \
`EG`= Egypt, \
`england`= England, \
`FI`= Finland, \
`FR`= France, \
`GE`= Georgia, \
`DE`= Germany, \
`great-britain`= Great Britain, \
`GR`= Greece, \
`holland`: Holland, \
`HU`= Hungary, \
`IS`= Iceland, \
`IN`= India, \
`IR`= Iran, \
`IQ`= Iraq, \
`IE`= Ireland, \
`IM`= Isle of man, \
`IL`= Israel, \
`IT`= Italy, \
`JP`= Japan, \
`JO`= Jordan, \
`LB`= Lebanon, \
`LT`= Lithuania, \
`MK`= Macedonia, \
`MR`= Mauritania, \
`MX`= Mexico, \
`mexico-and-caribbean`= Mexico and Caribbean, \
`middle-east`= Middle East", \
`MN`= Mongolia, \
`NP`= Nepal, \
`NL`= Netherlands, \
`NZ`= New zealand, \
`NO`= Norway, \
`PK`= Pakistan, \
`PS`= Palestine, \
`PL`= Poland, \
`PT`= Portugal, \
`RO`= Romania, \
`RU`= Russia, \
`scotland`= Scotland, \
`RS`= Serbia, \
`SK`= Slovakia, \
`ES`= Spain, \
`SZ`= Swaziland, \
`SE`= Sweden, \
`CH`= Switzerland", \
`SY`= Syria, \
`tibet`= Tibet, \
`TR`= Turkey, \
`UA`= Ukraine, \
`GB`= United Kingdom, \
`US`= United States, \
`wales`= Wales,

#### milks values
---
`buffalo`
`camel`
`cow`
`donkey`
`goat`
`mare`
`moose`
`reindeer`
`sheep`
`water-buffalo`
`yak`

#### types values
---
`artisan`
`blue-veined`
`fresh-soft`
`fresh-firm`
`soft`
`semi-soft`
`semi-hard`
`hard`
`semi-firm`
`firm`

#### textures values
---
`brittle`
`buttery`
`chalky`
`chewy`
`close`
`compact`
`creamy`
`crumbly`
`crystalline`
`dense`
`dry`
`elastic`
`firm`
`flaky`
`fluffy`
`grainy`
`oily`
`open`
`runny`
`semi-firm`
`smooth`
`soft`
`soft-ripened`
`spreadable`
`springy`
`sticky`
`stringy`
`supple`

#### color values
---
`blue`
`blue-grey`
`brown`
`brownish-yellow`
`cream`
`golden-orange`
`golden-yellow`
`green`
`ivory`
`orange`
`pale-white`
`pale-yellow`
`pink-and-white`
`red`
`straw`
`white`
`yellow`


## Notes about the returned data
---
- Any property that does not exist or has an undetermined value will default to `null`.
- Any array property that does not exist or has an undetermined value will be an empty array `[]`.

##### More routes are coming soon. If you have a route suggestion/request, please feel free to open an issue on the [github](https://github.com/illusionman1212/say-cheese/issues).