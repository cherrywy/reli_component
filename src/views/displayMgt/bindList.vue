<template>
    <section>
        <el-row>
            <el-col :span='24'>
                <el-form ref="form" :model="bindgoods" >
                    <el-form-item label="请选择商品：">
                        <el-input
                            icon="search"
                            v-model="filter.goods"
                            :on-icon-click="handleIconClick"
                             style='width:200px;'>
                        </el-input>
                        <el-button type='text'  @click="changeGoods">选择商品</el-button>
                        <el-dialog :visible.sync="dialogFormVisible">
                            <el-form :model="form">
                                <el-form-item  :label-width="formLabelWidth">
                                    <el-input v-model="input" placeholder="请输入商品名称搜索" auto-complete="off" style='width:200px;'></el-input>
                                </el-form-item>
                                <el-form-item  :label-width="formLabelWidth" align='right'>
                                    <span>找不到商品？去<el-button type='text'>添加</el-button></span>
                                </el-form-item>
                                <el-form-item  :label-width="formLabelWidth">
                                    <el-table :data="arr" style='marign-top:10px;'>
                                            <el-table-column label="选择" width="200">
                                                <template scope="scope">
                                                    <el-checkbox v-model="checked" @click="check"></el-checkbox>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="商品名称" prop='name'></el-table-column>
                                    </el-table>
                                </el-form-item>
                            </el-form>
                            <el-form align='right'>
                                <div class="block">
                                    <el-pagination
                                        layout="prev, pager, next"
                                        :total="50">
                                    </el-pagination> 
                                </div>
                            </el-form>
                            <div slot="footer" class="dialog-footer" align='center'>
                                <el-button type="primary" @click="dialogFormVisible = false">保 存</el-button>
                            </div>
                        </el-dialog>
                    <el-form-item>
                         <el-input style='width:200px;margin-left:95px;'>商品名字：</el-input><el-button>删除</el-button>
                    </el-form-item>     
                    </el-form-item>
                    <el-form-item label="商品展示图片：">
                        <el-upload
                            action="http://118.89.232.160:10001/v10/a/goods/fold_dd/edit_banner.json"
                            :file-list="fileList">
                            <el-button size="small" type="primary">本地上传</el-button>
                            <img src="" alt="">
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="商品标签：">
                       <el-select v-model="value5" multiple placeholder="新品">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                        <el-tag  :closable="true">新品</el-tag>
                    </el-form-item>
                    <el-form-item label="商品推荐语：">
                       <el-input
                            type="textarea"
                            :rows="2"
                            placeholder="请输入内容"
                            v-model="textarea" style='width:300px;'>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="商品介绍：">
                       <el-input
                            type="textarea"
                            :rows="2"
                            placeholder="请输入内容"
                            v-model="textarea"
                             style='width:300px;'>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="商品详情地址：">
                       <el-input  style='width:300px;'></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格：">
                       <el-input  style='width:300px;'></el-input> 元
                    </el-form-item>
                    <el-form-item label="请选择视频" >
                        <el-upload
                                action="http://118.89.232.160:10001/util/file/upload.json"
                                list-type="picture-card"
                                :on-success='handleAvatarSuccess'
                                :on-remove="handleRemove">
                                <i class="el-icon-plus"></i>
                                <div slot="tip" class="el-upload__tip" style='margin-left:50px;color:red;'>注：视频只支持16：9尺寸，且只能上传一个</div>
                        </el-upload>
                        <el-dialog v-model="dialogVisible" size="tiny">
                            <img width="100%" :src="dialogImageUrl" alt="">
                        </el-dialog>
                    </el-form-item>
                    <el-form-item align='center'>
                        <el-button type="primary" @click="onSubmit">绑定</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </section>
</template>
<script>
import {changeGoodsList} from '../../api/display'
  export default {
    data() {
      return {
        dialogTableVisible: false,
        bindgoods:{},
        form:{},
        filter: {
                goods:null,
                userId: null ,
                nickName:null,
                startTime:null,
                endTime:null,
         },
        dialogFormVisible: false,
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        formLabelWidth: '120px',
        arr:[]
      };
    },
	methods:{
        changeGoods(){
            this.dialogFormVisible = true
            let id = {
               uid:'1209811640320002' 
            }
            changeGoodsList(id).then(data => {
                this.arr = data.result.list.map(v=>{
                    return {
                        name:v.data.name
                    }
                });
            })
        }
    }
  };
</script>
<style>
    
</style>