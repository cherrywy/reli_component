<template>
    <section>
        <el-col :span="24" style="margin-bottom:20px">
             <el-upload class="avatar-uploader" ref="upload" style="float:right;margin-right:20px;" action="http://118.89.232.160:10001/util/file/upload.json" name="pic" :data="{type:'file'}" :show-file-list="false">
                      <el-button type="primary" style="background:#70a5ec"  @click="handleAvatarSuccess">导入销售数据</el-button>      
            </el-upload>
        </el-col>
        <el-dialog :visible.sync="dialogFormVisible" >
                    <el-form style='text-align: center;'>
                        <el-form-item label="">
                            <el-input style='width:200px;float:right;'v-model="goodsName" placeholder="请输入商品名称搜索" icon='search' :on-icon-click="searchGoodsName" auto-complete="off"></el-input>
                        </el-form-item>
                       <p style='color:red;margin:50px auto 100px;text-algin:center'>未搜索到该商品</p>
                         <el-button type="primary" @click="submit" style="margin:auto 0; width:20%;">绑定</el-button>
                       
                    </el-form>
                
                </el-dialog>
    </section>
</template>
<script>

import { requestUpload } from '../../api/goodsServer';
import moment from 'moment';
export default {
    data() {
        return {
            header_index:3,
             dialogFormVisible: true,
              
        }
    },
    mounted: function () {
       
    },
    methods: {
         handleAvatarSuccess(res, file) {
            const fileUrl = res.result.file_download_url
            let brandParams = { uid: 1209812865056771, file: fileUrl,header_index:this.header_index,shop_id:this.shop_id };
            requestBrandHistory(brandParams).then(data => {
                let { error_code, result } = data;
                if (error_code !== 0) {
                    this.$message({
                        message: "返回数据有误",
                        type: 'error'
                    });
                } else {
                    this.brand = result.list
                }
            })
        },
        

    }
}
</script>
<style>
#goods-app {
    width: 1080px;
    margin: 20px auto;
}
</style>


