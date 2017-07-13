import axios from 'axios';
import env from '../env'

//let apiServer = 'http://118.89.232.160:10001';
let apiServer = env.apiServer;

//广告机2 轮播图列表
export const getImgsList = params => { return axios.post(`${apiServer}/v10/a/goods/fold_dd/find_banner.json`, params).then(res => res.data); };
//广告机2 上传图片
export const updataimgs = params => { return axios.post(`${apiServer}/v10/a/goods/fold_dd/edit_banner.json`, params).then(res => res.data); };