import { clearUser } from '../helper';

export const userService = {
  login,
  logout,
};

async function login(email, pwd) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, pwd })
  };

  const response = await fetch(`/api/v1/admin/login`, requestOptions);
  const user = await handleResponse(response);
  // store user details and jwt token in local storage to keep user logged in between page refreshes
  localStorage.setItem('user', JSON.stringify(user));
  return user;
}

function logout() {
  clearUser();
  location.reload(true);
}

function handleResponse(response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        clearUser();
        location.reload(true);
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }
    if (data.success) {
      return data.data;
    } else {
      const error = (data && {
        message: data.message,
        error: data.error
      }) || {
        message: response.statusText
      };
      return Promise.reject(error);
    }
  });
}