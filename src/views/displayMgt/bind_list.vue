<template>
    <section>
        <el-row>
            <el-col :span='24'>
                <el-form ref="form" :model="bindgoods" label-position="top">
                    <el-form-item label="请选择商品：">
                        <el-button type='text'  @click="changeGoods">选择商品</el-button>
                        <el-tag
                            v-for='tag in tagArrName'
                            :closable="true"
                            :type="primary"
                            @close="handleClose(tag)"
                            style='margin-left:100px' >
                            {{tag}}
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
                                    @change='goods_name_change'></el-input>
                                </el-form-item>
                                <el-form-item  :label-width="formLabelWidth" align='right'>
                                    <span>找不到商品？去<el-button type='text' @click='addgoods'>添加</el-button></span>
                                </el-form-item>
                                <el-form-item  :label-width="formLabelWidth">
                                    <el-table :data="arr" style='marign-top:10px;'  @cell-click="handleSelect">
                                            <el-table-column label="选择" width="200" type='selection'></el-table-column>
                                            <el-table-column label="商品名称" prop='name'></el-table-column>
                                    </el-table>
                                </el-form-item>
                            </el-form>
                            <el-form align='right'>
                                <div class="block">
                                    <el-pagination @current-change="handleCurrentChange" @size-change="sizeChange" :current-page="pageinationInfo.currentPage" :page-sizes="[5,10,20]" :page-size="pageinationInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageinationInfo.total">
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
                            :file-list="showImgs"
                            :on-remove='handleAvatarRemove'
                            :on-success='showImgs_Success'>
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
                            :on-remove='fileListdelete'
                            :on-success='imghandleAvatarSuccess'>
                             <i class="el-icon-plus"></i>
                        </el-upload>
                        <div class="el-upload__tip" slot="tip" style='margin-left:100px;color:red;'>注：图片支持768*600</div>
                    </el-form-item>
                    
                   
                    <el-form-item label="跳转地址">
                       <el-input  style='width:300px;' v-model='form.jump_url'></el-input>
                    </el-form-item>
    
                    <el-form-item label="请选择互动视频" >
                    <video :src="videoUrl" width='350px' height='250px' controls v-show='videofalse'></video>
                    <el-upload
                        class="upload-demo"
                        name="pic"
                        :data="upload_video"  
                        :show-file-list="true"
                        :file-list="videoList"
                        :on-remove='videohandleAvatarRemove'
                        :on-success='videohandleAvatarSuccess'
                        :on-progress='upvideoing'
                        action="http://118.89.232.160:10001/util/file/upload.json">
                        <el-button size="small" type="primary" class='clickUp'>点击上传</el-button>
                         <span v-show='video_icon' style='margin-left:20px;'>
                             <i class='el-icon-loading'></i>视频上传中
                         </span>
                        <div class="el-upload__tip" slot="tip" style='
                        color:red;'>注：视频只支持16：9尺寸，且只能上传一个</div>
                        </el-upload>  
                    </el-form-item>
                    <el-form-item align='center'>
                        <el-button type="primary" @click="onSubmit" class='clickUp'>绑定</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </section>
</template>
<script>
import {changeGoodsList,changeDiaplay,goodsImgs,updatavideo,getGoods_OneList,bind_OneList} from '../../api/display'
  export default {
    data() {
      return {
        showadd:true,
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
        video_icon:false,
        tag:'',
        obj:{url:''},
        videoobj:{url:''},
        options: [],
        seleValue:'',
        tagValue:[],
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
        good_name:'',
        selectAry:[],
        pageinationInfo: {
            currentPage: 1,
            pageSize: 5,
            total: 0,
         },
         upload_video:{
             type:'video',
             with_suffix:1
         },
         uid:'',
         head_office_id:'',
         tagArrName:[],
         tagArrtag:[],
         showImgs:[],
         videoUrl:'',
         videofalse:false,
      };
    },
    mounted() {
        this.uid = localStorage.getItem('uid');
        this.head_office_id = localStorage.getItem('head_office_id');
        this.getGoodsList();
    },
    computed:{
        filteredTableData: function () {
            let name = this.searchVal
            return this.arr.filter(function(value){
                if(name == ''){
                    return true
                }else{
                    return new RegExp(`${name}`,'i').test(value.name);
                }
            })
        }
    },
	methods:{
        getGoodsList(){
            //获取商品详情
            if(this.$route.query.goods_id){
                 this.goodId = this.$route.query.goods_id
            }
            let inf ={
                 goods_id:this.$route.query.goods_id,
                 head_office_id:this.head_office_id
            }
            getGoods_OneList(inf).then(data => {
                //更新绑定素材的时候获取商品列表
                const val = data.result
                let name  = val.goods[0].data.name
                this.tagArrName.push(name)
                if(val.goods_pic[0].data.url){
                     let img = {
                        url:val.goods_pic[0].data.url
                     }
                    this.showImgs.push(img)
                }
                let pic_imgs = val.banner.map(v=>{
                    return {
                        url:v.data.url
                    }
                })
                this.fileList = pic_imgs
                this.form.jump_url = val.jump_url[0].data.url
                console.log(val.video_url[0].data.url)
                if(val.video_url[0].data.url){
                    let url ={
                        url:val.video_url[0].data.url
                    }
                    this.videofalse = true
                    this.videoUrl = val.video_url[0].data.url
                    this.videoList.push(url)
                }       
            })
        },
        handleClose(tag) {
            //商品标签关闭判断
            if(this.$route.fullPath !== '/bind_list'){
                this.$message({
                    message: "更换素材不能删除商品",
                    type: 'error'
                })
            }else{
                var index = this.tagArrName.indexOf(tag);
                this.tagArrName.splice(index,1);
            } 
        },
        handleTag(valtag){
            //商品标签 标签关闭
            var index = this.tagArrtag.indexOf(valtag);
            this.tagArrtag.splice(index,1);
        },
        addgoods(){
            //添加商品 跳转页面
             this.$router.push({ path: '/goodsMgtNew' });
        },
        showImgs_Success(res,file){
            //商品展示图片上传
            let info = {
                url:res.result.file_download_url
            }
            this.showImgs.push(info)
            if(this.showImgs.length>1){
                this.showImgs.splice(0,1)
                this.$message({
                    message: "只能上传一张图片，以最新为准",
                    type: 'error'
                })
            }
        },
        imghandleAvatarSuccess(res, file){
            //图片上传事件
            let upimg = {
                url:res.result.file_download_url
            }
            this.fileList.push(upimg)
        },
        videohandleAvatarSuccess(res, file){
            let upimg = {
                url:res.result.file_download_url
            }
            this.video_icon = false
            this.$message({
                    message: "视频上传成功",
                    type: 'info'
            })
            this.videoUrl = res.result.file_download_url
            this.videofalse = true
            this.videoList.push(upimg)
            if(this.videoList.length>1){
                this.videoList.splice(0,1)
                this.$message({
                    message: "只能上传一个视频，以最新为准",
                    type: 'error'
                })
            }
        },
        handleAvatarRemove(file,fileLis){
            //图片删除
            this.fileList =[]
            this.videoUrl = ''
          //  console.log(file)
        },
        fileListdelete(file,fileList){
            let index = this.fileList.indexOf(fileList)
            this.fileList.splice(index,1)
        },
        videohandleAvatarRemove(){
            this.videoList =[]
        },
        onSubmit(){//绑定
           let info = this.form
           if(this.fileList.length !== 0){
                let imgs_url = ''
                imgs_url = this.fileList.map(v=>{
                    return v.url+''
                })
               this.saveInfomations.banner_urls = imgs_url
           }
           if(this.showImgs.length !== 0){
               this.saveInfomations.goods_url = this.showImgs[0].url
           }
           if(info.jump_url){
               this.saveInfomations.jump_url =info.jump_url
           }
           if(this.videoList.length !== 0){
               this.saveInfomations.video_url = this.videoList[0].url
           }
           this.saveInfomations.goods_id = this.goodId
           this.saveInfomations.uid = this.uid
           console.log(this.saveInfomations)
           bind_OneList(this.saveInfomations).then(data=>{
               if(data.error_code !== 0){
                   this.$message({
                        message:'上传失败',
                        type: 'error'
                    })
               }else{
                     this.$message({
                        message: "上传成功",
                        type: 'success'
                    }).then(
                    this.$router.push({path:'/bindDisplayData'})
                    )
               } 
           })
            
        },
        updataGoods(info){
            changeGoodsList(info).then(data => {
                this.pageinationInfo.total = data.result.total_count
                this.arr = data.result.list.map(v=>{
                    return {
                            name:v.data.name,
                            goods_id:v.id
                        }
                    })
             })
        },
        changeGoods(){
            if(this.tagArrName.length !== 0){
                this.dialogFormVisible = false
                this.$message({
                    message: "只能添加一个商品",
                    type: 'error'
                })
            }
            else{
                this.dialogFormVisible = true
                let info = {
                    uid:this.uid,
                    limit:this.pageinationInfo.pageSize,
                    page:this.pageinationInfo.currentPage
                 }       
                 if(this.searchVal !== ''){
                     info.name = this.searchVal
                 }
                this.updataGoods(info)
            }
        },
        goods_name_change(){
        //搜索
            let info = {
                    uid:this.uid,
                    limit:this.pageinationInfo.pageSize,
                    page:this.pageinationInfo.currentPage
            }
            if(this.searchVal !== ''){
                info.name = this.searchVal
            }
            this.updataGoods(info)
        },
        handleSelect(row){
            this.good_name = row.name
            this.goodId = row.goods_id
            this.selectAry.push(row)
        },
        saveChangeGoods(){
            if(this.tagArrName.length == 1){
                if(!this.tagArrName[0]){
                    this.$message({
                        message: "请选择一个商品",
                         type: 'error'
                    }) 
                    this.tagArrName=[]
                }
                 this.tagArrName.push(this.good_name)
            }
            else if(this.tagArrName.length > 1 ){
                this.$message({
                   message: "只能选择一个商品",
                   type: 'error'
                })       
            }
            else{
                this.tagArrName.push(this.good_name)
                this.dialogFormVisible = false
            }   
        },
        //分页
         handleCurrentChange(currentPage) {
             //当前页变动时候触发的事件
           this.pageinationInfo.currentPage = currentPage;
           this.changeGoods()
        },
        sizeChange(pageSize){
            this.pageinationInfo.pageSize = pageSize;
            this.changeGoods()
        },
        remoteMethod(seleValue){
            if(this.options.indexOf(seleValue) == -1){
                //值不在下拉框中，添加
                    let inf = {
                        uid:this.uid,
                        type:4,
                        key_word:this.seleValue
                      }
                   addstype(inf)
            }
            if(this.tagArrtag.length == 0){
                this.tagArrtag.push(seleValue)
            }else{
                this.tagArrtag =[]
                this.tagArrtag.push(seleValue)
            }
            console.log(this.tagArrtag)
            //this.getGoodsList();
        },
        upvideoing(){
            this.video_icon = true
        }
    }
  };
</script>
<style>
    .clickUp{
         background:#70a5ec;
        border:none;
        outline:none;
        color:white;
    }
    .clickUp:hover{
        background:#70a5ec;
        border:none;
        outline:none;
        color:white;
    }
</style>