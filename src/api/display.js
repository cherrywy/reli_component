import axios from 'axios';
import env from '../env'

//let apiServer = 'http://118.89.232.160:10001';
let apiServer = env.apiServer;
//获取门店
export const getShop = params => { return axios.post(`${apiServer}/a/shop/list.json`, params).then(res => res.data); };
//查询所有广告机轮播图
export const allPic_imgs = params => { return axios.post(`${apiServer}/v10_c_fold_dd_all_banner.json`, params).then(res => res.data); };
//广告机2 轮播图列表
export const getImgsList = params => { return axios.post(`${apiServer}/v10/a/goods/fold_dd/find_banner.json`, params).then(res => res.data); };
//广告机2 上传图片
export const updataimgs = params => { return axios.post(`${apiServer}/v10/a/goods/fold_dd/edit_banner.json`, params).then(res => res.data); };
//广告机2 删除轮播图

export const deleteimgs = params => { return axios.post(`${apiServer}/v10/a/goods/fold_dd/remove_banner.json`, params).then(res => res.data); };
//广告机2 视频图列表
export const updatavideo = params => { return axios.post(`${apiServer}/v10/a/goods/fold_dd/find_video.json`, params).then(res => res.data); };
// 上传文件
export const requestUpload = params => { 
     return axios({
        url:`${url}/util/file/upload.json`,
        method:'post',
        data:params,
        headers: {'Content-Type': 'multipart/form-data'}
    }).then(res => res.data);
};
//广告机管理 广告机2
export const carouselImgs = params => { return axios.post(`${apiServer}/v10_c_fold_dd_all_banner.json`, params).then(res => res.data); };

//广告机管理 广告机2 删除绑定商品
export const deleteVideo = params => { return axios.post(`${apiServer}/v10/c/folder_dd/remove_goods.json`, params).then(res => res.data); };

//广告机管理 广告机2 解除绑定商品
export const deleteBindGoods = params => { return axios.post(`${apiServer}/v10/a/goods/fold_dd/remove_video.json`, params).then(res => res.data); };

//绑定素材中选择商品
export const changeGoodsList = params => { return axios.post(`${apiServer}/v10/a/goods/list.json`, params).then(res => res.data); };


//门店  广告机列表

export const display_list = params => { return axios.post(`${apiServer}/v10/a/display_device/list.json`, params).then(res => res.data); };