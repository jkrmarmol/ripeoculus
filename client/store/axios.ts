import axios from 'axios';

console.log(process.env.SERVER_URI);

export default axios.create({
  baseURL: process.env.SERVER_URI
});
