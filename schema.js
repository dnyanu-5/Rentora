const Joi = require('joi');
const reviews = require('./datamodels/review');
module.exports.listingSchema = Joi.object({
    listings: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        img: Joi.string().allow("", null),
    }).required(),
});

module.exports.reviewsSchema = Joi.object({
    reviews: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
});
