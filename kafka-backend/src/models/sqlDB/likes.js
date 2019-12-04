import Sequelize from 'sequelize';

'use strict';

module.exports = function (sequelize) {
  const Like = sequelize.define('likes', {
    tweetId: {
      type: Sequelize.STRING,
      required: true,
    },
    userId: {
      type: Sequelize.STRING,
      required: true,
    },
  });

  // force: true will drop the table if it already exists
  Like.sync({
    force: false,
  }).then(() => true);
  return Like;
};
