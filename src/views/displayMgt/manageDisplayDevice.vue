<template>
	<el-row>
  		<el-col :span="24" style='margin-top:20px;'>
		  	<span>选择门店：
				<el-select v-model="optionsValue" placeholder="请选择">
					<el-option
						v-for="item in options"
						:key="item"
						:label="item"
						:value="item">
					</el-option>
				</el-select>
			</span>
			<el-input placeholder="请输入广告机名称搜索" v-model="input2" icon='search' class='inp_seach' :on-icon-click="handleIconClick" @change='iconClick'></el-input>
		</el-col>
		<el-col :span='24' style='margin-top:20px;'>
			<el-table class='table'
      			:data="filteredTableData"
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
			uid:''
        }
      },
	mounted(){
		this.uid = localStorage.getItem('uid');
        this.getFocusList()
    },
		computed:{
			filteredTableData: function () {
				let shop = this.optionsValue;
				return this.tableData.filter(function(value){
					if(shop == '全部'|| shop == ''){
						if(name == ''){
							return true
						}else{
							return value.name == name 
						}
					}else{
						return value.shop == shop
					}
				})
			}
    },
	methods:{
		edit (index,id) {
			id = this.tableData[index].id
			const path = '/editDevice?id=' + id;
			this.$router.push({ path: path });
		},
		getFocusList(){//加载页面时候加载门店		
			let uid = {
				uid:this.uid
			}
			getShop(uid).then(data =>{
				data.result.map(v =>{
					if(this.options.indexOf(v.data.shop) == -1){
						this.options.push(v.data.shop)
					}
				})
				this.shopId = data.result.map(v=>{
					return v.id
				})
				let name = this.input2
				let param ={}
				if(name){
				   param = {
						name:this.input2,
						shop_id:this.shopId+'',
						page:this.pageinationInfo.currentPage,
						limit:this.pageinationInfo.pageSize,
					}
				}else{
					param = {
						shop_id:this.shopId+'',
						page:this.pageinationInfo.currentPage,
						limit:this.pageinationInfo.pageSize,
					}
				}
				console.log(param)
				search_goods(param).then(data=>{ 
					this.pageinationInfo.total = data.total_count
					let time = Date.parse(new Date())
					this.tableData = data.result.map( v=>{
						return{
							name:v.data.name,
							shop:v.data.shop_name || '无门店信息',
							state:(time - v.data.heartbeat_time >= 1800)?'不正常':'正常',
							id:v.id
						}
					})
					this.tableData.map(ast => {
						if(this.options.indexOf(ast.shop) == -1){
							this.options.push(ast.shop)
						}
					})
				})
			})
        },
	    handleIconClick(input2){
			 //this.getFocusList();
			 let name = this.input2
				let param ={}
				if(name){
				   param = {
						name:this.input2,
						shop_id:this.shopId+'',
						//page:this.pageinationInfo.currentPage,
						//limit:this.pageinationInfo.pageSize,
					}
				}else{
					param = {
						shop_id:this.shopId+'',
						//page:this.pageinationInfo.currentPage,
						//limit:this.pageinationInfo.pageSize,
					}
				}
				search_goods(param).then(data=>{ 
					this.pageinationInfo.total = data.total_count
					let time = Date.parse(new Date())
					this.tableData = data.result.map( v=>{
						return{
							name:v.data.name,
							shop:v.data.shop_name || '无门店信息',
							state:(time - v.data.heartbeat_time >= 1800)?'不正常':'正常',
							id:v.id
						}
					})
					this.tableData.map(ast => {
						if(this.options.indexOf(ast.shop) == -1){
							this.options.push(ast.shop)
						}
					})
				})
		},
		iconClick(){
			this.getFocusList();
		},
		  //分页
        currentChange(currentPage) {
             //当前页变动时候触发的事件
            this.pageinationInfo.currentPage = currentPage;
            this.getFocusList()
        },
        sizeChange(size) {
            //pageSize 改变时会触发
            this.pageinationInfo.pageSize = size;
            this.getFocusList()
        },
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