import axios from 'axios';

const accessToken = localStorage.getItem('accessToken');

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

export default api;
