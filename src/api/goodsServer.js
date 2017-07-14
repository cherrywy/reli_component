import axios from 'axios';
import env from '../env'
let apiServer = env.apiServer;

export const requestSearchHistory = params => { return axios.post(`${apiServer}/a/search_history/find.json`, params).then(res => res.data);};

export const requestNew= params => { return axios.post(`${apiServer}/a/goods/new.json`, params).then(res => res.data);};
export const requestBrand= params => { return axios.post(`${apiServer}/a/brand/new.json`, params).then(res => res.data);};
export const requestBrandHistory= params => { return axios.post(`${apiServer}/a/brand/find.json`, params).then(res => res.data);};
export const requestUpload = params => { 
     return axios({
        url:`${apiServer}/util/file/upload.json`,
        method:'post',
        data:params,
        headers: {'Content-Type': 'multipart/form-data'}
    }).then(res => res.data);
};

export const requestList =params => { return axios.post(`${apiServer}/a/goods/list.json`, params).then(res => res.data);};
export const requestRemove =params => { return axios.post(`${apiServer}/a/goods/remove.json`, params).then(res => res.data);};

export const requestUpdate =params => { return axios.post(`${apiServer}/a/goods/update.json`, params).then(res => res.data);};
export const requestEdit =params => { return axios.post(`${apiServer}/a/goods/show.json`, params).then(res => res.data);};