<template>
    <section>
            <el-col :span='24'>
                <span>轮播图</span>
            </el-col>
            <el-col :span='24'>
            <ul v-for='img in img_lists'  style='float:left;'>
                <li class='el-icon-delete'>
                    <img width='150' height='150' :src="img.pic_url"  @click="delete_bind_img(img)">
                </li>
            </ul>
            <p>
            <el-button style='width:150px;height:150px;border-style:dashed;margin-left:50px;margin-top:12px;' @click='add_imgs'><i class="el-icon-plus"></i></el-button>
            </p>
            <el-dialog  :visible.sync="dialogTableVisible">
                <template>
                     <!--<el-checkbox-group v-for="img in imgLists" style='float:left;'>
                        <el-checkbox>
                            <template>
                                <img width='80' height='80' :src="img.pic_url" style='border:1px #999 dashed;'>
                            </template>
                        </el-checkbox>
                    </el-checkbox-group>-->
                  <el-table :data="imgLists" style='marign-top:10px;'  @cell-click="handleSelect">
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
           <el-col :span='24' style='margin-top:20px;'>
             <h3>显示商品</h3>
           </el-col>
               
            <el-col :span='4' :push='20'>
                  <el-button @click='update_goods'>上传商品</el-button>
            </el-col>
              
            <el-col :span='24' style='margin-top:20px'>
               
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
                                @click="delete_goods(scope.$index)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
            <el-dialog :visible.sync="dialogFormVisible">
                <el-form :model="form">
                    <el-form-item  :label-width="formLabelWidth">
                        <el-input v-model="input" placeholder="请输入商品名称搜索" auto-complete="off" style='width:200px;'></el-input>
                    </el-form-item>
                    <el-form-item  :label-width="formLabelWidth" align='right'>
                        <span>找不到商品？去<el-button type='text'>添加</el-button></span>
                    </el-form-item>
                    <el-form-item  :label-width="formLabelWidth">
                        <el-table :data="gridData" style='marign-top:10px;' @cell-click="handleSelect">
                                <el-table-column type='selection' label="选择" width="200"></el-table-column>
                                <el-table-column prop="name" label="商品名称" ></el-table-column>
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
                    <el-button type="primary" @click="save_Goods">保 存</el-button>
                </div>
            </el-dialog>

          
    </section>
</template>
<script>
 import {delete_bind_imgs,bind_id_Imgs,carouselImgs,bind_id_goods,delete_id_goods,updatavideo,online_goods,allPic_imgs,bind_imgs} from '../../../api/display'
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
        formLabelWidth:'120px',
        gridData:[],
        good_name:'',
        goodId:[],
        selectAry:[],
        goods_ids:'',
        dialogImageUrl:'',
        dialogTableVisible:false,
        ids:[],
        add_info:{},
      };
    },
    mounted() {
        this.getimg_List();
    },
    methods: {
        getimg_List(){
            let bind_id = this.$route.query.id   
            let info = {
                display_device_id:bind_id
            }
            bind_id_goods(info).then(data=>{
                this.tableData = data.result.list.map(v =>{
                    return {
                        goodname:v.list_goods_info_name,
                        state:v.list_goods_tag_goods_value,
                        id:v.goods_id_goods_id
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
                console.log(this.img_lists)
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
                   uid:1209811640320002
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
              uid:"1209811640320002"
          }
          updatavideo(inf).then(data =>{
              this.gridData = data.result.video_list.map(v => {
                 return{
                     name:v.video.goods.info_name,
                     goods_id:v.video.goods.info_id,
                 }
              })
          })
      },
     handleSelect(row){
            this.good_name = row.name
            let newid= row.goods_id +','
            if(this.goodId.indexOf(newid) == -1){
                this.goodId.push(newid)
            }
     },
    save_Goods(){
        this.dialogFormVisible = false;
        let val = {
            display_device_id:this.$route.query.id,
            goods_ids:this.goodId + '<br/>',
            uid:"1209811640320002"
        }
        online_goods(val).then(data=>{
            this.tableData =  data.result.list.map( val =>{
                return {
                    goodname:val.goods_id_goods_name,
                    state:val.goods_id_state==0?'未下载':(goods_id_state == 1?'正在下载':'正常')
                }
            })
        })
      },
      delete_bind_img(img){
          //删除绑定轮播图
          console.log(img)
            this.$confirm('删除该轮播图后将无法撤回，是否继续', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                let info ={
                    display_device_banner_id:img.display_device_banner_id
                }
                delete_bind_imgs(info)
                this.img_lists.splice(this,1)
          })

      },
      add_imgs(){
          //加载所有素材图
            this.dialogTableVisible = true
            let id = {
                uid:'1209811640320002'
            }
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
      handleSelect(row){    
          //选择图片
         if(this.ids.indexOf(row.banner_ids) == -1){
             this.ids.push(row.banner_ids)
         }
         this.add_info = {
             pic_url:row.pic_url,
             banner_ids:row.banner_ids
         }
      },
      add_imgs_lun(){
         //点击添加 绑定轮播图
         this.dialogTableVisible =false
         let inf = {
             dispaly_device_id:this.$route.query.id,
             banner_ids:this.ids+',',
             uid:'1209811640320002'
         }
        bind_imgs(inf).then(()=>{
            this.img_lists =[]
            this.getimg_List()
        })
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
</style>