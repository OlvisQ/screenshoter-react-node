export function clearUser() {
  // remove user from local storage to log user out
  localStorage.removeItem('user');
}

export function authHeader() {
  // return authorization header with jwt token
  let user = JSON.parse(localStorage.getItem('user'));

  if (user && user.token) {
    return { 'Authorization': user.token };
  } else {
    return {};
  }
}