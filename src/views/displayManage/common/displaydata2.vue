<template>
   <section>
		<el-col :span ='24'>
             <el-col :span ='3' style='margin-top:20px;'><span>素材类型：</span></el-col>
             <el-col :span ='21'>
                <el-button @click='haha("data2imgs")'>轮播图</el-button>
                <el-button @click='haha("data1video")'>视频</el-button>
            </el-col>
        </el-col>
        <el-col :span='24'>
            <components :is='cv'></components>
        </el-col>
	</section>
</template>
<script>
import data2imgs from './data2imgs.vue'
import data1video from './data1video.vue'
export default {
    data() {
        return {
		  cv: 'data1video'
		}
    },
	components: {
		data2imgs,
		data1video
	},
	methods:{
		haha:function (str) {
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