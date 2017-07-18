<template>
   <section>
		<el-col :span ='24' style='margin-top:20px;'>
             <span>素材类型：</span>
                <el-button @click='changeView("viewTwoimgs")'>轮播图</el-button>
				<el-button @click='changeView("viewTwovideo")'>视频</el-button>
        </el-col>
        <el-col :span='24'>
            <components :is='cv'></components>
        </el-col>
	</section>
</template>
<script>
import viewTwoimgs from './viewTwoimgs.vue'
import viewTwovideo from './viewTwovideo.vue'

import { updatavideo } from '../../../api/display';
export default {
    data() {
        return {
		  cv: 'viewTwoimgs'
		}
    },
	components: {
		viewTwoimgs,
		viewTwovideo
	},
	methods:{
		changeView:function (str) {
			this.cv = str
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