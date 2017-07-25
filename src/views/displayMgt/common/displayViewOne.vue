<template>
	<section>
		<el-row>
			<el-col :span='6' style='margin:20px 0px;'><el-input v-model="inputInfo" placeholder="请输入商品名称" @change='input_change'></el-input></el-col>
            <el-col :span='18' align='right' style='margin-top:20px;'>
                <el-button type="primary" @click='bindList'>绑定素材</el-button>
            </el-col>

			<el-col :span='24'>
				 <el-table :data="tableData" border style="width: 100%; margin-top: 15px;">
            <el-table-column prop="goodname" label="商品名称" align="center" width="300">
            </el-table-column>
            <el-table-column label="绑定图片数量" width="100" align="center" prop="goodnum">
            </el-table-column>
            <el-table-column prop="bindvideo" label="绑定视频" width="100" align="center">
            </el-table-column>
            <el-table-column prop="bindurl" label="URl地址" width="300" align="center">
            </el-table-column>
            <el-table-column label="操作" align="center" >
                <template scope="scope"  width="250" >
                    <el-button size='small' class='btn_red_color' @click="deletegoods(scope.$index,scope.row.goods_id)">解除绑定</el-button>
                    <el-button size='small' class='btn_color' @click="changeDiaplay(scope.$index,scope.row.goods_id)">更换素材</el-button>
                </template>
            </el-table-column>
        </el-table>
			</el-col>

            <el-col :span='24' align='right' style='margin-top:20px;'>
               <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageinationInfo.currentPage" :page-sizes="[5, 10,]" :page-size="pageinationInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageinationInfo.total">
               </el-pagination>
            </el-col>
		</el-row>
	</section>
</template>
<script>
import {getOneList,deleteOneList} from '../../../api/display'

export default {
	data(){
		return{
			 pageinationInfo: {
                currentPage: 1,
                pageSize: 5,
                total: 0,
            },
			tableData:[],
            allGoods:[],
            uid:'',
		}
	},
	mounted(){
        this.uid = localStorage.getItem('uid');
        this.getInfomation()
	},
	methods:{
		getInfomation(){
			//获取列表详情
            let uid = {
                uid:this.uid,
            }
			getOneList(uid).then(data =>{
                let pageSize = this.pageinationInfo.pageSize //每页显示5条
                let startIndex = (this.pageinationInfo.currentPage - 1) * pageSize  //当前页起始下标
                let endIndex =(this.pageinationInfo.currentPage * pageSize )  //当前页起始下标
                this.pageinationInfo.total = data.result.list.length
				this.allGoods = data.result.list.map(v => {
                    return {
                        goodname:v.display_goods[0].name,
                        goodnum:v.display_banner.length,
                        bindvideo:(v.display_video_url[0].url)?'是':'否',
                        bindurl:v.display_jump_url[0].url,
                        goods_id:v.display_goods[0].id,
                    }
                })
                this.tableData = this.allGoods.slice(startIndex,endIndex)
			})
		},
		deletegoods(index,goods_id){
            //确认解除
            this.$confirm('是否确定解除绑定？解除绑定后素材将失效', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() =>{
                 //当前也页
                let page = this.pageinationInfo.currentPage  
                //每页数量5
                let size = this.pageinationInfo.pageSize
                let allIndex = (page - 1) * size + index
                //获取点击的index
                let banId = {
                   goods_id:goods_id,
                   uid:this.uid,
                }
                deleteOneList(banId).then(data =>{
                    
                    if(data.error_code == 0){
                        this.$message({
                            message:'解除绑定成功',
                            type: 'success'
                        })
                    }else{
                        this.$message( {
                            message:'解除绑定失败',
                            type: 'error'

                        })
                    }
                    this.getInfomation();
                })  
            })
        },
        bindList(){
            //绑定素材
            this.$router.push({ path: '/bind_list' });
         },
        changeDiaplay(index,goods_id){
        //更新素材
            //当前也页
            let page = this.pageinationInfo.currentPage  
            //每页数量5
            let size = this.pageinationInfo.pageSize
            //获取点击的index
            let allIndex = (page - 1) * size + index
            let id= goods_id
            const path = '/bind_list?goods_id=' + id;
            this.$router.push({ path: path });	
        },
         input_change(){
             //搜索
            let name = this.inputInfo
            if(name !== ''){
                this.tableData= this.allGoods.filter(function(value){
                     return new RegExp(`${name}`,'i').test(value.goodname);
                })
            }else{
                this.getInfomation()
            }
         },
         handleSizeChange(pageSize){
             //改变每页显示数量
                this.pageinationInfo.pageSize = pageSize;
                this.getInfomation()
         },
         handleCurrentChange(currentPage){
             //改变当前也页
                this.pageinationInfo.currentPage = currentPage;
                this.getInfomation()
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