import axios from "axios";
import conf from '../../server/config.json';

export default axios.create({
  baseURL: conf.APIBaseURL,
  timeout: 10000
});
