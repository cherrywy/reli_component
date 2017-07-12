<template>
	<section>
		<el-row>
			<el-col :span ='24' style='margin-top:20px;'>
				<el-button class='device' @click='deviceStyle("displaydata1")'>广告机1</el-button>
				<el-button class='device' @click='deviceStyle("displaydata2")'>广告机2</el-button>	
			</el-col>
		</el-row>
		<components :is='currentView'></components>
	</section>
</template>
<script>
import displaydata1 from './common/displaydata1.vue'
import displaydata2 from './common/displaydata2.vue'
export default {
    data() {
        return {
          activeName2: 'first',
		  options: [{value: 5,label: 5}, {value: 10,label: 10}],
		  value: '',
		  currentView: 'displaydata1'
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
		displaydata1,
		displaydata2
	},
	methods:{
		deviceStyle:function (str) {
			this.currentView = str
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