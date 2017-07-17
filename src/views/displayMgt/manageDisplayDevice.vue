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
			<el-input placeholder="请输入广告机名称搜索" v-model="input2" icon='search' class='inp_seach' ></el-input>
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
			<div class="block">
				<el-pagination
					layout="prev, pager, next"
					:total="50">
				</el-pagination>
			</div>
		</el-col>
	</el-row>
</template>
<script>
import {getShop,display_list} from '../../api/display'
    export default {
      data() {
        return {
          tableData:[{
						name:'',
						shop:'',
						state:''
					}],
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
					}
        }
      },
		mounted(){
        this.getFocusList()
				//this.getShopList()
    },
		computed:{
        filteredTableData: function () {
          	let shop = this.optionsValue;
						let name = this.input2;
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
				let par = {uid:'1209811640320002'}
			
        getShop(par).then(data=>{
					//加载门店
					 data.result.map(v => {
							  display_list().then(data=>{
										this.tableData =data.result.map(val =>{
													return{
														name:val.data.name,
														shop:val.data.shop_name ||'无门店信息',
														state:val.data.heartbeat_time,
														id:val.id
													}
											})
											this.tableData.map(ast => {
													if(this.options.indexOf(ast.shop) == -1){
														this.options.push(ast.shop)
													}
											})
									})
					 })
				})
      },
			
	 	 }
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