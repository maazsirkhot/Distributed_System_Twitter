import Joi from 'joi';

'use strict';

module.exports = {
  hashtagSearch: {
    path: {
      hashtag: Joi.string().required,
    },
    model: 'hashtagSearch',
    group: 'Search',
    description: 'Search tweets by hashtag',
  },
  fetchProfile: {
    path: {
      userId: Joi.string().required(),
    },
    header: {
      authorization: Joi.string().required(),
    },
    model: 'fetchProfile',
    group: 'Search',
    description: 'Fetch user profile details based on userid and increase the view count of it',
  },
};
