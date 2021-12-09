'use strict';

import { Strategy as JWTStrategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';

import { Admin } from './../models';
import config from './../config';

// Hooks the JWT Strategy.
const hookJWTStrategy = (passport) => {
  var options = {};

  options.secretOrKey = config.keys.secret;
  options.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  options.ignoreExpiration = false;

  passport.use(new JWTStrategy(options, function (JWTPayload, callback) {
    Admin.findOne({ where: { email: JWTPayload.username } })
      .then(function (user) {
        if (!user) {
          callback(null, false);
          return;
        }
        callback(null, user);
      });
  }));
}

export default (passport) => {

  // Hooks the JWT Strategy.
  hookJWTStrategy(passport);

};