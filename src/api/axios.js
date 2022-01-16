import axios from 'axios';

const api = axios.create({
  baseURL: 'https://whispering-wave-44588.herokuapp.com/api',
});

export default api;
