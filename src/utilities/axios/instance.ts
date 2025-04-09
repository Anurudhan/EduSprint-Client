import axios from 'axios'
import { env } from '../../common/env';

export const BASE_URL = String(env.API_GATEWAY_URL);

  console.log(BASE_URL,"hee");
  

export const CLIENT_API = axios.create({
    baseURL: BASE_URL
})