import axios from 'axios'

const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'

export const BASE_URL = isDevelopment 
  ? "http://localhost:5000"
  : ""

  console.log(BASE_URL,"hee");
  

export const CLIENT_API = axios.create({
    baseURL: BASE_URL
    
})