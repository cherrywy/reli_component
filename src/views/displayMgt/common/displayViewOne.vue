<template>
	<section>
		<el-row>
			<el-col :span='6' style='margin:20px 0px;'><el-input v-model="input" placeholder="请输入商品名称"></el-input></el-col>

			<el-col :span='20'>
                <span>本页显示 
                    <el-select v-model="value" placeholder="5" style='width:80px'>
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                    </el-select>  条</span>
            </el-col>
            <el-col :span='4' align='right'>
                <el-button type="primary" @click='bindList'>绑定素材</el-button>
            </el-col>

			<el-col :span='24'>
				 <el-table :data="tableData" border style="width: 100%; margin-top: 15px;">
            <el-table-column prop="goodname" label="商品名称" align="center" width="350">
            </el-table-column>
            <el-table-column label="绑定图片数量" width="100" align="center" prop="goodnum">
            </el-table-column>
            <el-table-column prop="bindvideo" label="绑定视频" width="100" align="center">
            </el-table-column>
            <el-table-column prop="bindurl" label="URl地址" width="400" align="center">
            </el-table-column>
            <el-table-column label="操作" align="center" width="200">
                <template scope="scope">
                    <el-button size='small' @click="deletegoods(scope.$index,scope.row.goods_id)">解除绑定</el-button>
                    <el-button size='small'  @click="changeDiaplay(scope.$index,scope.row.goods_id)">更换素材</el-button>
                </template>
            </el-table-column>
        </el-table>
			</el-col>

            <el-col :span='24' align='right'>
                <div class="block">
                    <el-pagination
                    layout="prev, pager, next"
                    :total="50">
                    </el-pagination>
                </div>
            </el-col>
		</el-row>
	</section>
</template>
<script>
import {getOneList} from '../../../api/display'

export default {
	data(){
		return{
			options: [{
				value: '5',
				label: '5'
				}, {
				value: '10',
				label: '10'
			}],
			value:'5',
			id:{
				display_device_id:'1291185013457004',
			},
			tableData:[],
		}
	},
	mounted(){
        this.getInfomation()
	},
	methods:{
		getInfomation(){
			//获取列表详情
			getOneList(this.id).then(data =>{
				let def_dd = data.result.def_dd
				let int_dd = data.result.int_dd.list
				this.tableData = int_dd.map(v =>{
					return{
						goodname:v.dd_goods_name,
						id:v.dd_goods_id,
						goodnum:'3',
						bindvideo:v.dd_video_url?'是':'否',
						bindurl:v.dd_video_url,
					}
				})	
			})
		},
		deletegoods(index,goods_id){
            //确认解除
            this.$confirm('是否确定解除绑定？解除绑定后素材将失效', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() =>{
                goods_id = this.tableData[index].id
                let banId = {
                   goods_id:goods_id
                }
            })
        },
         bindList(){
            this.$router.push({ path: '/bind_list' });
         },
         changeDiaplay(index){
            let id= this.tableData[index].id
            const path = '/bind_list?goods_id=' + id;
            this.$router.push({ path: path });	
         }
	}
}
</script>