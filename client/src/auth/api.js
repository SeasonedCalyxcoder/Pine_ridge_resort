import axios from 'axios';

export function authRequest(method, url, data = null) {
  const token = localStorage.getItem('token');
  return axios({
    method,
    url,
    data,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}
