<template>
	<section>
		<el-row>
			<el-col :span ='24' style='margin-top:20px;' align='center'>
				<ul style='list-style:none;' align='center'>
					<li class='bg_img'>
						<div class='deviceone' @click='switchDiaplay("diaplayMgeOne")'></div>
					</li>
					<li class='bg_img'>
						<div class='device' @click='switchDiaplay("diaplayMgeTwo")'></div>
					</li>
				</ul>
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
			currentView: 'diaplayMgeOne',
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
	.bg_img{
		float:left;
	}
	.device{
		width:150px;
		height:200px;
		margin-right:20px;
		background:url('/static/img/twoad.jpeg') no-repeat;
		background-size:100% 100%;
	}
	.device:active{
		border:1px blue solid;
		width:150px;
		height:200px;
	}
	.deviceone{
		width:150px;
		height:200px;
		margin-right:20px;
		background:url('/static/img/two.jpeg') no-repeat;
		background-size:100% 100%;
	}
	.deviceone:active{
		border:1px blue solid;
		width:150px;
		height:200px;
	}
</style>