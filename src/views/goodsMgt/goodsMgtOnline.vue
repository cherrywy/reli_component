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
        <el-row :gutter="20" :offset="10" style="margin-bottom:20px;text-align:center;">
            <el-card style="margin: 0 auto;position:relative">
                <!--<div class="canvas" ref="canvas">
                        <canvas id="stage"></canvas>
                    </div>-->
                <Viewer :planId="planId" />
                <div style="bottom: 0;position: absolute;">
                    <div class="bottom">
                        <el-button type="text" class="button">展柜数量:{{planShowCaseNumber}}</el-button>
                    </div>
                </div>
            </el-card>
        </el-row>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span style="line-height: 36px;">卡片名称</span>
                <el-button style="float: right;" type="primary" @click="getOnlineList('', 0, 5)">上架商品</el-button>
                <el-dialog :visible.sync="dialogFormVisible">
                    <el-form>
                        <el-form-item label="">
                            <el-input v-model="goodsName" placeholder="请输入商品名称搜索" icon='search' :on-icon-click="searchGoodsName" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-button type="text" style="float:right" @click="goodsNew()">
                            <span style="color:#333">找不到商品？去</span>添加</el-button <el-form-item>
                        <el-table ref="multipleTable" :data="tableOnlineList" border tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
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
                        <el-row class="row center">
                            <el-pagination style="margin: 20px auto;float:right" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10, 15, 20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
                        </el-row>
                        </el-form-item>
                    </el-form>
                    <div style="text-align:center">
    
                        <el-button type="primary" style="margin:auto 0" @click="submit">保存</el-button>
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
                        <el-button size="small" type="danger" @click="handleOffline(scope.$index, scope.row.id)">下架</el-button>
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
            uid: '',
            show_case_id: '',
            shop: [],
            shopPlan: [],
            shopName: '',
            plansName: '',
            planId: 0,
            tableOnlineList: [],
            onlineShowCaseList: [],
            planShowCaseNumber: 0,
            planShowCase: [],
            tableData: [],
            goodsName: '',
            currentPage: 1,
            pageSize: 5,
            total: 0,
            multipleSelection: [],
            dialogFormVisible: false,
            formLabelWidth: '120px',
        }
    },
    components: {
        Viewer
    },
    beforeRouteUpdate (after, before, next) {
        this.$bus.$emit('route.update')
        next()
    },
    mounted: function () {
        this.uid = localStorage.getItem('uid');
        this.getFindShop()//获取门店
        this.$bus.$on('viewerSelectedShowcase', scId => {
            // 选中了展柜，展柜 id 为 scId
            this.show_case_id = scId
            this.getOnlineShowCaseList()
        })
    },
    wach: {
        canvas() {
            this.renderObjects()
        },
    },
    methods: {
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
                console.log(removeParams);
                requestGoodsOffline(removeParams).then(data => {
                    let { error_code, result } = data;
                    if (error_code == 0) {
                        this.$message({
                            type: 'success',
                            message: '下架成功!'
                        });
                        console.log(index);
                        this.onlineShowCaseList.splice(index, 1);
                        this.getOnlineShowCaseList();

                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '数据返回错误'
                });
            });
        },
        submit() {

            const goods_spec_ids = this.multipleSelection.map(v => {
                return v.id
            }).join()
            let listParams = { uid: this.uid, goods_spec_ids: goods_spec_ids, show_case_id: this.show_case_id };
            console.log(listParams);
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

        },
        getPlanShowCaseList() {
            this.planId = this.shopPlan.filter(v => {
                return v.value === this.plansName;
            }).map(v => v.id).pop();

            let planListParams = { plan_id: this.planId };
            requestPlanShowCaseList(planListParams).then(data => {
                let { error_code, result, total_count } = data;
                if (error_code !== 0) {
                    this.$message({
                        message: "返回数据有误",
                        type: 'error'
                    });
                } else {

                    this.planShowCase = result
                    this.planShowCaseNumber = total_count
                    this.$bus.$emit('initViewer')
                }
            })
        },
        getOnlineList(key_word, pageNum, limit) {
            this.dialogFormVisible = true;
            let listParams = { uid: this.uid, page: pageNum, limit: limit };
            if (key_word) {
                listParams['key_word'] = key_word
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
                    this.total = total_count;
                }
            })
        },
        searchGoodsName() {
            this.getOnlineList(this.goodsName, 0, this.pageSize)
            this.key_word = ''
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getOnlineList(this.plansName, this.currentPage, this.pageSize)
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.getOnlineList(this.plansName, this.currentPage, this.pageSize)
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
            const shop_id = this.shop.filter(v => {
                return v.value === this.shopName;
            }).map(v => v.id).pop();
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