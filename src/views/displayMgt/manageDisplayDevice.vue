<template>
	<el-row>
  		<el-col :span="24" style='margin-top:20px;'>
		  	<span>选择门店：
				<el-select v-model="optionsValue" placeholder="请选择" @change='search_Goods'>
					<el-option
						v-for="item in options"
						:key="item"
						:label="item"
						:value="item">
					</el-option>
				</el-select>
			</span>
			<el-input placeholder="请输入广告机名称搜索" v-model="input2"  class='inp_seach' @change='search_Goods'></el-input>
		</el-col>
		<el-col :span='24' style='margin-top:20px;'>
			<el-table class='table'
      			:data="tableData"
      			style="width: 100%;">
				<el-table-column
					prop="name"
					label="广告机名称"
					width="300" align='center'>
				</el-table-column>
				<el-table-column
					prop="shop"
					label="所属门店"
					width="300" align='center'>
				</el-table-column>
				<el-table-column
					prop="state"
					label="广告机状态"  align='center'>
				</el-table-column>
				<el-table-column
					label="操作" align='center'>
					<template scope="scope">
        				<el-button @click="edit(scope.$index,scope.row.id)" type="text" size="small">查看并编辑</el-button>
     				 </template>
				</el-table-column>
    		</el-table>
		</el-col>
		<el-col :span='24' align='right'>
			<el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="pageinationInfo.currentPage" :page-sizes="[10]" :page-size="pageinationInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageinationInfo.total">
            </el-pagination>
		</el-col>
	</el-row>
</template>
<script>
import moment from 'moment';
import {getShop,display_list,search_goods,get_shop} from '../../api/display'
    export default {
      data() {
        return {
			tableData:[],
			optionsValue:'全部',
			options:['全部'],
			dpy_list:{
				name:null,
				shop_id:null
			},
			input2:'',
			info:{
				shop_id:'',
				name:'',
				page:''
			},
			pageinationInfo: {
				currentPage: 1,
				pageSize: 10,
				total: 0,
			},
			shopId:'',
			uid:'',
			shopIds:['']
        }
      },
	mounted(){
		this.uid = localStorage.getItem('uid');
        this.getFocusList()
    },
		methods:{
		edit (index,id) {
			const path = '/editDevice?id=' + id;
			this.$router.push({ path: path });
		},
		getList(param){
			search_goods(param).then(data=>{ 
					this.pageinationInfo.total = data.total_count
					let time = new Date().getTime();
					this.tableData = data.result.map( v=>{
						const {heartbeat_time=0} = v.data;
						return{
							name:v.data.name,
							shop:v.data.shop_name || '无门店信息',
							state:(time - heartbeat_time >= 1000*3600)?'不正常':'正常',
							id:v.data.shop_id
						}
					})
			})
		},
		getFocusList(){//加载页面时候加载门店		
			//当前页
			let uid = {
				uid:this.uid
			}
			getShop(uid).then(data =>{
				data.result.map(v =>{
					this.options.push(v.data.shop)
					this.shopIds.push(v.id)
				})
			})
			let param = {}
			param.limit = 10
				this.getList(param)
				this.pageinationInfo.currentPage = currentPage
			//this.getList(param)
        },
		  //分页
        currentChange(currentPage) {
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
		search_Goods(){
			console.log(this.shopIds)
			console.log(this.options
			)
			let param = {}
			param.limit = 10
			if(this.input2){
				//搜索框有值
				param.name = this.input2
				if(this.optionsValue !== '全部'){
					param.shop_id =this.shopIds[this.options.indexOf(this.optionsValue)] + ''
				}
			}else{
				if(this.optionsValue !== '全部'){
					param.shop_id =this.shopIds[this.options.indexOf(this.optionsValue)] + ''
				}
			}
				 this.getList(param)
		}
    },
}
  </script>
<style>
	.inp_seach{
		width:280px;
		margin-left:50px;
	}
	.block{
		margin-top:20px;
	}
</style>