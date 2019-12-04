import passport from 'passport';
import mongoose from 'mongoose';
import Users from '../models/mongoDB/users';
import config from '../../config';

'use strict';

const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.token;
// console.log("opts", opts.jwtFromRequest)
passport.use(new JwtStrategy(opts, ((jwt_payload, done) => {
  (async () => {
    // console.log("opts.jwtFromRequest", opts.jwtFromRequest)
    // console.log("jwt_payloaksjdad.id", jwt_payload.id)
    const user = await Users.findById(mongoose.Types.ObjectId(jwt_payload.id));
    // console.log(user)
    if (user) {
      return done(null, true);
    }
    return done(null, false);
  })();
})));
