import { userConstants } from '../constants';
import { userService } from '../../services';

export const userActions = {
  login,
  logout,
};

function login(email, password, callback) {
  return dispatch => {
    dispatch(request());
    userService.login(email, password)
      .then(
        user => {
          dispatch(success(user));
          callback({ user });
        },
        error => {
          dispatch(failure(error));
          callback({ error });
        }
      );
  };

  function request() { return { type: userConstants.LOGIN_REQUEST } }
  function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
  function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function logout() {
  userService.logout();
  return { type: userConstants.LOGOUT };
}
