<template>
    <section>
        <el-col :span="24" style="margin-bottom:20px">
            <el-form :inline="true" class="demo-form-inline" style="margin-left: 10px;">
                <el-form-item label="请选择门店：">
                    <el-select v-model="shopName" placeholder="请选择门店" @change="getGoodSpecProcessList()">
                        <el-option v-for="item in shop" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-upload class="avatar-uploader" ref="upload" style="float:right;margin-right:20px;" action="http://118.89.232.160:10001/a/goods/sales.json" :data="{'uid': uid,'shop_id':shop_id,'header_index':4,'file':fileList.name}" :file-list="fileList" :on-success="handleImportSuccess" :show-file-list="false">
                <el-button type="primary" style="background:#70a5ec" @click='loading=true'>导入销售数据</el-button>
            </el-upload>
            </el-form>
            
        </el-col>
    
        <el-col :span="24" style="margin-bottom:20px">
            <div v-if="dataImprt.length==0" v-loading="loading" element-loading-text="数据正在导入,请稍后"></div>
            <div v-if="dataImprt.length!=0">
                <div v-for='(item,index) in dataImprt' style="padding:10px;">
                    <span>{{item.data.goods_name}}</span>
                    <el-button type='text' style="float:right;margin-right:50px" @click='searchGoodsSpec(index,item.id,item.data.goods_name,item.data.goods_number)'>搜索</el-button>
    
                </div>
                <el-row class="row center">
                    <el-pagination style="margin: 20px auto;float:right" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total='total'>
                    </el-pagination>
                </el-row>
            </div>
        </el-col>
    
        <el-dialog class='goods_dialog' :visible.sync="dialogFormVisible" size='small'>
            <el-form style='text-align: center;'>
    
                <el-form-item :label="oldGoodsName" label-width="150">
                    <el-input style='width:200px;float:right;' v-model="goodsName" placeholder="请输入商品名称搜索" icon='search' :file-list="fileList" :on-icon-click="searchGoodsName" auto-complete="off"></el-input>
                </el-form-item>
                <p v-if='isShowNull' style='color:red;margin:50px auto 100px;text-algin:center'>未搜索到该商品</p>
                <div v-if='isShow' style="padding:10px;">
                    <el-table ref="singleTable" :data="specSearchList" highlight-current-row @current-change="handleCurrentSelect" style="width: 100%;height:500px;overflow-y:scroll">
                        <el-table-column type="index" width="100" align='center'>
                        </el-table-column>
                        <el-table-column property="goods_name" label="商品名称" align='center'>
                        </el-table-column>
                        <el-table-column label="商品规格" align='center'>
                            <template scope="scope">
                                {{scope.row.spec1_value?scope.row.spec1_value:''}} {{scope.row.spec2_value?","+scope.row.spec2_value:''}}{{scope.row.spec3_value?","+scope.row.spec3_value:''}}
                            </template>
                        </el-table-column>
    
                    </el-table>
    
                    <el-button type="primary" @click="submit()" style="margin:61px auto 0; width:20%;">绑定</el-button>
    
                </div>
    
            </el-form>
    
        </el-dialog>
    </section>
</template>
<script>

import { requestFindShop, requestUpload, requestDataImport, requestGoodSpecProcess, requestGoodSpecSearch, requestGoodSpecUpdate, requestGoodSpecRemove } from '../../api/goodsServer';
import moment from 'moment';
export default {
    data() {
        return {
            shopName: '',
            loading: false,
            uid: '',
            shop: [],
            shop_id: '',
            goodsId: '',
            index: 0,
            currentRow: '',
            spec_number: '',
            isShow: false,
            isShowNull: false,
            specSearchList: [],
            currentPage: 1,
            pageSize: 20,
            total: 0,
            dataImprt: [],
            header_index: 3,
            goodsName: '',
            oldGoodsName: '',
            fileList: [],
            dialogFormVisible: false,
        }
    },
    mounted: function () {
        this.uid = localStorage.getItem('uid');
        this.getFindShop()
    },
    methods: {
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
        handleImportSuccess(res, fileList) {

            if (res.result.error_code !== 0) {
                this.$message({
                    message: "导入数据成功",
                    type: 'success'
                });
            }
            this.getGoodSpecProcessList()

        },
        getGoodSpecProcessList() {
            this.shop_id = this.shop.filter(v => {
                return v.value === this.shopName;
            }).map(v => v.id).pop();
            let goodSpecProcessParams = { shop_id: this.shop_id, page: this.currentPage };
            requestGoodSpecProcess(goodSpecProcessParams).then(data => {
                let { error_code, result } = data;
                if (error_code !== 0) {
                    this.$message({
                        message: "返回数据有误",
                        type: 'error'
                    });
                } else {
                    this.dataImprt = result.list
                    this.total = result.total_count

                }
            })
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getGoodSpecProcessList()
        },
        searchGoodsSpec(index, id, name, spec_number) {

            this.index = index;
            this.goodsId = id
            this.dialogFormVisible = true
            this.oldGoodsName = name
            this.spec_number = spec_number
        },
        searchGoodsName() {


            const goodSpecUpdateParams = { uid: this.uid, keyword: this.goodsName };
            requestGoodSpecSearch(goodSpecUpdateParams).then(data => {
                let { error_code, result } = data;
                if (error_code !== 0) {
                    this.$message({
                        message: "返回数据有误",
                        type: 'error'
                    });
                } else {
                    this.specSearchList = result
                    if (result.length == 0) {
                        this.isShowNull = true
                        this.isShow = false

                    } else {
                        this.isShow = true
                        this.isShowNull = false
                    }

                }
            })
        },
        setCurrent(row) {
            this.$refs.singleTable.setCurrentRow(row);
        },
        submit() {
            if (this.currentRow === '') {
                this.$message({
                    message: "您未选择要绑定的商品",
                    type: 'warning'
                });
            } else {
                let goodSpecUpdateParams = { goods_spec_id: this.currentRow, spec_number: this.spec_number };
                requestGoodSpecUpdate(goodSpecUpdateParams).then(data => {
                    let { error_code, result } = data;
                    if (error_code !== 0) {
                        this.$message({
                            message: "未绑定成功",
                            type: 'error'
                        });
                    } else {
                        this.delectSpec(),
                            this.$message({
                                message: "绑定成功",
                                type: 'success'
                            });
                        this.dialogFormVisible = false
                        this.isShowNull = false
                        this.isShow = false
                        this.goodsName = ''
                    }
                })
            }

        },
        delectSpec() {
            let removeParams = { id: this.goodsId };
            requestGoodSpecRemove(removeParams).then(data => {
                let { error_code, result } = data;
                if (error_code == 0) {
                    this.dataImprt.splice(this.index, 1);
                    this.$message({
                        message: "删除成功",
                        type: 'success'
                    });

                }
            })
        },
        handleCurrentSelect(val) {
            this.currentRow = val.id;


        }
    }
}
</script>
<style>
#goods-app {
    width: 1080px;
    margin: 20px auto;
}

.goods_dialog .el-dialog.el-dialog--small {
    height: 750px;
}
</style>


