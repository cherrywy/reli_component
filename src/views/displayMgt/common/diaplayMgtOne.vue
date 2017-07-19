<template>
    <section>
       <el-col :span='24'>
           <span>默认广告</span>
           <el-table :data="defaultad" border style="width: 100%; margin-top: 15px;">
            <el-table-column  label="展位名称" align="center" width="350">
            </el-table-column>
            <el-table-column label="商品名称" width="400" align="center" prop="name">
            </el-table-column>
            <el-table-column label="操作" align="center" >
                <template scope="scope">
                    <el-button size='small'  @click="deletegoods(scope.$index,scope.row.goods_id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
       </el-col>
       <el-col :span='24'>
           <span>互动广告</span>
           <el-table :data="interactivead" border style="width: 100%; margin-top: 15px;">
            <el-table-column label="展位名称" align="center" width="350">
            </el-table-column>
            <el-table-column label="商品名称" width="400" align="center" prop="name">
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template scope="scope">
                    <el-button size='small'  @click="delete_goods(scope.$index,scope.row.goods_id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
       </el-col>
    </section>
</template>
<script>
import {adgoodlist,interactivead_list,delete_defaultad,delete_interactivead} from '../../../api/display'
  export default {
    data() {
      return {
         defaultad:[],
         interactivead:[],

      }
    },
    mounted() {
        this.getGoods_List();
    },
    methods:{
        getGoods_List(){
            let info = {
                display_device_id:this.$route.query.id
            }
            adgoodlist(info).then(data =>{
               this.defaultad = data.result.map(v =>{
                   return{
                       name:v.data.name,
                       id:v.id
                   }
                })
                //console.log(this.defaultad)
            })
            interactivead_list(info).then(data =>{
                this.interactivead =  data.result.map( v => {
                    return {
                        name:v.data.name,
                        id:v.id
                    }
                })
                console.log(this.interactivead)
            })
        },
        delete_goods(index){
            //删除默认
            this.$confirm('是否确定删除', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() =>{
                let inf = {
                   adver_number:index + 1,
                   display_device_id:this.$route.query.id
                }
                delete_defaultad(inf).then(data => {
                    this.defaultad.splice(index,1)
                    this.getGoods_List()
                })
            })
        },
        delete_goods(index){
            //删除互动
            this.$confirm('是否确定删除', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() =>{
                let inf = {
                   goods_id: this.interactivead[index].id,
                   display_device_id:this.$route.query.id
                }
                delete_interactivead(inf).then(data => {
                    this.interactivead.splice(index,1)
                    this.getGoods_List()
                })
            })
        },
    }
}
</script>