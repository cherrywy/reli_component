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
                        <br/>
                        <el-tag
                            v-model="form.goods_name"
                            :key="form.goods_name"
                            :closable="true"
                            :type="primary"
                            @close="handleClose(form.goods_name)"
                            style='margin-left:100px'
                            >
                            {{form.goods_name}}
                        </el-tag>
                        <el-dialog :visible.sync="dialogFormVisible">
                            <el-form :model="form">
                                <el-form-item  :label-width="formLabelWidth">
                                    <el-input 
                                    v-model="searchVal"           
                                    placeholder="请输入商品名称搜索" 
                                    auto-complete="off" 
                                    style='width:200px;' 
                                    :file-list="form.fileList"
                                    on-icon-click='search'></el-input>
                                </el-form-item>
                                <el-form-item  :label-width="formLabelWidth" align='right'>
                                    <span>找不到商品？去<el-button type='text' @click='addgoods'>添加</el-button></span>
                                </el-form-item>
                                <el-form-item  :label-width="formLabelWidth">
                                    <el-table :data="arr" style='marign-top:10px;'  @cell-click="handleSelect" @selection-change="selectionchange">
                                            <el-table-column label="选择" width="200" type='selection'></el-table-column>
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
                                <el-button type="primary" @click="saveChangeGoods">保 存</el-button>
                            </div>
                        </el-dialog>
                    <el-form-item>
                    </el-form-item>     
                    </el-form-item>
                    <el-form-item label="商品展示图片：">
                        <el-upload
                            action="http://118.89.232.160:10001/util/file/upload.json"
                            name="pic"
                            :data="upload_params"      
                            :show-file-list="true"
                            list-type="picture-card"
                            :file-list="fileList"
                            :on-remove='handleAvatarRemove'
                            :on-success='imghandleAvatarSuccess'>
                             <i class="el-icon-plus"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="请选择图片">
                        <el-upload
                            action="http://118.89.232.160:10001/util/file/upload.json"
                            name="pic"
                            :data="upload_params"      
                            :show-file-list="true"
                            list-type="picture-card"
                            :file-list="fileList"
                            :on-remove='handleAvatarRemove'
                            :on-success='imghandleAvatarSuccess'>
                             <i class="el-icon-plus"></i>
                        </el-upload>
                    </el-form-item>
                    
                   
                    <el-form-item label="跳转地址">
                       <el-input  style='width:300px;' v-model='form.jump_url_url'></el-input>
                    </el-form-item>
    
                    <el-form-item label="请选择互动视频" >
                    <el-upload
                        class="upload-demo"
                        drag
                        name="pic"
                        :data="video_upload_params"  
                        :show-file-list="true"
                        :file-list="videoList"
                        :on-remove='videohandleAvatarRemove'
                        :on-success='videohandleAvatarSuccess'
                        action="http://118.89.232.160:10001/util/file/upload.json"
                        multiple>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip" style='margin-left:100px;color:red;'>注：视频只支持16：9尺寸，且只能上传一个</div>
                        </el-upload>  
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
import {changeGoodsList,changeDiaplay,goodsImgs,updatavideo} from '../../api/display'
  export default {
    data() {
      return {
        dialogTableVisible: false,
        searchVal:'',
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
        form: {},
        formLabelWidth: '120px',
        arr:[],
        dialogImageUrl:'',
        videoList:[],
        fileList:[],
        tag:'',
        obj:{url:''},
        videoobj:{url:''},
        options: [{value: '经典',name:'经典'}, {value: '新品',name: '新品'}],
        tag_goods_value:'',
        saveInfomations:{
             banner_urls:'',
               details_intro:'',
               details_tag:'',
               goods_id:'',
               goods_tag:'',
               goods_tag_url:'',
               goods_url:'',
               jump_url:'',
               price:'',
               propaganda:'',
               propaganda_pic:'',
               uid:'',
               video_url:'',
        },
        goodId:'',
        upload_params:{type:'image'},
        video_upload_params:{type:'video'},
        good_name:'',
        selectAry:[],
        uid:'',
      };
    },
    mounted() {
        this.uid = localStorage.getItem('uid');
        this.getGoodsList();
    },
	methods:{
        getGoodsList(){
            const goods_id = this.$route.query.goods_id
            let uid ={
                 uid:this.uid
            }
            updatavideo(uid).then(data => {
                //更新绑定素材的时候获取商品列表
                 data.result.video_list.map(v =>{
                   if(goods_id == v.video.goods.info_id){
                        v.video.goods.info_title_pics.map(val => {
                           this.obj.url = val
                           this.fileList.push(this.obj)
                       })  
                       this.tag_goods_value = v.video.goods.tag_goods_value
                       this.form = {
                            goods_name:v.video.goods.info_name,
                            ag_goods_value:v.video.goods.tag_goods_value,
                            details_intro_goods_value:v.video.goods.details_intro_goods_value,
                            propaganda_intro_goods_value:v.video.goods.propaganda_intro_goods_value,
                            jump_url_url:v.video.goods.jump_url_url,
                            price_goods_value:v.video.goods.price_goods_value,
                            vedio_url_url:v.video.goods.vedio_url_url
                       }
                   }
                 })
            })
        },
        handleClose(goods_name) {
            //标签关闭
            goods_name= null
        },
        handleTag(tag){
            this.tag_goods_value = null
        },
        addgoods(){
            //添加商品 跳转页面
             this.$router.push({ path: '/goodsMgtNew' });
        },
        imghandleAvatarSuccess(res, file){
            //图片上传事件
            let upimg = {
                pic:res.result.file_download_url
            }
            this.fileList.push(upimg)
        },
        imghandleAvatarSuccess(res, file){
            //视频上传事件
            let upvideo = {
                url:res.result.file_download_url
            }
            if(this.videoLis.length == 0){
                this.videoList.push(upvideo)
            }else{
                this.$message({
                    message: "只能上传一个视频",
                    type: 'error'
                 });
            } 
        },
        onSubmit(){//绑定
           //console.log(this.form)
           let info = this.form
           this.fileList.map(v=>{ this.saveInfomations.banner_urls = v.url +','})
           this.saveInfomations = {
               banner_urls:this.saveInfomations.banner_urls,
               details_intro:info.details_intro_goods_value,
               details_tag:this.tag_goods_value,
               goods_id:this.$route.query.goods_id || this.goodId,
               goods_tag:this.tag_goods_value,
               goods_tag_url:'',
               goods_url:info.jump_url_url,
               jump_url:info.vedio_url_url,
               price:info.price_goods_value,
               propaganda:info.propaganda_intro_goods_value,
               propaganda_pic:'',
               uid:this.uid,
               video_url:this.videoList,
           }
           changeDiaplay(this.saveInfomations).then(data=>{
               this.$router.push({ path: '/bindDisplayData' });
               this.$message({
                    message: "上传成功",
                    type: 'success'
                });
           })
        },
        changeGoods(){
            this.dialogFormVisible = true
            let id = {
               uid:this.uid 
            }
            changeGoodsList(id).then(data => {
                this.arr = data.result.list.map(v=>{
                    return {
                        name:v.data.name,
                        goods_id:v.id

                    }
                });
            })
        },
        handleSelect(row){
            //console.log(row)
            this.good_name = row.name
            this.goodId = row.goods_id
            this.selectAry.push(row)
        },
        saveChangeGoods(){
            if(this.selectAry.length >2){
                this.$message({
                   message: "只能选择一个商品",
                   type: 'error'
                })
            }
            else{
                this.dialogFormVisible = false;
                this.form.goods_name = this.good_name
            }   
        },
        search(){
            //alert(1)
           let name = this.searchVal
           this.arr = this.arr.filter(function(v){
               return new RegExp(`${name}`,'i').test(v.name);
           })
        }
    }
  };
</script>
<style>
    
</style>