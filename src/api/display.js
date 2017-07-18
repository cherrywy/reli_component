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
//更换添加素材

export const changeDiaplay = params => { return axios.post(`${apiServer}/v10/a/goods/folder_dd/edit.json`, params).then(res => res.data); };
//绑定素材中选择商品
export const changeGoodsList = params => { return axios.post(`${apiServer}/v10/a/goods/list.json`, params).then(res => res.data); };
//批量上传商品
export const online_goods = params => { return axios.post(`${apiServer}/v10/c/folder_dd/batch_bind.json`, params).then(res => res.data); };
//获取门店的广告机列表(支持名称模糊搜索)#
export const search_goods = params => { return axios.post(`${apiServer}/v10/a/display_device/list.json`, params).then(res => res.data); };
export const goodstype = params => { return axios.post(`${apiServer}/a/search_history/find.json`, params).then(res => res.data); };
export const addstype = params => { return axios.post(`${apiServer}/a/search_history/new.json`, params).then(res => res.data); };
//查询商品信息
export const find_one_goods = params => { return axios.post(`${apiServer}/v10/c/folder_dd/find_one_goods.json`, params).then(res => res.data); };

//门店  广告机列表

export const display_list = params => { return axios.post(`${apiServer}/v10/a/display_device/list.json`, params).then(res => res.data); };
//获取商品信息
export const goodsImgs = params => { return axios.post(`${apiServer}/a/goods/show.json`, params).then(res => res.data); };
//广告机-查询已绑定折叠广告机轮播图
export const bind_id_Imgs = params => { return axios.post(`${apiServer}/v10/c/fold_dd/find_bind_banner.json`, params).then(res => res.data); };
//广告机 - 获取商品列表(包含搜索商品)
export const bind_id_goods = params => { return axios.post(`${apiServer}/v10/folder_dd/bind_goods_list.json`, params).then(res => res.data); };
//广告机-删除折叠广告机轮播图#

export const delete_id_goods = params => { return axios.post(`${apiServer}/v10/c/folder_dd/remove_goods.json`, params).then(res => res.data); };
//广告机-绑定折叠广告机轮播图#
export const bind_imgs = params => { return axios.post(`${apiServer}/v10/c/fold_dd/bind_banner.json`, params).then(res => res.data); };
//删除绑定轮播图
export const delete_bind_imgs = params => { return axios.post(`${apiServer}/v10/c/fold_dd/remove_banner.json`, params).then(res => res.data); };

/****-----------
 * ---
 * ------                               广告机1
 * ------
 * -------
 * ------------------*/
//广告机1 获取素材
export const getOneList = params => { return axios.post(`${apiServer}/v10/c/display_device/dd.json`, params).then(res => res.data); };
//广广告机 - 编辑默认广告 - 获取商品列表#

export const adgoodlist = params => { return axios.post(`${apiServer}/v10/def_dd/goods.json`, params).then(res => res.data); };
export const interactivead_list = params => { return axios.post(`${apiServer}/v10/int_dd/goods.json`, params).then(res => res.data); };

//删除默认
export const delete_defaultad = params => { return axios.post(`${apiServer}/v10/c/def_dd/remove.json`, params).then(res => res.data); };
//删除互动
export const delete_interactivead = params => { return axios.post(`${apiServer}/v10/c/int_dd/remove.json`, params).then(res => res.data); };


//首页 获取所有门店的平面图信息#
export const shop_imgs = params => { return axios.post(`${apiServer}/head_office/shop/find_plan.json`, params).then(res => res.data); };

