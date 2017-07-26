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
                            style='margin-left:100px'
                            >
                            {{tag}}
                        </el-tag>
                        <el-dialog :visible.sync="dialogFormVisible">
                            <el-form :model="form">
                                <el-form-item  :label-width="formLabelWidth">
                                    <el-input 
                                    v-model="searchVal"           
                                    placeholder="请输入商品名称搜索" 
                                    class='inp_seach'
                                    auto-complete="off" 
                                    style='width:200px;' 
                                    @change='goods_name_change'
                                    :file-list="form.fileList"></el-input>
                                </el-form-item>
                                <el-form-item  :label-width="formLabelWidth" align='right'>
                                    <span>找不到商品？去<el-button type='text' @click='addgoods'>添加</el-button></span>
                                </el-form-item>
                                <el-form-item  :label-width="formLabelWidth">
                                    <el-table :data="filteredTableData" style='marign-top:10px;'  @cell-click="handleSelect">
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
                            :file-list="fileList"
                            :on-remove='handleAvatarRemove'
                            :on-success='imghandleAvatarSuccess'>
                             <i class="el-icon-plus"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="商品标签：">
                       <el-select v-model="seleValue" @change="remoteMethod" allow-create filterable>
                            <el-option v-for="item in options" :key="item.key_word" :label="item.key_word" :value="item.key_word">
                            </el-option>
                        </el-select>
                        <el-tag :key="valtag"
                            v-for='valtag in tagArrtag'
                            :closable="true"
                            @close="handleTag(valtag)">{{valtag}}</el-tag>
                    </el-form-item>
                    <el-form-item label="商品推荐语：">
                       <el-input
                            type="textarea"
                            :rows="2"
                            placeholder="请输入内容"
                            v-model="form.propaganda" style='width:300px;'>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="商品介绍：">
                       <el-input
                            type="textarea"
                            :rows="2"
                            placeholder="请输入内容"
                            v-model="form.details_intro"
                             style='width:300px;'>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="商品详情地址：">
                       <el-input  style='width:300px;' v-model='form.tag_url'></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格：">
                       <el-input  style='width:300px;'v-model='form.price_goods_value'></el-input> 元
                    </el-form-item>
                    <el-form-item label="请选择视频" >
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
                        
                         <el-button size="small" type="primary">点击上传</el-button>
                         <span v-show='video_icon' style='margin-left:20px;'>
                             <i class='el-icon-loading'></i>视频上传中
                         </span>
                         <div class="el-upload__tip" slot="tip" style='color:red;'>注：视频只支持16：9尺寸，且只能上传一个</div>
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
import {find_one_goods,changeGoodsList,changeDiaplay,goodsImgs,updatavideo,goodstype,addstype} from '../../api/display'
  export default {
    data() {
      return {
        showadd:true,
        dialogTableVisible: false,
        searchVal:'',
        bindgoods:{},
        form:{},
        videofalse:false,
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
        videoUrl:'',
        fileList:[],
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
         video_icon:false,
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
            const goods_id = this.$route.query.goods_id
            let inf ={
                 goods_id:this.$route.query.goods_id,
                 head_office_id:this.head_office_id
            }
            find_one_goods(inf).then(data => {
                //更新绑定素材的时候获取商品列表
                const val = data.result
                let img = {
                    url:val.pic[0].data.url?val.pic[0].data.url:val.info[0].data.title_pics[0]
                }
                if(img.url !== ''){
                    this.fileList.push(img)
                }
                if(val.vedio_url[0].data.url !== ''){
                   let video = {
                        url:val.vedio_url[0].data.url
                    } 
                    this.videoUrl = val.vedio_url[0].data.url
                    this.videoList.push(video)
                }
                this.seleValue = val.tag[0].data.goods_value
               
                this.form = {
                     goods_name:val.info[0].data.name,
                     details_intro:val.details_intro[0].data.goods_value,
                     price_goods_value:val.price[0].data.goods_value,
                     propaganda:val.propaganda_intro[0].data.goods_value,
                     tag_url:val.jump_url[0].data.url
                 }
                 //名字标签
                 this.tagArrName.push(this.form.goods_name)
                 //商品标签
                 this.tagArrtag.push(this.seleValue)
                 console.log(this.tagArrtag)

                if(this.tagArrtag.length>1){
                    this.$message({
                        message: "商品只能有一个标签",
                        type: 'error'
                     })
                }
                 //console.log(this.tagArrName)    
            })
            let info = {
                uid:this.uid,
                type:4,
                key_word:this.tag_goods_value
            }
            goodstype(info).then(data =>{
                //console.log(data.result)
                this.options = data.result.map(v =>{
                    return{
                        key_word:v
                    }
                })
            })
        },
        handleClose(tag) {
            //标签关闭判断
            if(this.$route.fullPath !== '/bindList'){
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
        imghandleAvatarSuccess(res, file){
            //图片上传事件
            let upimg = {
                url:res.result.file_download_url
            }
            this.fileList.push(upimg)
            if(this.fileList.length>1){
                this.fileList.splice(0,1)
                this.$message({
                    message: "只能上传一张图片，以最新为准",
                    type: 'error'
                })
            }
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
          //  console.log(file)
        },
        videohandleAvatarRemove(){
            this.videoList =[]
            this.videoUrl = ''
            this.videofalse = false
        },
        onSubmit(){//绑定
           let info = this.form
           console.log(this.fileList[0])
           this.saveInfomations = {
               goods_url:this.fileList[0]?this.fileList[0].url:'',
               details_intro:info.details_intro,
               details_tag:this.seleValue,
               goods_id:this.$route.query.goods_id || this.goodId,
               goods_tag:this.seleValue,
               goods_tag_url:'',
               jump_url:info.tag_url,
               price:info.price_goods_value,
               propaganda:info.propaganda,
               propaganda_pic:'',
               uid:this.uid,
               video_url:this.videoList[0]?this.videoList[0].url:'',
           }
           changeDiaplay(this.saveInfomations).then(data=>{
               console.log(data)
               if(data.error_code !== 0 || this.tagArrName == []){
                   this.$message({
                        message:'上传失败,请选择商品',
                        type: 'error'
                    })
               }else{
                     this.$message({
                        message: "上传成功",
                        type: 'success'
                    }).then(
                    this.$router.push({path:'/bindDisplayData/viewTwovideo'})
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
        },
        upvideoing(){
            this.video_icon = true
        }
    }
  };
</script>
