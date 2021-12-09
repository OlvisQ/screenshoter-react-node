import { failedJson } from './utils';
import { validationResult } from 'express-validator';

const requireUrl = [
  '/admin/login',
  '/admin/register',
];

export function findUrl(reqUrl) {
  var result = false;
  requireUrl.forEach(element => {
    if (reqUrl == element)
      result = true;
  });
  return result;
}

export function validParamsNext(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    failedJson(req, res.status(200), 'Invalid params', errors.mapped());
  else
    next();
}

export function allowOnly(accessLevel, callback) {
  function checkUserRole(req, res) {
    if (!(accessLevel & req.user.role)) {
      res.sendStatus(403);
      return;
    }
    callback(req, res);
  }
  return checkUserRole;
}
