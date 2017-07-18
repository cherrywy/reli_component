<template>
    <section>
        <el-row>
            <el-col :span='24'>
                <el-form ref="form" :model="bindgoods" >
                    <el-form-item label="请选择商品：">
                        <el-button type='text'  @click="changeGoods">选择商品</el-button>
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
                                    icon='search' class='inp_seach'
                                    auto-complete="off" 
                                    style='width:200px;' 
                                    :file-list="form.fileList"
                                    @change='clear_search_input'
                                    :on-icon-click='search'></el-input>
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
                                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageinationInfo.currentPage" :page-sizes="[5, 10,]" :page-size="pageinationInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageinationInfo.total">
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
                       <el-select v-model="seleValue" @change="remoteMethod"  @click="updateSelet"  allow-create filterable>
                            <el-option v-for="item in options" :key="item.key_word" :label="item.key_word" :value="item.key_word">
                            </el-option>
                        </el-select>
                        <el-tag :key="seleValue.key_word"
                            v-model='seleValue.key_word'
                            :closable="true"
                            @close="handleTag(tag)">{{seleValue}}</el-tag>
                    </el-form-item>
                    <el-form-item label="商品推荐语：">
                       <el-input
                            type="textarea"
                            :rows="2"
                            placeholder="请输入内容"
                            v-model="form.details_intro" style='width:300px;'>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="商品介绍：">
                       <el-input
                            type="textarea"
                            :rows="2"
                            placeholder="请输入内容"
                            v-model="form.propaganda_intro"
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
                    {{videoList.vedio_url}}
                    <el-upload
                        class="upload-demo"
                        drag
                        name="pic"
                        :data="upload_video"  
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
import {find_one_goods,changeGoodsList,changeDiaplay,goodsImgs,updatavideo,goodstype,addstype} from '../../api/display'
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
        options: [],
        seleValue:[],
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
               uid:'1209811640320002',
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
         }
      };
    },
    mounted() {
        this.getGoodsList();
    },
	methods:{
        getGoodsList(){
            const goods_id = this.$route.query.goods_id
            let inf ={
                 goods_id:this.$route.query.goods_id,
                 head_office_id:'1272126733659370'
            }
            find_one_goods(inf).then(data => {
                //更新绑定素材的时候获取商品列表
                const val = data.result
                let img = {
                    url:val.pic[0].data.url?val.pic[0].data.url:val.info[0].data.title_pics[0]
                }
                if(img.url){
                    this.fileList.push(img)
                }
                let video = {
                    url:val.vedio_url[0].data.url
                }
                this.videoList.push(video)
                this.seleValue = val.tag[0].data.goods_value
                this.form = {
                     goods_name:val.info[0].data.name,
                     details_intro:val.details_intro[0].data.goods_value,
                     price_goods_value:val.price[0].data.goods_value,
                     propaganda_intro:val.propaganda_intro[0].data.goods_value,
                     tag_url:val.jump_url[0].data.url
                 }
                
            })
            let info = {
                uid:'1209811640320002',
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
                url:res.result.file_download_url
            }
            this.fileList.push(upimg)
        },
        videohandleAvatarSuccess(res, file){
            let upimg = {
                url:res.result.file_download_url
            }
            this.videoList.push(upimg)
        },
        handleAvatarRemove(file,fileLis){
            //图片删除
            this.fileList =[]
          //  console.log(file)
        },
        videohandleAvatarRemove(){
            this.videoList =[]
        },
        onSubmit(){//绑定
           let info = this.form
           console.log(this.fileList[0])
           this.saveInfomations = {
               goods_url:this.fileList[0]?this.fileList[0].url:'',
               details_intro:info.propaganda_intro,
               details_tag:this.seleValue,
               goods_id:this.$route.query.goods_id || this.goodId,
               goods_tag:this.seleValue,
               goods_tag_url:'',
               jump_url:info.tag_url,
               price:info.price_goods_value,
               propaganda:info.details_intro,
               propaganda_pic:'',
               uid:'1209811640320002',
               video_url:this.videoList[0]?this.videoList[0].url:'',
           }
           //console.log(this.saveInfomations)
           changeDiaplay(this.saveInfomations).then(data=>{
               this.$router.push({ path: '/bindDisplayData' });
               this.$message({
                    message: "上传成功",
                    type: 'success'
                });
           })
           this.$route.go(-1)
        },
        changeGoods(){
            this.dialogFormVisible = true
            let id = {
               uid:'1209811640320002'
            }
            changeGoodsList(id).then(data => {
                let pageSize = this.pageinationInfo.pageSize //每页显示5条
                let startIndex = (this.pageinationInfo.currentPage - 1) * pageSize  //当前页起始下标
                let endIndex =(this.pageinationInfo.currentPage * pageSize )  //当前页起始下标
                this.arr = data.result.list.map(v=>{
                    return {
                        name:v.data.name,
                        goods_id:v.id
                    }
                })
                this.pageinationInfo.total =  this.arr.length
                this.arr = this.arr.slice(startIndex,endIndex)
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
        //分页
         handleCurrentChange(currentPage) {
             //当前页变动时候触发的事件
            this.pageinationInfo.currentPage = currentPage;
           this.changeGoods()
        },
         handleSizeChange(size) {
            //pageSize 改变时会触发
            this.pageinationInfo.pageSize = size;
            this.changeGoods()
        },
        //ss
        search(){
           let name = this.searchVal
           this.arr = this.arr.filter(function(v){
               return new RegExp(`${name}`,'i').test(v.name);
           })
        },
        clear_search_input(){
            //清楚搜素输入框
           let name = this.searchVal
           console.log(this.searchVal)
           if(this.searchVal !== ''){
                this.arr = this.arr.filter(function(v){
                      return new RegExp(`${name}`,'i').test(v.name);
                })
           }else{
                 this.changeGoods()
           }
        },
        remoteMethod(){
            let inf = {
                uid:'1209811640320002',
                type:4,
                key_word:this.seleValue
            }
            addstype(inf)
            //this.getGoodsList();
        }
    }
  };
</script>
