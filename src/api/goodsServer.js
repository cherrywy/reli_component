import axios from 'axios'
import env from '../env'
import moment from 'moment'
let apiServer = env.apiServer
    // 获取品牌类目，规格，规格值，模糊搜索
export const requestSearchHistory = params => {
        return axios.post(`${apiServer}/a/search_history/find.json`, params).then(res => {
            const { error_code, result } = res.data
            if (error_code !== 0) {
                throw new Error('requst error')
            }
            let data = {}
            if (params.type == 0) {
                data.bigcategory = result.map(v => {
                    return {
                        value: v
                    }
                })
            }
            if (params.type == 1) {
                data.smallcategory = result.map(v => {
                    return {
                        value: v
                    }
                })
            }
            if (params.type == 2) {
                data.sku = result.map(v => {
                    return {
                        value: v
                    }
                })
            }
            if (params.type == 3) {
                data.skuValue = result.map(v => {
                    return {
                        value: v
                    }
                })
            }

            return data
        })
    }
    // 商品创建保存事件
export const requestNew = params => {
        return axios.post(`${apiServer}/a/goods/new.json`, params).then(res => res.data)
    }
    // 通过name创建品牌ID
export const requestBrand = params => {
        return axios.post(`${apiServer}/a/brand/new.json`, params).then(res => {
            const { error_code, result } = res.data
            if (error_code !== 0) {
                throw new Error('requst error')
            }
            const brand = result
            return {
                brand
            }
        })
    }
    // 品牌模糊搜索
export const requestBrandHistory = params => {
    return axios.post(`${apiServer}/a/brand/find.json`, params).then(res => {
        const { error_code, result } = res.data
        if (error_code !== 0) {
            throw new Error('requst error')
        }
        const brand = result.list
        return {
            brand
        }
    })
}
export const requestUpload = params => {
        return axios({
            url: `${apiServer}/util/file/upload.json`,
            method: 'post',
            data: params,
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(res => res.data)
    }
    // 获取商品管理列表
export const requestList = (params) => {
    return axios.post(`${apiServer}/a/goods/list.json`, params).then(res => {
        const { error_code, result } = res.data
        if (error_code !== 0) {
            throw new Error('requst error')
        }
        const tableData = result.list.map(v => {
            v.goods_created_at = moment(v.goods_created_at).format('YYYY/MM/DD')
            return v
        })
        const { total_count } = result
        return {
            tableData,
            total_count
        }
    })
}

export const requestRemove = params => {
    return axios.post(`${apiServer}/a/goods/remove.json`, params).then(res => res.data)
}
export const requestUpdate = params => {
    return axios.post(`${apiServer}/a/goods/update.json`, params).then(res => res.data)
}

export const requestHistoryNew = params => {
        return axios.post(`${apiServer}/a/search_history/new.json`, params).then(res => res.data)
    }
    // 编辑数据带回
export const requestEdit = params => {
    return axios.post(`${apiServer}/a/goods/show.json`, params).then(res => {

        const { error_code, result } = res.data
        if (error_code !== 0) {
            throw new Error('requst error')
        }
        const brand_name = result.list.goods_brand_name ? result.list.goods_brand_name : ''
        const small_category = result.list.goods_small_category ? result.list.goods_small_category : ''
        const big_category = result.list.goods_big_category ? result.list.goods_big_category : ''
        const name = result.list.goods_name ? result.list.goods_name : ''
        const imageUrl = result.list.goods_title_pics ? result.list.goods_title_pics : ''
        const specs = getSpecsResult(result.list) ? getSpecsResult(result.list) : []
        return {
            brand_name,
            small_category,
            big_category,
            name,
            imageUrl,
            specs
        }
    })
}
export const requestOnline = params => {
        return axios.post(`${apiServer}/a/goods/online.json`, params).then(res => res.data)
    }
    // 获取门店
export const requestFindShop = params => {
        return axios.post(`${apiServer}/a/goods/find_shop_plan.json`, params).then(res => {
            const { error_code, result } = res.data
            if (error_code !== 0) {
                throw new Error('requst error')
            }
            const shop = result.map(v => {
                return {
                    value: v.shop,
                    id: v.id

                }
            })
            return {
                shop
            }
        })
    }
    // 获取门店布局
export const requestFindShopPlan = params => {
    return axios.post(`${apiServer}/a/shop_plan/find.json`, params).then(res => {
        const { error_code, result } = res.data
        if (error_code !== 0) {
            throw new Error('requst error')
        }
        const shopPlan = result.map(v => {
            return {
                value: v.name,
                id: v.id
            }
        })
        return {
            shopPlan
        }
    })
}
export const requestSearchSpec = params => {
    return axios.post(`${apiServer}/a/goods_spec/search.json`, params).then(res => {
        const { error_code, result } = res.data
        if (error_code !== 0) {
            throw new Error('requst error')
        }

        const tableOnlineList = result
        return {
            tableOnlineList
        }
    })
}

export const requestOnlineShowCase = params => {
        return axios.post(`${apiServer}/a/online_goods/by_show_case.json`, params).then(res => {
            const { error_code, result } = res.data
            if (error_code !== 0) {
                throw new Error('requst error')
            }
            const onlineShowCaseList = result
            return {
                onlineShowCaseList
            }
        })
    }
    // 根据布局图展示展柜
export const requestPlanShowCaseList = params => {
    return axios.post(`${apiServer}/a/plan_show_case/list.json`, params).then(res => {
        const { error_code, result, total_count } = res.data
        if (error_code !== 0) {
            throw new Error('requst error')
        }
        const planShowCase = result
        const planShowCaseNumber = total_count
        return {
            planShowCase,
            planShowCaseNumber
        }
    })
}
export const requestGoodsOnline = params => {
    return axios.post(`${apiServer}/a/goods/online.json`, params).then(res => res.data)
}
export const requestGoodsOffline = params => {
    return axios.post(`${apiServer}/a/goods/offline.json`, params).then(res => res.data)
}
export const requestDataImport = params => {
        return axios({
            url: `${apiServer}/a/goods/sales.json`,
            method: 'post',
            data: params,
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(res => res.data)
    }
    //门店数据列表
export const requestGoodSpecProcess = params => {
    return axios.post(`${apiServer}/a/good_spec_tobe_process/find.json`, params).then(res => {
        const { error_code, result } = res.data
        if (error_code !== 0) {
            throw new Error('requst error')
        }
        const dataImprt = result.list
        const total = result.total_count
        return {
            dataImprt,
            total

        }
    })
}
export const requestGoodSpecSearch = params => {
    return axios.post(`${apiServer}/a/goods_spec/search.json`, params).then(res => {
        const { error_code, result } = res.data
        if (error_code !== 0) {
            throw new Error('requst error')
        }
        const specSearchList = result
        return {
            specSearchList
        }

    })
}
export const requestGoodSpecUpdate = params => {
    return axios.post(`${apiServer}/a/goods_spec/update.json`, params).then(res => res.data)
}

export const requestGoodSpecRemove = params => {
        return axios.post(`${apiServer}/a/goods_spec_tobe_process/remove.json`, params).then(res => res.data)
    }
    // 处理规格函数
export const getBatchParam = (specs) => {

    const com_data = (specs) => {
        const result = specs.map((v, index) => {
            const { spec_name, spec_value = [] } = v
            return spec_value.map(v => {
                const obj = {}
                obj[`spec${index + 1}_name`] = spec_name
                obj[`spec${index + 1}_value`] = v
                return obj
            })
        })
        if (result.length === 1) {
            return result.pop()
        } else if (result.length === 2) {
            return two_com_data(result)
        } else if (result.length === 3) {
            return three_com_data(result)
        } else {
            return null
        }
    }

    function extend(target, source, source_two) {
        const tmp = JSON.parse(JSON.stringify(target))
        for (let obj in target) {
            tmp[obj] = target[obj]
        }
        for (let obj in source) {
            tmp[obj] = source[obj]
        }
        if (source_two) {
            for (let obj in source_two) {
                tmp[obj] = source_two[obj]
            }
        }
        return tmp
    }

    const two_com_data = (datas) => {
        let batch = []
        for (let i = 0; i < datas[0].length; i++) {
            for (let j = 0; j < datas[1].length; j++) {
                let s1 = datas[0][i]
                let s2 = datas[1][j]
                batch.push(extend(s1, s2))
            }
        }
        return batch
    }

    const three_com_data = (datas) => {
        let batch = []
        for (let i = 0; i < datas[0].length; i++) {
            for (let j = 0; j < datas[1].length; j++) {
                for (let k = 0; k < datas[2].length; k++) {
                    let s1 = datas[0][i]
                    let s2 = datas[1][j]
                    let s3 = datas[2][k]
                    batch.push(extend(s1, s2, s3))
                }
            }
        }
        return batch
    }
    return com_data(specs)
}

// 渲染规格函数
export const getSpecsResult = (data) => {
    const result_specs_to_params = (data) => {
        let specs = []
        if (!data) {
            return []
        }
        if (data.hasOwnProperty('spec_spec1_name') && data['spec_spec1_name']) {
            specs.push({
                spec_name: data['spec_spec1_name'],
                spec_value: data['spec_spec1_values']
            })
        }
        if (data.hasOwnProperty('spec_spec2_name') && data['spec_spec2_name']) {
            specs.push({
                spec_name: data['spec_spec2_name'],
                spec_value: data['spec_spec2_values']
            })
        }
        if (data.hasOwnProperty('spec_spec3_name' && data['spec_spec3_name'])) {
            specs.push({
                spec_name: data['spec_spec3_name'],
                spec_value: data['spec_spec3_values']
            })
        }
        return specs
    }
    return result_specs_to_params(data)
}