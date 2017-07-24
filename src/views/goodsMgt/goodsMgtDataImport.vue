<template>
    <section>
        <el-col :span="24" class='mg_bottom_20'>
            <el-form :inline="true" class="demo-form-inline" >
                <el-form-item label="请选择门店：">
                    <el-select v-model="shopName" placeholder="请选择门店" @change="getGoodSpecProcessList()">
                        <el-option v-for="item in shop" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-upload class="avatar-uploader right mg-r-20" ref="upload"  :action="action" :data="{'uid': uid,'shop_id':shop_id,'header_index':4,'file':fileList.name}" :file-list="fileList" :on-success="handleImportSuccess" :show-file-list="false">
                    <el-button type="primary" class='blue-btn'@click='loading=true'>导入销售数据</el-button>
                </el-upload>
            </el-form>
    
        </el-col>
    
        <el-col :span="24" class='mg_bottom_20'>
            <div v-if="dataImprt.length==0" v-loading="loading" element-loading-text="数据正在导入,请稍后"></div>
            <div v-if="dataImprt.length!=0">
                <div v-for='(item,index) in dataImprt' class='pd-10'>
                    <span>{{item.data.goods_name}}</span>
                    <el-button type='text' class="right mg-r-50" @click='searchGoodsSpec(index,item.id,item.data.goods_name,item.data.goods_number)'>搜索</el-button>
    
                </div>
                <el-row class="row center">
                    <el-pagination class="right mg_20" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total='total'>
                    </el-pagination>
                </el-row>
            </div>
        </el-col>
    
        <el-dialog class='goods_dialog' :visible.sync="dialogFormVisible" size='small'>
            <el-form class='text_center'>
    
                <el-form-item :label="oldGoodsName" label-width="150">
                    <el-input class='right wt_200'v-model="goodsName" placeholder="请输入商品名称搜索"  :file-list="fileList" @change="searchGoodsName" auto-complete="off"></el-input>
                </el-form-item>
                <p v-if='isShowNull' class='not_search'>未搜索到该商品</p>
                <div v-if='isShow' class='pd-10'>
                    <el-table ref="singleTable" class='case_table' :data="specSearchList" highlight-current-row @current-change="handleCurrentSelect" >
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
    
                    <el-button type="primary" @click="submit()" class="blue-btn mg_auto">绑定</el-button>
    
                </div>
    
            </el-form>
    
        </el-dialog>
    </section>
</template>
<script>

import { requestFindShop, requestUpload, requestDataImport, requestGoodSpecProcess, requestGoodSpecSearch, requestGoodSpecUpdate, requestGoodSpecRemove } from '../../api/goodsServer';
import moment from 'moment';
import env from '../../env';
export default {
    data() {
        return {
            action: `${env.apiServer}/a/goods/sales.json`,
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
        //获取门店
        getFindShop() {
            const shopPlanParams = { uid: this.uid };
            requestFindShop(shopPlanParams).then(data => {
                this.shop = data.shop
            })
        },
        //导入成功事件
        handleImportSuccess(res, fileList) {
            this.getGoodSpecProcessList()
            if (res.result.error_code !== 0) {
                this.$message({
                    message: "导入数据成功",
                    type: 'success'
                });
            }
        },
        //门店数据列表
        getGoodSpecProcessList() {
            this.shop_id = this.shop.filter(v => {
                return v.value === this.shopName;
            }).map(v => v.id).pop();
            let goodSpecProcessParams = { shop_id: this.shop_id, page: this.currentPage };
            requestGoodSpecProcess(goodSpecProcessParams).then(data => {
              
                    this.dataImprt = data.dataImprt 
                    this.total = data.total

                
            })
        },
        //分页事件
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getGoodSpecProcessList()
        },
        //商品规格搜索
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
              this.specSearchList=data.specSearchList 
                    if (data.specSearchList.length == 0) {
                        this.isShowNull = true
                        this.isShow = false

                    } else {
                        this.isShow = true
                        this.isShowNull = false
                    }
            })
        },
        //绑定商品事件
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
        //删除规格
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
                    this.getGoodSpecProcessList()

                }
            })
        },
        //选中事件
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
.wt_200{
    width: 200px
}
.not_search{
    color:red;
    margin:50px auto 100px;
    text-align:center;
}
.goods_dialog .el-dialog.el-dialog--small {
    height: 750px;
}
</style>


