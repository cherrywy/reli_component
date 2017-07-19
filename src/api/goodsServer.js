import axios from 'axios';
import env from '../env'
import moment from 'moment';
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

export const requestList = (params) => { return axios.post(`${apiServer}/a/goods/list.json`, params).then(res => {
        const {error_code,result} = res.data;
        if (error_code !== 0){
            throw new Error('requst error');
        }
        const tableData = result.list.map(v=>{
            v.goods_created_at = moment(v.goods_created_at).format('YYYY/MM/DD');
            return v;
        });
        const {total_count} = result;
        return {
            tableData,
            total_count
        };
    })
};

export const requestRemove =params => { return axios.post(`${apiServer}/a/goods/remove.json`, params).then(res => res.data);};
export const requestUpdate =params => { return axios.post(`${apiServer}/a/goods/update.json`, params).then(res => res.data);};

export const requestHistoryNew =params => { return axios.post(`${apiServer}/a/search_history/new.json`, params).then(res => res.data);};

export const requestEdit =params => { return axios.post(`${apiServer}/a/goods/show.json`, params).then(res => res.data);};
export const requestOnline =params => { return axios.post(`${apiServer}/a/goods/online.json`, params).then(res => res.data);};
export const requestFindShop =params => { return axios.post(`${apiServer}/a/goods/find_shop_plan.json`, params).then(res => res.data);};
export const requestFindShopPlan =params => { return axios.post(`${apiServer}/a/shop_plan/find.json`, params).then(res => res.data);};
export const requestSearchSpec=params => { return axios.post(`${apiServer}/a/goods_spec/search.json`, params).then(res => res.data);};

export const requestOnlineShowCase=params => { return axios.post(`${apiServer}/a/online_goods/by_show_case.json`, params).then(res => res.data);};
export const requestPlanShowCaseList=params => { return axios.post(`${apiServer}/a/plan_show_case/list.json`, params).then(res => res.data);};
export const requestGoodsOnline=params => { return axios.post(`${apiServer}/a/goods/online.json`, params).then(res => res.data);};
export const requestGoodsOffline=params => { return axios.post(`${apiServer}/a/goods/offline.json`, params).then(res => res.data);};
export const requestDataImport = params => { 
     return axios({
        url:`${apiServer}/a/goods/sales.json`,
        method:'post',
        data:params,
        headers: {'Content-Type': 'multipart/form-data'}
    }).then(res => res.data);
};
export const requestGoodSpecProcess=params => { return axios.post(`${apiServer}/a/good_spec_tobe_process/find.json`, params).then(res => res.data);};
export const requestGoodSpecSearch=params => { return axios.post(`${apiServer}/a/goods_spec/search.json`, params).then(res => res.data);};
export const requestGoodSpecUpdate=params => { return axios.post(`${apiServer}/a/goods_spec/update.json`, params).then(res => res.data);};

export const requestGoodSpecRemove=params => { return axios.post(`${apiServer}/a/goods_spec_tobe_process/remove.json`, params).then(res => res.data);};