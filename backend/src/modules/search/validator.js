`use strict`

import Joi from 'joi'

module.exports = {
    hashtagSearch: {
        path: {
            hashtag: Joi.string().required,
        },
        model: "hashtagSearch",
        group: "Search",
        description: "Search tweets by hashtag"
    },
}