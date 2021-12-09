import { hashSync } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import config from '../config';
import { failedJson, successJson, comparePasswords } from '../helper/utils';
import { validParamsNext } from '../helper/routeHelper';
import { Admin } from '../models';
import { body } from 'express-validator';

// Register a admin.
export const adminSignUp = [[
  body('name').isLength({ min: 5 }).withMessage('must be at least 5 chars long'),
  body('email').isEmail().withMessage('Invalid Email'),
  body('pwd').isLength({ min: 5 }).withMessage('must be at least 5 chars long'),
], validParamsNext, (req, res) => {
  Admin.findOne({ where: { email: req.body.email } }).then((u) => {
    if (u) {
      failedJson(req, res, "User already exists!")
    } else {
      const newUser = {
        email: req.body.email,
        pwd: hashSync(req.body.pwd, 8),
        name: req.body.name,
      }
      return Admin.create(newUser).then(function () {
        successJson(req, res.status(201), { message: 'Account created!' })
      })
    }
  }).catch((err) => {
    failedJson(req, res, "Something went wrong")
  })
}]

// Authenticate a admin.
export const adminAuth = [[
  body('email').isEmail().withMessage('Invalid Email'),
  body('pwd').isLength({ min: 5 }).withMessage('must be at least 5 chars long'),
], validParamsNext, (req, res) => {
  const email = req.body.email,
    password = req.body.pwd,
    potentialUser = { where: { email } };
  Admin.findOne(potentialUser).then(function (user) {
    if (!user) {
      failedJson(req, res, 'User does not exist')
    } else {
      // console.log(user)
      comparePasswords(password, user.pwd, function (error, isMatch) {
        if (isMatch && !error) {
          var token = sign(
            { username: user.email },
            config.keys.secret,
            { expiresIn: '43200m' }
          );
          const ret = {
            id: user.id,
            email: user.email,
            name: user.name,
            token: 'JWT ' + token
          }
          successJson(req, res, ret)
        } else {
          failedJson(req, res, 'Credential Incorrect!')
        }
      });
    }
  }).catch(function (error) {
    failedJson(req, res.status(500), 'There was an error!', error)
  });
}]
