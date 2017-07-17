<template>
	<section>
    	<el-col :span='24'>
			<h4>欢迎使用智慧门店后台</h4>
		</el-col>
		<el-col>
			<p>现有门店数量：{{total_count}} </p>
		</el-col>

		<el-col :span='24'>
			
		</el-col>
		<el-row>
			<el-col :span="8" v-for='plan in plans' :offset="2">
				<h2>{{plan.name}}</h2>
				<el-card :body-style="{ padding: '0px',width:'100%',height:'450px'}" >
				<img :src="plan.image_url" class="image" style='width:100%'>
				<div style="padding: 14px;text-align:center;" >
					<el-button type="text" class="button" align='center' @click='onlinegoods(this.index)'>商品上架</el-button>
				</div>
				</el-card>
  			</el-col>
		</el-row>
		

		<el-col :span='12'>
		</el-col>
	</section>
</template>
<script>
import {shop_imgs} from '../../api/display'
export default {
    data() {
        return {
			total_count:'',
			shop:'',
			plans:[]
		}
	}, 
	mounted() {
        this.get_list();
    },
	methods:{
		get_list(){
			let info = {
				uid:'1209811640320002'
			}
			shop_imgs(info).then(data => {
				//this.total_count = data.total_count
				data.result.map(v => {
					this.shop = v.shop
					this.total_count = v.plans.length
					this.plans = v.plans
					console.log(this.plans)
				})
			})
		},
		onlinegoods(){
			alert('跳到上传商品页')
		}
	}
}
</script>