<template>
	<el-row>
  		<el-col :span="24" style='margin-top:20px;'>
		  	<span>选择门店：
				<el-select v-model="value" placeholder="请选择">
					<el-option
						v-for="item in options"
						:key="item.data.shop"
						:label="item.data.shop"
						:value="item.data.shop"
						:change='getShopList(item)'>
					</el-option>
				</el-select>
			</span>
			<el-input placeholder="请输入广告机名称搜索" v-model="input2"  :on-icon-click="handleIconClick" class='inp_seach' ></el-input>
		</el-col>
		<el-col :span='24' style='margin-top:20px;'>
			<el-table class='table'
      			:data="tableData"
      			style="width: 100%;">
				<el-table-column
					prop="date"
					label="广告机名称"
					width="300" align='center'>
				</el-table-column>
				<el-table-column
					prop="name"
					label="所属门店"
					width="300" align='center'>
				</el-table-column>
				<el-table-column
					prop="address"
					label="广告机状态"  align='center'>
				</el-table-column>
				<el-table-column
					prop="address"
					label="操作" align='center'>
					<template scope="scope">
        				<el-button @click="edit" type="text" size="small">查看并编辑</el-button>
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
          tableData: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
          }, {
            date: '2016-05-01王小虎王小虎王小虎',
            name: '王小虎王小虎王小虎王小虎王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }],
					value:'',
					options:null,
					dpy_list:{
						name:null,
						shop_id:null
					}
        }
      },
		mounted(){
        this.getFocusList()
    },
	  methods:{
		  edit () {
			  this.$router.push({path:'/editDevice'});
		  },
			getFocusList(){//加载页面时候加载门店
				let par = {uid:'1209811640320002'}
        getShop(par).then(data=>{
					 this.options = data.result
					 this.dpy_list.shop_id = data.result[0].id	
				})
      },
			getShopList(){//门店
				display_list(this.dpy_list).then(data=>{
					console.log(data)
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