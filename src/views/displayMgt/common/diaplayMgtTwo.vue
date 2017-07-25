<template>
    <section>
      <el-row>
            <el-col :span='24'>
                <span style='line-height:50px;font-size:18px;'>轮播图</span>
            </el-col>
            <el-col :span='24'>
                <ul v-for='img in img_lists'  style='float:left;list-style:none;'>
                    <li>
                        <img width='150' height='150' :src="img.pic_url"  @click="delete_bind_img(img)" style='border:1px #999 dashed;margin-right:15px;'>
                    </li>
                </ul>
                <p>
                    <el-button style='width:150px;height:150px;border-style:dashed;margin-left:50px;' @click='add_imgs'><i class="el-icon-plus"></i></el-button>
                </p>
                <el-dialog  :visible.sync="dialogTableVisible">
                    <template>
                    <el-table :data="imgLists" style='marign-top:10px;' @selection-change="imgs_selectionchange">
                            <el-table-column  width="200" type='selection'></el-table-column>
                            <el-table-column  prop='pic_url'>
                                <template scope="scope">
                                    <img width='80' height='80' :src="scope.row.pic_url">
                                </template>
                            </el-table-column>
                        </el-table>
                        <div style='width:100%;float:left;margin-bottom:20px;' align='center'>
                            <el-button @click='add_imgs_lun'>添加</el-button>
                        </div>
                    </template> 
                </el-dialog>
            </el-col>

            <el-col :span='24'>
                <span style='line-height:50px;font-size:18px;'>显示商品</span>
                <el-button @click='update_goods' class='updataimg' align='right' style='margin-top:5px'>发布商品</el-button>
                    
                    <el-dialog :visible.sync="dialogFormVisible">
                        <el-form align='left'>
                            <el-form-item>
                                <el-input v-model="good_search" 
                                    placeholder="请输入商品名称搜索" 
                                    auto-complete="off" 
                                    @change ='good_searchChange'
                                    style='width:200px;'>
                                </el-input>
                            </el-form-item>
                            <el-form-item align='right'>
                                <span>找不到商品？去<el-button type='text' @click='addDisplay'>绑定</el-button>商品</span>
                            </el-form-item>
                            <el-form-item>
                                <el-table :data="gridData" style='marign-top:10px;'  @selection-change="goods_selectionchange">
                                        <el-table-column type='selection' label="选择" width="200"></el-table-column>
                                        <el-table-column prop="name" label="商品名称" ></el-table-column>
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
                            <el-button type="primary" @click="save_Goods">发 布</el-button>
                        </div>

                    </el-dialog>
             </el-col>
                <el-table
                    :data="tableData"
                    style="width: 100%;">
                    <el-table-column
                    prop="goodname"
                    label="商品名称"
                    width="500"
                    align='center'>
                    </el-table-column>
                    <el-table-column
                    prop="state"
                    label="商品状态"
                    align='center'>
                    </el-table-column>
                    <el-table-column
                    prop="address"
                    label="操作"
                    align='center'>
                        <template scope="scope">
                            <el-button
                                size="small"
                                class='btn_red_color'
                                @click="delete_goods(scope.$index)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
          
           </el-row>    
    </section>
</template>
<script>
 import {delete_bind_imgs,bind_id_Imgs,carouselImgs,bind_id_goods,delete_id_goods,updatavideo,online_goods,allPic_imgs,bind_imgs} from '../../../api/display'
  import moment from 'moment';
  export default {
    data() {
      return {
        img_lists:[],
        lun_imgs:[],
        imgLists:[],
        imgs:[],
        tableData:[],
        dialogFormVisible: false,
        dialogDelete:false,
        gridData:[],
        good_name:'',
        goodId:[],
        selectAry:[],
        goods_ids:'',
        dialogImageUrl:'',
        dialogTableVisible:false,
        ids:[],
        add_info:{},
        pageinationInfo: {
            currentPage: 1,
            pageSize: 5,
            total: 0,
         },
         uid:'',
         good_search:'',
         arr:[]
      };
    },
    mounted:function() {
        this.uid = localStorage.getItem('uid');
        this.getimg_List();
    },
    methods: {
        getimg_List(){
            this.img_lists =[]
            let bind_id = this.$route.query.id   
            let info = {
                display_device_id:bind_id,
                uid:this.uid
            }
            bind_id_goods(info).then(data=>{
                this.tableData = data.result.list.map(v =>{
                    return {
                        goodname:v.list_goods_info_name,
                        state:(v.goods_id_state == 0?'未下载':(v.goods_id_state == 1?'正在下载':(v.goods_id_state == -1?'下载失败':'正常'))),
                        id:v.goods_id_goods_id,
                    }
                })
            })
            let id = {
                dispaly_device_id:this.$route.query.id
            }
            bind_id_Imgs(id).then(data =>{
                data.result.list.map(c => {
                    let urls = {
                        pic_url:c.banner_pic_url,
                        display_device_banner_id:c.id,
                    }
                    this.img_lists.push(urls)      
                })
            })
        },

      delete_goods(index){
        //确认解除
            this.$confirm('删除该商品后将无法撤回，是否继续', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() =>{
                let banId = {
                   goods_id:this.tableData[index].id,
                   display_device_id:this.$route.query.id,
                   uid:this.uid
                }
                delete_id_goods(banId).then(data => {
                    this.tableData.splice(index,1)
                    this.getVideoList()
                })  
            })
      },
      handleDelete(index,row){
          this.dialogDelete = false;
          tableData = this.tableData.splice(index,1)          
      },
      update_goods(){
          //上传商品
          this.dialogFormVisible = true
          let  inf = {
              uid:this.uid
          }
          updatavideo(inf).then(data =>{
            let pageSize = this.pageinationInfo.pageSize //每页显示5条
            let startIndex = (this.pageinationInfo.currentPage - 1) * pageSize  //当前页起始下标
            let endIndex =(this.pageinationInfo.currentPage * pageSize )  //当前页起始下标
            this.arr = data.result.video_list.map(v => {
                 return{
                     name:v.video.goods.info_name,
                     goods_id:v.video.goods.info_id,
                 }
            })

              this.pageinationInfo.total =  this.arr.length
              this.gridData = this.arr.slice(startIndex,endIndex)
              console.log(this.gridData)  
          }) 
      },
    goods_selectionchange(val){
        this.goodId = val.map(data=>{
           return data.goods_id
        })
    },
    imgs_selectionchange(val){
        this.ids = val.map(data =>{
            return data.banner_ids
        })
    },
    save_Goods(){
        this.dialogFormVisible = false;
        let val = {
            display_device_id:this.$route.query.id,
            goods_ids:this.goodId+'',
            uid:this.uid
        }
        online_goods(val).then(data=>{
             this.getimg_List();
        })
      },
      delete_bind_img(img){
          //删除绑定轮播图
         // console.log(index)
            this.$confirm('删除该轮播图后将无法撤回，是否继续', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                let info ={
                    display_device_banner_id:img.display_device_banner_id
                }
                delete_bind_imgs(info).then(data =>{
                     this.img_lists = []
                     this.getimg_List();
                })
                //this.img_lists.splice(this,1)
          })

      },
      add_imgs(){
          //加载所有素材图
            this.dialogTableVisible = true
            let id = {
                uid:this.uid
            }
            this.imgLists=[]
            allPic_imgs(id).then(data =>{
                data.result.map(o =>{
                    let img_url ={
                        pic_url:o.pic_url,
                        banner_ids:o.id
                    }
                    this.imgLists.push(img_url)
                })
            })
      },
      add_imgs_lun(){
         //点击添加 绑定轮播图
         this.dialogTableVisible =false
         let inf = {
             dispaly_device_id:this.$route.query.id,
             banner_ids:this.ids+',',
             uid:this.uid
         }
        bind_imgs(inf).then(()=>{
            this.img_lists =[]
            this.getimg_List()
        })
      },
      //分页
         handleCurrentChange(currentPage) {
             //当前页变动时候触发的事件
            this.pageinationInfo.currentPage = currentPage;
            this.update_goods()
        },
         handleSizeChange(size) {
            //pageSize 改变时会触发
            this.pageinationInfo.pageSize = size;
            this.update_goods()
        },
        addDisplay(){
            this.$router.push({ path: '/bindList' });
        },
        good_searchChange(){
            if(this.good_search !== ''){
                 let name = this.good_search
                 this.gridData = this.arr.filter(function(value){
                     return new RegExp(`${name}`,'i').test(value.name)
                 })
            }
            else{
                this.update_goods()
            }
        }
    }
  }
</script>
<style>
    .imglist{
        border:1px #999 dashed;
        border-radius:5px;
        background:white;
    }
    .imglist active{
        border:1px bule dashed;
        border-radius:5px;
        background:white;
    }
    .updataimg{
        margin-top:-55px;
        float:right;
        background-color:#70a5ec;
        outline:none;
        border:none;
        color:white;
    }
    .updataimg:hover{
        margin-top:-55px;
        float:right;
        color:white;
        background-color:#70a5ec;
        outline:none;
        border:none;
    }
    .btn_red_color{
        background:#E0595B;
        opacity:0.66;
        outline:none;
        color:white;
        border:none;
    }
    .btn_red_color:hover{
        background:#E0595B;
        opacity:0.66;
        border:none;
        outline:none;
        color:white;
    }
</style>