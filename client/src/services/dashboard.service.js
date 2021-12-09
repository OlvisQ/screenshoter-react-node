import { clearUser, authHeader } from '../helper';

export const dashboardService = {
  get,
};

async function get() {
  const requestOptions = {
    method: 'GET',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
  };

  const response = await fetch(`/api/v1/admin/screens`, requestOptions);
  const data = await handleResponse(response);
  return data;
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
    return data;
  });
}