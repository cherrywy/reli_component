<template>
	<section>
    	<el-col :span='24'>
		<div class='title'>欢迎使用智慧门店管理后台</div>
		</el-col>
		<el-col :span='24'>
			<span style='margin-top:-30px;line-height:60px;color:#70a5ec;'>现有门店数量：{{total_count}} </span>
		</el-col>

		<el-col :span='12' v-for='info in infos'>
			<span style='line-height:40px;font-size:20px;'>{{info.shop}}</span>
			<el-card class='card'>
				<img :src="info.shop_pic" width='350px' height='300px'>
				<div style="padding: 5px;" align='center'>
					<el-button type="text" class="button" @click='onlinegoods(info)'>上架商品</el-button>
				</div>
				<p style='font-size:13px;'>地址：{{info.street}}</p>
			</el-card>		
		</el-col>
	</section>
</template>
<script>
import {shop_imgs,get_shop_imgs} from '../../api/display'
import Viewer from './../../components/SharedBlocks/Viewer'

export default {
    data() {
        return {
			infos:[],
			total_count:0,
			img_url:'',
			skuInfo:'',
			planId:'',
			uid:'',
			planName:'',
		}
	}, 
	components: {
		Viewer
	},
	mounted() {
		// viewer 组件加载完成后立即让它画图
		this.$bus.$off('viewer.mounted')
		this.$bus.$on('viewer.mounted', () => {
			this.$bus.$emit('initViewer', {selectable: false})
		})
		 this.uid = localStorage.getItem('uid');
        this.get_list();
		//this.sku_list();
    },
	methods:{
		get_list(){
			let uid = {
				uid:this.uid
			}
			shop_imgs(uid).then(data => {
			  this.total_count = data.total_count
			  this.infos = data.result.map(v =>{
				  return{
					  shop:v.shop,
					  plans:v.plans,
					  street:v.street,
					  shopId:v.id,
					  shopName:v.shop,
					  shop_pic:v.shop_pic
				  }
			  })
			   this.img_url = this.infos.map(val =>{
					return val.plans[0].image_url
			 	})
				this.planId = this.infos.map(v =>{
					 return v.plans[0].id
				})
				this.planName = this.infos.map(v =>{
					 return v.plans[0].name
				})
				this.planId = this.planId[0]
				this.planName = this.planName[0]
				//获取默认的展柜
				let info = {
					plan_id:this.planId
				}
				// 设置 planId 让 Viewer 组件绘图
				this.planId = parseInt(this.infos[0].plans[0].id)
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
			})
		},
		
		clickImg(plan){
			this.planId = parseInt(plan.id)
			this.planName = plan.name
			this.$nextTick(() => {
				this.$bus.$emit('initViewer', {selectable: false})
			})
		 },
		 onlinegoods(info){
			let shopId = info.shopId
			//console.log(shopId)
			let shopName = info.shop
			const path = '/goodsMgtOnline?shopId='+shopId+'&shopName='+shopName
			this.$router.push({ path: path});
		},
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
		height:400px;
	}
	.title{
		height:30px;
		line-height:30px;
		padding-left:20px;
		background:#70a5ec;
		border-radius:5px;
		color:white;
	}
</style>
