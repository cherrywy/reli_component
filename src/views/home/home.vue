<template>
	<section>
    	<el-col :span='24'>
			<h4>欢迎使用智慧门店后台</h4>
		</el-col>
		<el-col>
			<p>现有门店数量：{{total_count}} </p>
		</el-col>

		<el-col :span='12' v-for='info in infos'>
			<h4>{{info.shop}}</h4>
			<ul  class='imgs'>
				<li class='li_img' v-for='plan in info.plans'>
					<img :src="plan.image_url" @click='clickImg(plan)' class='imgstyle'>
				</li>
			</ul>

			<el-card class='card'>
				<img :src="img_url" width='350px' height='300px'>
				<div style="padding: 14px;" align='center'>
					<el-button type="text" class="button" @click='onlinegoods'>上传商品</el-button>
				</div>
			</el-card>
			<span style='font-size:15px;line-height:80px;'>地址：{{info.street}}</span>
		</el-col>
	</section>
</template>
<script>
import {shop_imgs,get_shop_imgs} from '../../api/display'
export default {
    data() {
        return {
			infos:[],
			total_count:0,
			img_url:'',
			skuInfo:'',
			skuId:'',
		}
	}, 
	mounted() {
        this.get_list();
		//this.sku_list();
    },
	methods:{
		get_list(){
			let uid = {
				uid:'1209811640320002'
			}
			shop_imgs(uid).then(data => {
			  this.total_count = data.total_count
			  this.infos = data.result.map(v =>{
				  return{
					  shop:v.shop,
					  plans:v.plans,
					  street:v.street,
				  }
			  })
			   this.img_url = this.infos.map(val =>{
					return val.plans[0].image_url
			 	})
				this.skuId = this.infos.map(v =>{
					 return v.plans[0].id
				})
				this.skuId = this.skuId[0]
				//获取默认的展柜
				let info = {
					plan_id:this.skuId
				}
				get_shop_imgs(info).then(data=>{
					this.skuInfo = data.result.map(v=>{
						//console.log(v.data)
						return{
							type:v.data.type,//展柜形状类型，0=矩形柜子；1=圆形或弧
							angle:v.data.angle,//旋转数值，取值范围 0 - 360
							endangle:v.data.endangle,//结束角度
							height:v.data.height,//矩形高度
							plan_id:v.data.plan_id,//平面图id
							radius:v.data.radius,//圆形半径
							show_case_id:v.data.show_case_id,
							show_case_type:v.data.show_case_type,//展柜类型（10中岛柜，20背柜）
							skewx:v.data.skewx,//横向歪斜值，有符号数字
							skewy:v.data.skewy,//纵向歪斜值，有符号数字
							startangle:v.data.startangle,//起始角度，横轴向右为0度，顺时针
							width:v.data.width,//矩形宽度
							x:v.data.x,//矩形（或圆形）左上角x位置
							y:v.data.y,//矩形（或圆形）左上角y位置
						}
					})
				})
				console.log(this.$refs.imyCanvas)
			})
		},
		onlinegoods(){
			alert('跳到上传商品页')
		},
		clickImg(plan){
			this.img_url = plan.image_url
			let info = {
				plan_id:plan.id
			}
			
			get_shop_imgs(info).then(data=>{
				this.skuInfo = data.result.map(v=>{
					return{
						type:v.data.type
					}
				})
			})
			//console.log(this.skuInfo)
		 }
	}
}
</script>
<style>
	.imgs{	
		list-style:none;
		width:400px;
		height:150px;
	}
	.li_img{
		float:left;
		margin-right:10px;
	}
	.imgstyle{
		width:150px;
		height:150px;
		border:1px #999 dashed;
		border-radius:5px;
	}
	.card{
		width:400px;
	}
</style>