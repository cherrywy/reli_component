<template>
	<section>
		<el-row>
			<el-col :span ='24' style='margin-top:20px;'>
				<el-button class='device' @click='deviceStyle("displayViewOne")'>广告机1</el-button>
				<el-button class='device' @click='deviceStyle("displayViewTwo")'>广告机2</el-button>	
			</el-col>
		</el-row>
		<components :is='currentView'></components>
	</section>
</template>
<script>
import displayViewOne from './common/displayViewOne.vue'
import displayViewTwo from './common/displayViewTwo.vue'

import { getImgsList,updatavideo,allPic_imgs } from '../../api/display';
export default {
    data() {
        return {
          activeName2: 'first',
		  options: [{value: 5,label: 5}, {value: 10,label: 10}],
		  value: '',
		  currentView: 'displayViewTwo',
		  lists:null
		}
    },
	props:{
		style : {
			type: String,
			default: 'sty1'
		},
		str : {
			type: String,
			default: 'img'
		}
	},
	components: {
		displayViewOne,
		displayViewTwo
	},
	methods:{
		deviceStyle:function (str) {
			this.currentView = str
			let id = {
				uid:'1209811640320002'
			}
			getImgsList(id).then(data => {
				//console.log(data)
			})
			updatavideo(id).then(data => {
				//console.log(data)
			})
			allPic_imgs(id).then(data => {
				this.lists = data.result
				let imgList =this.lists
				//console.log(this.lists)
			})
		}
	}
 }
</script>
<style>
	.device{
		width:150px;
		height:200px;
		margin-right:20px;
	}
	.div{
		border:1px red solid;
	}
	.tab{
		list-style:none;
	}
	.tabli {
		float:left;
		width:60px;
		height:35px;
		line-height:35px;
		text-align:center;
		border:1px solid #999;
	}
	.active{
		background:#999;
	}
</style>