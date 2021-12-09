import { compare } from 'bcrypt';

// Compares two passwords.
export const comparePasswords = (password, encryped_password, callback) => {
  compare(password, encryped_password, function (error, isMatch) {
    if (error) {
      return callback(error);
    }
    return callback(null, isMatch);
  })
}

// respond data prototype
const sendJson = (req, res, success, data, message, error) => {
  res.json({
    success: success,
    data: data,
    message: message,
    error: error
  })
}

export const successJson = (req, res, data, message) => {
  sendJson(req, res, true, data, message)
}

export const failedJson = (req, res, message, error) => {
  sendJson(req, res, false, null, message, error)
}

export const invalidParamJson = (req, res) => {
  sendJson(req, res, false, null, 'Invalid Params!!')
}

export const authFailedJson = (req, res) => {
  sendJson(req, res.status(401), false, null, 'Authentication failed')
}
