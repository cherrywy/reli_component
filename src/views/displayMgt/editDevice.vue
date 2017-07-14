<template>
	<section>
		<el-row>
			<el-col :span ='24' style='margin-top:20px;'>
				<el-button class='device' @click="switchDiaplay('diaplayMgeOne')">广告机1</el-button>
				<el-button class='device' @click="switchDiaplay('diaplayMgeTwo')">广告机2</el-button>
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
			currentView: 'diaplayMgeOne'
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
	methods:{
		handleRemove(file, fileList) {
          
		},
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
		},
		switchDiaplay:function(vx){
			this.currentView = vx
			let par = {uid:'1209811640320002'}
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
	}
</style>