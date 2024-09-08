import axios from 'axios';

let host = process.env.REACT_APP_API_PROJECTS;
let token = localStorage.getItem('token')
  ? localStorage.getItem('token')
  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbGxvd2luZ1BvbGljaWVzIjpbInByb2plY3RzOnByb2plY3RzOioiXSwiZGVueWluZ1BvbGljaWVzIjpbXSwiX2lkIjoiNjJjZWI3NGQ1ZWNiODMwODFkNzUxY2UwIiwiaWF0IjoxNjU4MTQ0OTk0LCJleHAiOjE2NTgyMzEzOTR9.pblvR9lhLuHpBDN1knh9KETZ3kQqHdcZzuxg7jxcRCQ';

export default axios.create({
  baseURL: host,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: 'Bearer ' + token
  }
});
