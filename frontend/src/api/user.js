import axios from 'axios';

export async function getUserInfo(token) {
  const res = await axios.get('http://localhost:8000/api/v1/user-info/', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}