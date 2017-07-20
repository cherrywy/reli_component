<template>
    <section>
        <el-row :gutter="20">
            <el-form :inline="true" class="demo-form-inline" style="margin-left: 10px;">
                <el-form-item label="请选择门店：">
                    <el-select v-model="shopName" placeholder="请选择" @change="getFindShopPlan()">
                        <el-option v-for="item in shop" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="请选择布局图：">
                    <el-select v-model="plansName" placeholder="请选择" @change='getPlanShowCaseList()'>
                        <el-option v-for="item in shopPlan" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row :gutter="20" :offset="10" style="margin-bottom:20px;text-align:center;" v-show="planId">
            <el-card style="margin: 0 auto;position:relative">
                <Viewer :planId="planId" />
                <!--<div style="bottom: 0;position: absolute;">-->
                    <!--<div class="bottom">-->
                        <!--<el-button type="text" class="button">展柜数量:{{planShowCaseNumber}}</el-button>-->
                    <!--</div>-->
                <!--</div>-->
            </el-card>
        </el-row>
        <el-card class="box-card" v-show="isCase">
            <div slot="header" class="clearfix">
                <span style="line-height: 36px;">{{show_case_type}}-{{show_case_name}}</span>
                <el-button style="float: right;background: rgb(112, 165, 236);border: none;" type="primary" @click="getPopPlan()">上架商品</el-button>
                <el-dialog :visible.sync="dialogFormVisible">
                    <el-form>
                        <el-form-item label="">
                            <el-input v-model="goodsName" placeholder="请输入商品名称搜索" @change="searchGoodsName" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-button type="text" style="float:right" @click="goodsNew()">
                            <span style="color:#333">找不到商品？去</span>添加
                            <span style="color:#333">新商品</span>
                        </el-button>
                        <el-table ref="multipleTable" :data="tableOnlineList" border tooltip-effect="dark" style="width: 100%;margin-bottom: 20px;height: 380px;scoll-y: auto;overflow-y: scroll;" @selection-change="handleSelectionChange">
                            <el-table-column type="selection" width="55">
                            </el-table-column>
                            <el-table-column prop='goods_name' label="商品名称">
                            </el-table-column>
                            <el-table-column label="商品规格">
                                <template scope="scope">
                                    {{scope.row.spec1_value?scope.row.spec1_value:''}} {{scope.row.spec2_value?","+scope.row.spec2_value:''}}{{scope.row.spec3_value?","+scope.row.spec3_value:''}}
                                </template>
                            </el-table-column>
                        </el-table>
                        </el-form-item>
                    </el-form>
                    <div style="text-align:center">
    
                        <el-button type="primary" style="margin:auto 0;background: rgb(112, 165, 236)" @click="submit">保存</el-button>
                    </div>
                </el-dialog>
            </div>
            <el-table :data="onlineShowCaseList" border style="width: 100%;margin-top: 15px;">
                <el-table-column prop='goods_name' label="商品名称">
                </el-table-column>
                <el-table-column prop="" label="商品规格" align="center">
                    <template scope="scope">
                        {{scope.row.spec1_value?scope.row.spec1_value:''}} {{scope.row.spec2_value?","+scope.row.spec2_value:''}}{{scope.row.spec3_value?","+scope.row.spec3_value:''}}
                    </template>
                </el-table-column>
    
                <el-table-column label="操作" align="center">
                    <template scope="scope">
                        <el-button size="small" style="background:#E0595B;opacity:0.66;color:#fff;border: none;" @click="handleOffline(scope.$index, scope.row.id)">下架</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    
    </section>
</template>
<script>
import Viewer from './../../components/SharedBlocks/Viewer'
import { requestOnline, requestFindShop, requestFindShopPlan, requestSearchSpec, requestOnlineShowCase, requestPlanShowCaseList, requestGoodsOnline, requestGoodsOffline } from '../../api/goodsServer';
export default {
    data() {
        return {
            isCase: false,
            show_case_type: '',
            uid: 0,
            show_case_id: '',
            shop: [],
            shopPlan: [],
            shopName: '',
            shopId: '',
            plansName: '',
            planId: 0,
            tableOnlineList: [],
            onlineShowCaseList: [],
            planShowCaseNumber: 0,
            planShowCase: [],
            show_case_name: '',
            goodsName: '',
            multipleSelection: [],
            dialogFormVisible: false,
            formLabelWidth: '120px',
        }
    },
    components: {
        Viewer
    },
    beforeRouteUpdate(after, before, next) {
        this.$bus.$emit('route.update')
        next()
    },
    mounted: function () {
        this.uid = localStorage.getItem('uid');
        if (this.$route.query.shopId) {
            this.shopName = this.$route.query.shopName
            this.getFindShopPlan()

        }
        this.getFindShop()//获取门店
        this.$bus.$off('viewerSelectedShowcase')
        this.$bus.$on('viewerSelectedShowcase', scObj => {
            // 选中了展柜，展柜 id 为 scId
            // 由于 Viewer 组件的特殊逻辑“取消选择展柜时保留选中状态”，导致
            // 切换平面图时，自动发生的“取消选择”事件再次出发选中事件，
            // 引起一次多余的 viewerSelectedShowcase 事件。解决方式：
            // 因为切换平面图后，本组件的 planId 已与先前不同，所以多余的
            // 事件参数传来的 scObj 的 plan_id 和现在不等，判断这个值
            // 即可判定是否为多余的一次选中事件，中止执行。
            if (scObj.data.plan_id !== this.planId) return false
            this.isCase = true
            this.show_case_id = scObj.data.original_showcase_id
            this.show_case_name = scObj.data.name
            if (scObj.data.type === 10) {
                this.show_case_type = '中岛柜'
            }
            if (scObj.data.type === 20) {
                this.show_case_type = '背柜'
            }
            this.getOnlineShowCaseList()
        })
    },
    methods: {
        getPopPlan() {
            this.dialogFormVisible = true;
            this.goodsName = ''
            this.getOnlineList('', 0, 5)
        },
        getOnlineShowCaseList() {
            let OnlineListParams = { show_case_id: this.show_case_id };
            requestOnlineShowCase(OnlineListParams).then(data => {
                let { error_code, result } = data;
                if (error_code !== 0) {
                    this.$message({
                        message: "返回数据有误",
                        type: 'error'
                    });
                } else {
                    this.onlineShowCaseList = result

                }
            })
        },

        handleOffline(index, goods_spec_id) {

            this.$confirm('下架该商品后将无法撤回，是否继续', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                let removeParams = { goods_spec_id: goods_spec_id, show_case_id: this.show_case_id };
                requestGoodsOffline(removeParams).then(data => {
                    let { error_code, result } = data;
                    if (error_code == 0) {
                        this.$message({
                            type: 'success',
                            message: '下架成功!'
                        });
                        this.onlineShowCaseList.splice(index, 1);
                        this.getOnlineShowCaseList();

                    }
                })
            })
        },
        submit() {

            const goods_spec_ids = this.multipleSelection.map(v => {
                return v.id
            }).join()
            if (goods_spec_ids.length === 0) {
                this.$message({
                    message: "您还没有选择任何商品",
                    type: 'warning'
                });
            } else {
                let listParams = { uid: this.uid, goods_spec_ids: goods_spec_ids, show_case_id: this.show_case_id };

                requestGoodsOnline(listParams).then(data => {
                    let { error_code, result } = data;
                    if (error_code !== 0) {
                        this.$message({
                            message: "返回数据有误",
                            type: 'error'
                        });
                    } else {

                        this.$message({
                            message: "保存成功",
                            type: 'success'
                        });
                        this.dialogFormVisible = false;
                        this.getOnlineShowCaseList()

                    }
                })
            }


        },
        getPlanShowCaseList() {
            this.isCase = false;
            this.planId = this.shopPlan.filter(v => {
                return v.value === this.plansName;
            }).map(v => v.id).pop();
            if(!this.planId){
               return
            }
            let planListParams = { plan_id: this.planId };
            requestPlanShowCaseList(planListParams).then(data => {
                let { error_code, result, total_count } = data;

                if (error_code !== 0) {
                    this.$message({
                        message: "返回数据有误",
                        type: 'error'
                    });
                } else {
                    if (total_count===0){//展柜数量为0
                        this.$message({
                            message: "该平面图无展柜，请先添加展柜",
                            type: 'info'
                        });
                        this.$bus.$emit('initViewer')
                        console.log('1111')
                    }else {
                        this.planShowCase = result
                        this.planShowCaseNumber = total_count
                        this.$bus.$emit('initViewer')
                        console.log('222')
                    }
                }
            })
        },
        getOnlineList(key_word, pageNum, limit) {
            let listParams = { uid: parseInt(this.uid), page: pageNum, limit: 20000 };
            if (key_word) {
                listParams['keyword'] = key_word
            }
            requestSearchSpec(listParams).then(data => {
                let { error_code, result, total_count } = data;
                if (error_code !== 0) {
                    this.$message({
                        message: "返回数据有误",
                        type: 'error'
                    });
                } else {

                    this.tableOnlineList = result

                }
            })
        },
        searchGoodsName() {
            this.getOnlineList(this.goodsName, 0, 20000)
            this.key_word = ''
        },
        getFindShop() {
            const shopPlanParams = { uid: this.uid };
            requestFindShop(shopPlanParams).then(data => {
                let { error_code, result } = data;
                if (error_code !== 0) {
                    this.$message({
                        message: "返回数据有误",
                        type: 'error'
                    });
                } else {
                    this.shop = result.map(v => {
                        return {
                            value: v.shop,
                            id: v.id,

                        }
                    });

                }
            })
        },
        getFindShopPlan() {
            this.plansName = ''
            this.planShowCase =[]
            let shop_id = '';
            if (this.$route.query.shopId) {
                shop_id = this.$route.query.shopId
            } else {
                shop_id = this.shop.filter(v => {
                    return v.value === this.shopName;
                }).map(v => v.id).pop();
            }
            const shopPlanParams = { uid: this.uid, shop_id: shop_id };
            requestFindShopPlan(shopPlanParams).then(data => {
                let { error_code, result } = data;
                if (error_code !== 0) {
                    this.$message({
                        message: "返回数据有误",
                        type: 'error'
                    });
                } else {
                    this.shopPlan = result.map(v => {
                        return {
                            value: v.name,
                            id: v.id,

                        }
                    });
                }
            })
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        goodsNew() {
            const path = '/goodsMgtNew';
            this.$router.push({ path: path });
        },

    }
}

</script>
<style>
#goods-app {
    width: 1080px;
    margin: 20px auto;
}

.container .canvas[data-v-5ae3712d] {
    overflow-x: hidden !important;
}

.container .canvas .overlay[data-v-5ae3712d] {

    top: 100px !important;

    height: 20% !important;
}

.image {
    width: 100%;
    display: block;
}
</style>