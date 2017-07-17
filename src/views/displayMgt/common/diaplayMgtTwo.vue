<template>
    <section>
        <el-row>
            <el-col :span='24'>
                <span>轮播图</span>
            </el-col>
            <el-col :span='24'>
                <el-upload
                    class="upload-demo"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    list-type="picture-card"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                    :file-list="fileList2">
                <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog v-model="dialogVisible" size="tiny">
                      <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </el-col>
            <el-col :span='24' style='margin-top:20px'>
                <span>显示商品</span>
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
                                    <el-table :data="gridData" style='marign-top:10px;'>
                                            <el-table-column property="date" label="选择" width="200"></el-table-column>
                                            <el-table-column property="name" label="商品名称" ></el-table-column>
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
        </el-row>
    </section>
</template>
<script>
 import {bind_id_Imgs,carouselImgs,bind_id_goods,delete_id_goods} from '../../../api/display'
  export default {
      
     
    data() {
      return {
        fileList2: [],
        tableData:[],
        dialogFormVisible: false,
        dialogDelete:false,
        formLabelWidth:'120px'
      };
    },
    mounted() {
        this.getimg_List();
    },
    methods: {
        getimg_List(){
            let bind_id = this.$route.query.id   
            console.log(bind_id)
            let info = {
                display_device_id:bind_id
            }
            bind_id_goods(info).then(data=>{
                this.tableData = data.result.list.map(v =>{
                    return {
                        goodname:v.list_goods_info_name,
                        state:v.list_goods_tag_goods_value,
                        id:v.goods_id_id
                    }
                })
                console.log(data.result.list)
            })
        },
         
      handleRemove(file, fileList) {
        //console.log(file, fileList);
      },
      handlePreview(file) {
        //console.log(file);
      },
      delete_goods(index){
        //确认解除
            this.$confirm('删除该商品后将无法撤回，是否继续', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() =>{
                //let goods_id = this.tableData[index].id
                console.log(this.tableData[index].id)
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
        //console.log(tableData)
      },
      handleDelete(index,row){
         // alert(111)
          this.dialogDelete = false;
          tableData = this.tableData.splice(index,1)          
      }
    }
  }
</script>