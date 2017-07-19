<template>
	<section>
		<el-row>
			<el-col :span ='24' style='margin-top:20px;' align='center'>
				<!--<el-button class='device' @click='deviceStyle("displayViewOne")'>广告机1</el-button>-->
				<div class='device' @click='deviceStyle("displayViewTwo")'></div>
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
		  lists:null,
		  uid:''
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
	mounted() {
        this.uid = localStorage.getItem('uid');
    },
	methods:{
		deviceStyle:function (str) {
			this.currentView = str
			let id = {
				uid:this.uid
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
		background:url('../../../static/twoad.jpeg') no-repeat;
		background-size:100% 100%;
	}
	.device:active{
		border:1px blue solid;
		width:150px;
		height:200px;
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