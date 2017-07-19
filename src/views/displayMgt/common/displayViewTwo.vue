<template>
   <section>
		<el-col :span ='24' style='margin-top:20px;'>
             <span>素材类型：</span>
			  <el-radio-group v-model="radio3" @change='changeVie'>
				<el-radio-button label="轮播图"></el-radio-button>
				<el-radio-button label="视频" ></el-radio-button>
			</el-radio-group>
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
		  cv: 'viewTwoimgs',
		  radio3:'轮播图'
		}
    },
	components: {
		viewTwoimgs,
		viewTwovideo
	},
	mounted(){
		this.getRoute()
	},
	methods:{
		getRoute(){
			 let inf = this.$route.path.split("/bindDisplayData/")[1]
			 console.log(inf);
			 if(inf == 'viewTwovideo'){
				 this.radio3 ='视频'
				 this.cv ='viewTwovideo' 
			 }
			 else if(inf == 'viewTwoimgs'){
				 this.radio3 ='轮播图'
				 this.cv ='viewTwoimgs' 		
			 }
		},
		changeVie(){	
			// this.getRoute()
			if(this.radio3 =='轮播图'){
				this.cv ='viewTwoimgs' 
				this.$router.push({ path:'/bindDisplayData/viewTwoimgs' })
			}
			if(this.radio3 =='视频'){
				this.cv ='viewTwovideo'
				this.$router.push({ path:'/bindDisplayData/viewTwovideo' })
			}
		}
	}
 }
</script>
<style>
	.imgs{
	
	}
	
</style>