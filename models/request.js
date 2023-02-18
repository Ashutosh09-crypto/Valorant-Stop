const mongoose = require("mongoose");

const requestScheme = new mongoose.Schema(
    {

        username:
        {
            type: String,
            required: true,
        },
        email:
        {
            type: String,
            required: true,
        },
        country:
        {
            type: String,
            required: true,
        },
        gender:
        {
            type: String,
        }
        ,
        order:
        {
            type: String,
            required: true
        }
    }
);

module.exports = mongoose.model("requests", requestScheme);