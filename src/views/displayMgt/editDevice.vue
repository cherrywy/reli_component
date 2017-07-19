<template>
	<section>
		<el-row>
			<el-col :span ='24' style='margin-top:20px;'>
				<!--<el-button class='device' @click="switchDiaplay('diaplayMgeOne')">广告机1</el-button>-->
				<div class='device' @click="switchDiaplay('diaplayMgeTwo')"></div>
			</el-col>
		</el-row>
		<components :is='currentView'></components>
	</section>
</template>
<script>

import diaplayMgeOne from './common/diaplayMgtOne.vue'
import diaplayMgeTwo from './common/diaplayMgtTwo.vue'

import {carouselImgs} from '../../api/display'
	export default {
    data() {
        return {
			dialogImageUrl: '',
       		dialogVisible: false,
			currentView: 'diaplayMgeTwo',
			uid:''
		}
    },
	props:{
		sty : {
			type: String,
			default: 'device2'
		}
	},
	components: {
		diaplayMgeOne,
		diaplayMgeTwo
	},
	mounted() {
        this.uid = localStorage.getItem('uid');
    },
	methods:{
		handleRemove(file, fileList) {
          
		},
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
		},
		switchDiaplay:function(vx){
			this.currentView = vx
			let par = {uid:this.uid}
			carouselImgs(par).then(data => {
				console.log(data)
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
		background:url('../../../static/twoad.jpeg') no-repeat;
			background-size:100% 100%;
	}
	.device:active{
		border:1px blue solid;
		width:150px;
		height:200px;
	}
</style>