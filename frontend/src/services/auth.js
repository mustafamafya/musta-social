import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1/';

export const registerUser = (data) => axios.post(`${API_BASE_URL}register/`, data);
export const loginUser = (data) => axios.post(`${API_BASE_URL}login/`, data);