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
                    <el-button size='small'  @click="delete_goods(scope.$index,scope.row.id)">删除</el-button>
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
                            <el-table-column label="商品名称" prop='good_name'></el-table-column>
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
import {bind_inf_goods,bind_dd_goods,getAlllist,adgoodlist,interactivead_list,delete_defaultad,delete_interactivead} from '../../../api/display'
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
             total:null,
             currentPage:1,
         },
         form:'',
         searchVal:'',
         tableData:[],
         form:'',
         arr:[],
         uid:'',
         good_index:null,
         goods_id:'',
         index:'',
         display_device_id:'',
      }
    },
    mounted() {
        this.uid = localStorage.getItem('uid');
        this.display_device_id = this.$route.query.id;
        this.getGoods_List();
    },
    methods:{
      getGoods_List(){
          let info = {
              display_device_id:this.display_device_id,
          }
          this.defaultad=[
              {
                  num:'展位一',
                  name:'空',
                  id:'',
                  show:'添加',
              },{
                  num:'展位二',
                  name:'空',
                  id:'',
                  show:'添加',
              },{
                  num:'展位三',
                  name:'空',
                  id:'',
                  show:'添加',
              },{
                  num:'展位四',
                  name:'空',
                  id:'',
                  show:'添加',
              }
          ]
          getAlllist(info).then(data =>{
            data.result.def_dd.list.map(v =>{
               let index = v.adver_number_adver_number-1
               this.defaultad[index].name = v.dd_goods_name
               this.defaultad[index].id = v.dd_goods_id
               this.defaultad[index].show = (this.defaultad[index].name !== '空') ? '删除' : '添加'
            })
            this.interactivead = data.result.int_dd.list.map(v=>{
                    return {
                        name:v.dd_goods_name,
                        state:(v.dd_video_display_type==0)?'未下载':(v.dd_video_display_type == 1 ? '下载中' :(v.dd_video_display_type==-2?'下载失败':'正常')),
                        id:v.dd_goods_id,
                     }
             })
          })
        },
        deletegoods(index,show,id){
            //删除默认
            this.good_index = index
            if(show == '删除'){
                 this.$confirm('删除该商品后将无法撤回，是否继续', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    let info ={
                     adver_number:index+1,
                     display_device_id:this.display_device_id,
                    }
                    delete_defaultad(info).then(data=>{
                        if(data.error_code == 0){
                            this.$confirm('提示', {
                                message:'删除成功',
                                type: 'success'
                            })
                        }else{
                            this.$confirm('提示', {
                                message:'删除失败',
                                type: 'error'
                            })
                        }
                        this.getGoods_List();
                    })
                })
            }
            if(show == '添加'){
                this.dialogFormVisible = true
                this. show_goods_list()
            }
        },
        goods_selectionchange(val){
            //选择商品
            this.goods_id = val[0].id
            console.log(this.goods_id)
            if(val.length > 1){
                this.$confirm( '提示', {
                    message:'只能选择一个商品',
                    type: 'error'
                })
            }
        },
        show_goods_list(){
            let param = {
                display_device_id:this.display_device_id,
            }
            interactivead_list(param).then(data=>{
                let pageSize = this.pageinationInfo.pageSize //每页显示5条
                let startIndex = (this.pageinationInfo.currentPage - 1) * pageSize  //当前页起始下标
                let endIndex =(this.pageinationInfo.currentPage * pageSize )  //当前页起始下标
                this.arr = data.result.map(v =>{
                    return {
                            good_name:v.data.name,
                            id:v.id,
                     }
                })
                this.tableData = this.arr.slice(startIndex,endIndex)
                this.pageinationInfo.total = data.result.length
             })
        },
        delete_goods(index,id){
         //删除默认商品
            this.$confirm('删除该商品后将无法撤回，是否继续', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                let info= {
                    goods_id:id,
                    display_device_id:this.display_device_id,
                } 
                delete_interactivead(info).then(data=>{
                    if(data.error_code == 0){
                        this.$confirm('提示', {
                            message:'删除成功',
                            type: 'success'
                        })
                    }else{
                        this.$confirm('提示', {
                            message:'删除失败',
                            type: 'error'
                        })
                    }
                    this.getGoods_List();
                })
            })
        },
        addGoods(){
        //添加互动广告
             this.dialogFormVisible = true
             this.show_goods_list()
        },
        saveChangeGoods(){
        //添加绑定商品
            let good_info = {
                    display_device_id:this.display_device_id,
                    goods_id:this.goods_id,
                    uid:this.uid,
            }
            if(this.good_index){
                good_info.adver_number = this.good_index +1
                bind_inf_goods(good_info).then(data=>{
                    if(data.error_code == 0){
                        this.$confirm('提示', {
                            message:'添加成功',
                            type: 'success'
                        })
                    }else{
                        this.$confirm('提示', {
                            message:'添加失败',
                            type: 'error'
                        })
                    }
                this.dialogFormVisible = false;
                this.getGoods_List();
               })
            }else{
                bind_dd_goods(good_info).then(data =>{
                     this.dialogFormVisible = false;
                    this.getGoods_List();
                })
            }
            
        },
        goods_name_change(){
            //搜索
            console.log(this.searchVal)
             if(this.searchVal !== ''){
                let name = this.searchVal
                    this.tableData= this.arr.filter(function(value){
                        return new RegExp(`${name}`,'i').test(value.good_name);
                   })
            }else{
                this.show_goods_list()
            }
        },
        add_goods(){
             this.$router.push({ path: '/goodsMgtNew' });
        },
          //分页
        handleCurrentChange(currentPage) {
             //当前页变动时候触发的事件
            this.pageinationInfo.currentPage = currentPage;
            this.show_goods_list()
        },
        sizeChange(size) {
            //pageSize 改变时会触发
            this.pageinationInfo.pageSize = size;
            this.getFocusList()
        },
    }
}
</script>