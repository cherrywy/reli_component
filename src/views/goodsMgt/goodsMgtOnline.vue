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
            <el-card style="margin: 0 auto; width:500px;height:300px;position:relative">
                <div class="canvas" ref="canvas">
                    <canvas id="stage"></canvas>
                </div>
                <div style="bottom: 0;position: absolute;">
                    <div class="bottom">
                        <el-button type="text" class="button">展柜数量:{{planShowCase.show_case_type}}</el-button>
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
            <el-table :data="tableOnlineList" border style="width: 100%;margin-top: 15px;">
                <el-table-column prop='goods_name' label="商品名称">
                </el-table-column>
                <el-table-column prop="" label="商品图片" align="center">
                </el-table-column>
    
                <el-table-column label="操作" align="center">
                    <template scope="scope">
                        <el-button size="small" type="danger" @click="handleOffline(scope.$index, scope.row.goods_spec_id)">下架</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    
    </section>
</template>
<script>
import { requestOnline, requestFindShop, requestFindShopPlan, requestSearchSpec, requestOnlineShowCase, requestPlanShowCaseList, requestGoodsOnline, requestGoodsOffline } from '../../api/goodsServer';
export default {
    data() {
        return {
            canvas: null,
            coorDefaults: {
                originX: 'center',
                originY: 'center',
                fill: 'rgba(66, 134, 244, 0.7)',
                stroke: 'rgba(255, 255, 255, 1)',
                strokeWidth: 1,
                scaleX: 1,
                scaleY: 1,
                flipX: false,
                flipY: false,
                opacity: 1,
                visible: true,
                fillRule: 'nonzero',
                hasBorders: false,
                hasControls: false,
                hasRotatingPoint: false,
                lockMovementX: true,
                lockMovementY: true,
                lockScalingX: true,
                lockScalingY: true,
                lockUniScaling: true,
                lockRotation: true
            },
            shop: [],
            shopPlan: [],
            shopName: '',
            plansName: '',
            tableOnlineList: [],
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
    mounted: function () {
        this.getFindShop()//获取门店
    },
    wach: {
        canvas() {
            this.renderObjects()
        },
    },
    methods: {
        renderObjects() {
            // 绘制接口中获取的形状
            if (this.canvas) {
                this.planShowCase.forEach( shape => {
                    let coord = _.merge(shape.coord, this.coorDefaults)
                    let object = {}
                    if (coord.type === 'rect' || coord.type === 0) {
                        object = new window.fabric.Rect(coord)
                    } else if (coord.type === 'circle' || coord.type === 1) {
                        object = new window.fabric.Circle(coord)
                    } else {
                        return false
                    } 
                    object.set('fill', )
                    object.set('id', shape.data.id)
                    object.set('data', {
                        name:shape.data.name,
                        plan_id: shape.data.plan_id,
                        type: shape.data.show_case_type,
                        sku_group: shape.data.sku_group_ids
                    })
                    this.canvas.add(object)
                })
               
            }
        },
        getOnlineShowCaseList() {
            let OnlineListParams = { show_case_id: show_case_id };
            requestOnlineShowCase(OnlineListParams).then(data => {
                let { error_code, result } = data;
                if (error_code !== 0) {
                    this.$message({
                        message: "返回数据有误",
                        type: 'error'
                    });
                } else {

                }
            })
        },

        handleOffline(index, goods_spec_id) {
            this.$confirm('下架该商品后将无法撤回，是否继续', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let removeParams = { goods_spec_id: goods_spec_id, show_case_id: show_case_id };
                requestGoodsOffline(removeParams).then(data => {
                    let { error_code, result } = data;
                    if (error_code == 0) {
                        this.$message({
                            type: 'success',
                            message: '下架成功!'
                        });
                        this.tableOnlineList.splice(index, 1);
                        this.getList();

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
            let listParams = { uid: 1209811640320002, goods_spec_ids: goods_spec_ids, show_case_id: show_case_id };
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
                    dialogFormVisible = false;
                }
            })

        },
        getPlanShowCaseList() {
            const plan_id = this.shopPlan.filter(v => {
                return v.value === this.plansName;
            }).map(v => v.id).pop();

            let planListParams = { plan_id: plan_id };
            requestPlanShowCaseList(planListParams).then(data => {
                let { error_code, result } = data;
                if (error_code !== 0) {
                    this.$message({
                        message: "返回数据有误",
                        type: 'error'
                    });
                } else {
                    alert(plan_id)
                    this.planShowCase = result
                }
            })
        },
        getOnlineList(key_word, pageNum, limit) {
            this.dialogFormVisible = true;
            let listParams = { uid: 1209811640320002, page: pageNum, limit: limit };
            if (key_word) {
                listParams['key_word'] = key_word
            }
            requestSearchSpec(listParams).then(data => {
                let { error_code, result ,total_count} = data;
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
            const shopPlanParams = { uid: 1209811640320002 };
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
            const shopPlanParams = { uid: 1209811640320002, shop_id: shop_id };
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

.image {
    width: 100%;
    display: block;
}
</style>