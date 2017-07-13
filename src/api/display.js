import axios from 'axios';
import env from '../env'

//let apiServer = 'http://118.89.232.160:10001';
let apiServer = env.apiServer;

//广告机2 轮播图列表
export const getImgsList = params => { return axios.post(`${apiServer}/v10/a/goods/fold_dd/find_banner.json`, params).then(res => res.data); };
//广告机2 上传图片
export const updataimgs = params => { return axios.post(`${apiServer}/v10/a/goods/fold_dd/edit_banner.json`, params).then(res => res.data); };
//广告机2 视频图列表
export const updatavideo = params => { return axios.post(`${apiServer}/v10/a/goods/fold_dd/find_video.json`, params).then(res => res.data); };

export const requestUpload = params => { 
     return axios({
        url:`${url}/util/file/upload.json`,
        method:'post',
        data:params,
        headers: {'Content-Type': 'multipart/form-data'}
    }).then(res => res.data);
};