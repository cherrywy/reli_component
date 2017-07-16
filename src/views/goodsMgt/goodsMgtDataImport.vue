<template>
    <section>
        <el-col :span="24" style="margin-bottom:20px">
             <el-upload class="avatar-uploader" ref="upload" style="float:right;margin-right:20px;"  action="http://118.89.232.160:10001/a/goods/sales.json" :data="{'uid': 1209811640320002,'shop_id':1272219830442436,'header_index':4,'file':fileList.name}" :file-list="fileList" :on-success="handleImportSuccess" :show-file-list="false">
                      <el-button type="primary" style="background:#70a5ec"  >导入销售数据</el-button>      
            </el-upload>
        </el-col>
        <el-col :span="24" style="margin-bottom:20px">
            <div v-for='item in dataImprt'  style="border-bottom: 1px solid #ccc;padding:10px;">
                <span>{{item.data.goods_name}}</span>
                <el-button type='text'style="float:right;margin-right:50px">搜索</el-button>
            </div>
        </el-col>
        <el-dialog :visible.sync="dialogFormVisible" >
                    <el-form style='text-align: center;'>
                        <el-form-item label="">
                            <el-input style='width:200px;float:right;'v-model="goodsName" placeholder="请输入商品名称搜索" icon='search' :file-list="fileList" :on-icon-click="searchGoodsName" auto-complete="off"></el-input>
                        </el-form-item>
                       <p style='color:red;margin:50px auto 100px;text-algin:center'>未搜索到该商品</p>
                         <el-button type="primary" @click="submit" style="margin:auto 0; width:20%;">绑定</el-button>
                       
                    </el-form>
                
                </el-dialog>
    </section>
</template>
<script>

import { requestUpload,requestDataImport } from '../../api/goodsServer';
import moment from 'moment';
export default {
    data() {
        return {
            dataImprt:[],
            header_index:3,
            goodsName:'',
            fileList:[],
            dialogFormVisible: false,
            
              
        }
    },
    mounted: function () {
       
    },
    methods: {
        handleImportSuccess(res, fileList) {
            if (res.result.error_code !== 0) {
                    this.$message({
                        message: "导入数据成功",
                        type: 'success'
                    });
            this.dataImprt=res.result
                }
        
        },
        
     searchGoodsName(){

     }
    }
}
</script>
<style>
#goods-app {
    width: 1080px;
    margin: 20px auto;
}
</style>


