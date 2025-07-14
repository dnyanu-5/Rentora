const Joi = require('joi');

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

// module.exports.userSchema = Joi.object({
//   username: Joi.string().required(),
//   password: Joi.string()
//     .min(8)
//     .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?#&])[A-Za-z\\d@$!%*?#&]{8,}$"))
//     .required()
//     .messages({
//       "string.pattern.base": "Password must include uppercase, lowercase, number, and special character.",
//     }),
// });
