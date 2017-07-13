import axios from 'axios';

let url = 'http://118.89.232.160:10001';

export const requestSearchHistory = params => { return axios.post(`${url}/a/search_history/find.json`, params).then(res => res.data);};

export const requestNew= params => { return axios.post(`${url}/a/goods/new.json`, params).then(res => res.data);};
export const requestBrand= params => { return axios.post(`${url}/a/brand/new.json`, params).then(res => res.data);};
export const requestBrandHistory= params => { return axios.post(`${url}/a/brand/find.json`, params).then(res => res.data);};
export const requestUpload = params => { 
     return axios({
        url:`${url}/util/file/upload.json`,
        method:'post',
        data:params,
        headers: {'Content-Type': 'multipart/form-data'}
    }).then(res => res.data);
};

export const requestList =params => { return axios.post(`${url}/a/goods/list.json`, params).then(res => res.data);};
export const requestRemove =params => { return axios.post(`${url}/a/goods/remove.json`, params).then(res => res.data);};