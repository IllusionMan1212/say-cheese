const mongoose = require("mongoose");
// const autoIncrement = require('mongoose-auto-increment');

const cheeseSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    attributes: {
        type: Object,
        required: true,
        made: {
            type: String,
            required: true,
        },
        countries: [{
            type: String,
            required: true,
        }],
        types: [{
            type: String,
            required: true,
        }],
        fat: {
            type: String,
            required: true,
        },
        calcium: {
            type: String,
            required: true,
        },
        textures: [{
            type: String,
            required: true,
        }],
        rind: {
            type: String,
            required: true,
        },
        color: {
            type: String,
            required: true,
        },
        flavors: [{
            type: String,
            required: true,
        }],
        aromas: [{
            type: String,
            required: true,
        }],
        vegetarian: {
            type: Boolean,
            required: true,
        },
        producers: [{
            type: String,
            required: true,
        }],
        synonyms: [{
            type: String,
            required: true,
        }],
        alternative_spellings: [{
            type: String,
            required: true,
        }],
    },
    description: {
        type: String,
        required: true,
    },
    country_codes: [{
        type: String,
        required: true,
    }],
    milks: [{
        type: String,
        required: true,
    }],
});

// cheeseSchema.index({ name: "text" });

// cheeseSchema.plugin(autoIncrement.plugin, {
//     model: "cheese",
//     field: "id"
// });

// module.exports = mongoose.model("cheese", cheeseSchema);