<template>
    <section>
        <el-col :span ='24' v-if='true'>
            <el-col :span='6' style='margin-top:25px;margin-left:-50px;'>
                 <el-input placeholder="请输入商品名称搜索" v-model="input"  class='inp_seach' @change='videoChange'></el-input>
            </el-col>
            <el-col :span='18' align='right' style='margin-top:25px;'>
                <el-button class='btn_color' @click='bindList'>绑定素材</el-button>
            </el-col>
            <el-col :span='24' style='margin-top:20px'>
                <el-table :data="tableData" border style="width: 100%; margin-top: 15px;">
                     <el-table-column label="商品图片" width="100" align="center">
                        <template scope="scope">
                            <img width='50' height='50' :src="scope.row.img">
                        </template>
                     </el-table-column>
                    <el-table-column prop="goodname" label="商品名称" align="center" width="180">
                    </el-table-column>
                    <el-table-column label="商品标签" width="80" align="center" prop="goodtag">
                    </el-table-column>
                    <el-table-column prop="goodprice" label="商品价格（元）" align="center" width="100">
                    </el-table-column>
                    <el-table-column prop="bindvideo" label="绑定视频" width="100" align="center">
                    </el-table-column>
                    <el-table-column prop="bindaddress" label="商品详情地址" align="center">
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="200" >
                        <template scope="scope">
                            <el-button size='small' class='btn_red_color' @click="deletegoods(scope.$index,scope.row.id)">解除绑定</el-button>
                            <el-button size='small' class='btn_color' @click="changeDiaplay(scope.$index,scope.row.id)">更换素材</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
            <el-col :span='24' align='right'>
               <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageinationInfo.currentPage" :page-sizes="[5, 10,]" :page-size="pageinationInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageinationInfo.total">
               </el-pagination>
            </el-col>
        </el-col>
    </section>
</template>
<script>
import {deleteBindGoods,updatavideo} from '../../../api/display'
export default {
    data() {
        return {
		  tableData:[],
          arr:[],
          video_list:{},
          dialogFormVisible:false,
          dialogDelete:false,
          imgs:'',
          inx:null,
          new_list:null,
          pageinationInfo: {
            currentPage: 1,
            pageSize: 5,
            total: 0,
         },
         input:'',
         uid:'',
         state:'viewTwovideo'
        }
    },
	mounted:function(){
        this.uid = localStorage.getItem('uid');
        this.getVideoList()
	},
	methods:{
		bindList:function () {
			this.$router.push({path:'/bindList'});
		},
        getVideoList(){
            //加载视频信息
            let id = {
               uid:this.uid
            }
            updatavideo(id).then(data=>{  
                this.pageinationInfo.total = data.result.video_list.length
                let pageSize = this.pageinationInfo.pageSize //每页显示5条
                let startIndex = (this.pageinationInfo.currentPage - 1) * pageSize  //当前页起始下标
                let endIndex =(this.pageinationInfo.currentPage * pageSize )  //当前页起始下标
                this.arr = data.result.video_list.map(v=>{
                    // const {goods} = v.video;
                    const goods_pics = v.video.goods.info_title_pics?v.video.goods.info_title_pics[0]:null;
                    const img = v.video.goods.pic_url?v.video.goods.pic_url:goods_pics;
                    return {
                        img:img,
                        goodname:v.video.goods.info_name,
                        goodtag:v.video.goods.tag_goods_value,
                        goodprice:v.video.goods.price_goods_value,
                        bindvideo:v.video.goods.vedio_url_url?'是':'否',
                        bindaddress:v.video.goods.jump_url_url,
                        id:v.video.goods.info_id
                    }
                })
                this.tableData = this.arr.slice(startIndex,endIndex)
                console.log(this.tableData)
            })
        },
        videoChange(){
            if(this.input !== ''){
                let name = this.input
                    this.tableData= this.arr.filter(function(value){
                        return new RegExp(`${name}`,'i').test(value.goodname);
                })
                console.log(this.tableData)
            }else{
                this.getVideoList()
            }
        },
        deletegoods(index,id){
            //确认解除
            this.$confirm('删除该商品后将无法撤回，是否继续', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() =>{
                //当前页1
                let page = this.pageinationInfo.currentPage  
                //每页数量5
                let size = this.pageinationInfo.pageSize
                //获取点击的index
                let allIndex = (page - 1) * size + index
                let banId = {
                   goods_id:id,
                   uid:this.uid
                }
                deleteBindGoods(banId).then(data => {
                    this.tableData.splice(this.inx,1)
                    this.getVideoList()
                })  
            })
         },
         changeDiaplay(index,id){
        //更换素材
            //当前页1
            let page = this.pageinationInfo.currentPage  
            //每页数量5
            let size = this.pageinationInfo.pageSize
            //获取点击的index
            let allIndex = (page - 1) * size + index
            const path = '/bindList?goods_id=' + id;
            this.$router.push({ path: path });
         },
         //分页
         handleCurrentChange(currentPage) {
             //当前页变动时候触发的事件
            this.pageinationInfo.currentPage = currentPage;
            this.getVideoList()
        },
         handleSizeChange(size) {
            //pageSize 改变时会触发
            this.pageinationInfo.pageSize = size;
            this.getVideoList()
        },

	}
 }
</script>
<style>
    .btn_color{
        background-color:#70a5ec;
        outline:none;
        border:none;
        color:white;
    }
    .btn_color:hover{
        color:white;
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