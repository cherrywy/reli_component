<template>
    <section>
       <el-col :span='24'>
           <span>默认广告</span>
           <el-table :data="defaultad" border style="width: 100%; margin-top: 15px;">
            <el-table-column  label="展位名称" align="center" width="350" prop='num'>
            </el-table-column>
            <el-table-column label="商品名称" width="400" align="center" prop="name">
            </el-table-column>
            <el-table-column label="操作" align="center" prop="show">
                <template scope="scope">
                    <el-button size='small'  @click="deletegoods(scope.$index,scope.row.show,scope.row.id)">{{scope.row.show}}</el-button>
                </template>
            </el-table-column>
        </el-table>
       </el-col>
       <el-col :span='24'>
           <span>互动广告</span>
           <el-table :data="interactivead" border style="width: 100%; margin-top: 15px;">
            <el-table-column label="商品名称" width="400" align="center" prop="name">
            </el-table-column>
            <el-table-column label="素材状态" align="center" width="350" prop='state'>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template scope="scope">
                    <el-button size='small'  @click="delete_goods(scope.$index,scope.row.goods_id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-col :span='24' align='center' style='margin-top:10px;'>
             <el-button style='width:200px;' @click='addGoods'>+</el-button>
        </el-col>
       </el-col>
       <el-dialog :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item  :label-width="formLabelWidth">
                    <el-input 
                    v-model="searchVal"           
                    placeholder="请输入商品名称搜索" 
                    class='inp_seach'
                    auto-complete="off" 
                    style='width:200px;' 
                    @change='goods_name_change'></el-input>
                </el-form-item>
                <el-form-item  :label-width="formLabelWidth" align='right'>
                    <span>找不到商品？去<el-button type='text' @click='add_goods'>添加</el-button></span>
                </el-form-item>
                <el-form-item  :label-width="formLabelWidth">
                    <el-table :data="tableData" style='marign-top:10px;'  @selection-change="goods_selectionchange">
                            <el-table-column label="选择" width="200" type='selection'></el-table-column>
                            <el-table-column label="商品名称" prop='name'></el-table-column>
                    </el-table>
                </el-form-item>
            </el-form>
            <el-form align='right'>
                <div class="block">
                    <el-pagination @current-change="handleCurrentChange" @size-change="sizeChange" :current-page="pageinationInfo.currentPage" :page-sizes="[5,10]" :page-size="pageinationInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageinationInfo.total">
                    </el-pagination>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer" align='center'>
                <el-button type="primary" @click="saveChangeGoods">保 存</el-button>
            </div>
        </el-dialog>
    </section>
</template>
<script>
import {bind_dd_goods,getAlllist,adgoodlist,interactivead_list,delete_defaultad,delete_interactivead} from '../../../api/display'
  export default {
    data() {
      return {
         defaultad:[],
         interactivead:[],
         dialogFormVisible:false,
         fileList:[],
         formLabelWidth:'120px;',
         pageinationInfo:{
             pageSize:5,
             total:'',
             currentPage:1,
         },
         form:'',
         searchVal:'',
         tableData:[],
      }
    },
    mounted() {
        this.getGoods_List();
    },
    methods:{
      getGoods_List(){
          let info = {
              //this.$route.query.id
              display_device_id:1291185013457004,
          }
          this.defaultad=[
              {
                  num:'展位一',
                  name:'',
                  id:'',
                  show:'',
              },{
                  num:'展位二',
                  name:'',
                  id:'',
                  show:'',
              },{
                  num:'展位三',
                  name:'',
                  id:'',
                  show:'',
              },{
                  num:'展位四',
                  name:'',
                  id:'',
                  show:'',
              }
          ]
          getAlllist(info).then(data =>{
              for(let i= 0;i<=3;i++){//dd_goods_id
                  this.defaultad[i].name = (data.result.def_dd.list[i])?data.result.def_dd.list[i].adver_number_goods_name : '空'
                  this.defaultad[i].id = (data.result.def_dd.list[i])?data.result.def_dd.list[i].dd_goods_id : ''
                  this.defaultad[i].show = (this.defaultad[i].name == '空') ? '添加' : '删除'
              }
              this.interactivead = data.result.int_dd.list.map(v=>{
                    return {
                        name:v.dd_goods_name,
                        state:v.dd_video_display_type,
                        id:v.dd_goods_id,
                    }
              })
          })
        },
        deletegoods(index,show,id){
            console.log(id)
            if(show == '删除'){
                 this.$confirm('删除该商品后将无法撤回，是否继续', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    let info ={
                        id:id
                    }
                    delete_defaultad(info).then(data=>{
                        console.log(data.result)
                    })
                })
            }
            if(show == '添加'){
                this.dialogFormVisible = true
                let inf = {
                     display_device_id:1291185013457004
                }
                interactivead_list(inf).then(data=>{
                    console.log(data.result)
                })
            }
        },
        delete_goods(index,row){
            //删除
                console.log(row)
                this.$confirm('删除该商品后将无法撤回，是否继续', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    let info= {
                        id:this.interactivead[index].id
                    } 
                    delete_defaultad(info).then(data=>{
                        console.log(data.result)
                    })
                })
        },
        addGoods(){
            //添加互动广告
            this.dialogFormVisible = true
            let info = {
                display_device_id:1291185013457004
            }
            getAlllist(info).then(data=>{
                
            })
        },
        saveChangeGoods(){
            alert('保存')
        },
        goods_name_change(){
            console.log(this.searchVal)
        },
        add_goods(){
            alert('跳转添加商品也')
        },
        goods_selectionchange(val){
            console.log(val)
        },
          //分页
        handleCurrentChange(currentPage) {
             //当前页变动时候触发的事件
            this.pageinationInfo.currentPage = currentPage;
			let param = {
					limit:10,
					page:currentPage
			} 
            this.getList(param)
        },
        sizeChange(size) {
            //pageSize 改变时会触发
            this.pageinationInfo.pageSize = size;
            this.getFocusList()
        },
    }
}
</script>