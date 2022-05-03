import axios from "axios";
import { APIBaseURL } from '../server/config.json';

export default axios.create({
  baseURL: APIBaseURL,
  timeout: 10000
});
