import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../../../config';

'use strict';
require('mongoose-type-email');

const Users = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
    required: true,
  },
  userName: {
    type: String,
    maxlength: 15,
    required: true,
  },
  city: {
    type: String,
    maxlength: 30,
  },
  state: String,
  zipcode: {
    type: Number,
  },
  imageURL: {
    type: String,
    default: 'https://cdn2.iconfinder.com/data/icons/user-icon-2-1/100/user_5-15-512.png',
  },
  description: {
    type: String,
    maxlength: 160,
  },
  password: {
    type: String,
    minlength: 8,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  bookmarks: [mongoose.Types.ObjectId],
  followersCount: {
    type: Number,
    default: 0,
  },
  followingCount: {
    type: Number,
    default: 0,
  },
  views: [{
    date: {
      type: String,
    },
    count: {
      type: Number,
      default: 0,
    },
  }],
  jwtToken: [{
    token: {
      type: String,
    },
    date: {
      type: Date,
    },
  }],
  phone: {
    type: Number,
    min: 1000000000,
    max: 9999999999,
  },
  email: mongoose.SchemaTypes.Email,
  dateOfBirth: {
    type: String,
    required: true,
  },
}, { versionKey: false });

Users.pre('save', function preSave(next) {
  try {
    const user = this;
    if (!user.isModified('password')) {
      return next();
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(user.password, salt);
    user.password = hash;
    next(null);
  } catch (error) {
    next(error);
  }
});

Users.methods.validatePassword = function validatePassword(password) {
  const user = this;
  return new Promise((resolve) => {
    try {
      const isMatch = bcrypt.compareSync(password, user.password);
      resolve(isMatch);
    } catch (error) {
      resolve(false);
    }
  });
};

Users.methods.generateToken = function generateToken() {
  const user = this;

  return jwt.sign({
    id: user._id,
  }, config.token);
};

export default mongoose.model('users', Users);
