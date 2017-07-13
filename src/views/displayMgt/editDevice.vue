<template>
	<section>
		<el-row>
			<el-col :span ='24' style='margin-top:20px;'>
				<el-button class='device' @click=''>广告机1</el-button>
				<el-button class='device'>广告机2</el-button>
			</el-col>
			<el-col :span ='24' v-if='sty=="device1"'>
				<el-col :span ='24' style='margin-top:20px'>
						<span>默认广告</span>
						<el-table
							:data="tableData"
							style="width: 100%">
							<el-table-column
								prop="date"
								label="展位名称"
								width="300"
								align='center'>
							</el-table-column>
							<el-table-column
								prop="name"
								label="商品名称"
								width="400"
								align='center'>
							</el-table-column>
							<el-table-column
								prop="address"
								label="操作"
								align='center'>
							</el-table-column>
							</el-table>
				</el-col>
				<el-col :span ='24' style='margin-top:20px'>
						<span>互动广告</span>
						<el-table
							:data="tableData"
							style="width: 100%">
							<el-table-column
								prop="date"
								label="商品名称"
								width="300"
								align='center'>
							</el-table-column>
							<el-table-column
								prop="name"
								label="素材状态"
								width="400"
								align='center'>
							</el-table-column>
							<el-table-column
								prop="address"
								label="操作"
								align='center'>
							</el-table-column>
							</el-table>
					</el-col>
			</el-col>
			<el-col :span ='24' v-if='sty=="device2"' style='margin-top:20px'>
					<el-col :span ='24'>
						<p>轮播图</p>
						<p>
							<img src="../../../static/bg.png" width='150px' height='150px'alt="">
							<img src="../../../static/bg.png" width='150px' height='150px'alt="">
							<img src="../../../static/bg.png" width='150px' height='150px'alt="">
						</p>
						<el-upload
							action="https://jsonplaceholder.typicode.com/posts/"
							list-type="picture-card"
							:on-preview="handlePictureCardPreview"
							:on-remove="handleRemove" style='float:left;'>
							<i class="el-icon-plus"></i>
							</el-upload>
							<el-dialog v-model="dialogVisible" size="tiny">
								<img width="100%" :src="dialogImageUrl" alt="">
						</el-dialog>
					</el-col>
					<el-col :span ='24' style='margin-top:20px'>
						<el-col :span ='20' ><span>显示商品</span></el-col>
						<el-col :span ='4' align='right'><el-button type='primary' size='small'style='width:80px;font-size:25px;'> + </el-button></el-col>
						<el-table
							:data="tableData"
							style="width: 100%">
							<el-table-column
								prop="date"
								label="商品名称"
								width="300"
								align='center'>
							</el-table-column>
							<el-table-column
								prop="name"
								label="素材状态"
								width="400"
								align='center'>
							</el-table-column>
							<el-table-column
								prop="address"
								label="操作"
								align='center'>
							</el-table-column>
							</el-table>
					</el-col>
			</el-col>
		</el-row>
		
	</section>
</template>
<script>
	export default {
    data() {
        return {
			dialogImageUrl: '',
       		dialogVisible: false
		}
    },
	props:{
		sty : {
			type: String,
			default: 'device2'
		}
	},
	methods:{
		handleRemove(file, fileList) {
          
		},
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
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