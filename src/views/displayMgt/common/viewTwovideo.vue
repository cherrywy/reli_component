<template>
    <section>
        <el-col :span ='24' v-if='true'>
            <el-col :span='6' style='margin:20px 0px;'><el-input v-model="input" placeholder="请输入商品名称"></el-input></el-col>
        <el-col :span ='24' v-if='true'>
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
            <el-col :span='24' style='margin-top:20px'>
                <el-table :data="tableData" border style="width: 100%; margin-top: 15px;">
            <el-table-column label="商品图片" width="120" align="center">
                <template scope="scope">
                    <img width='50' height='50' :src="scope.row.img">
                </template>
    
            </el-table-column>
            <el-table-column prop="goodname" label="商品名称" align="center" width="200">
            </el-table-column>
            <el-table-column label="商品标签" width="100" align="center" prop="goodtag">
            </el-table-column>
            <el-table-column prop="goodprice" label="商品价格（元）" align="center" width="100">
            </el-table-column>
            <el-table-column prop="bindvideo" label="绑定视频" width="100" align="center">
            </el-table-column>
            <el-table-column prop="bindaddress" label="商品详情地址" width="300" align="center">
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
        </el-col>
        </el-col>
        </el-col>
    </section>
</template>
<script>
import {deleteBindGoods,updatavideo} from '../../../api/display'
export default {
    data() {
        return {
		  tableData:[],
          video_list:{},
          dialogFormVisible:false,
          dialogDelete:false,
          options: [{
            value: '5',
            label: '5'
            }, {
            value: '10',
            label: '10'
            }],
          imgs:'',
          inx:null,
          new_list:null,
          value:''
        }
    },
	mounted(){
        this.getVideoList()
	},
	methods:{
		bindList:function () {
			this.$router.push({path:'/bindList'});
		},
        getVideoList(){
            //加载视频信息
            let id = {
               uid:'1209811640320002' 
            }
            updatavideo(id).then(data=>{  
                console.log(data.result.video_list);
                this.tableData = data.result.video_list.map(v=>{
                    // const {goods} = v.video;
                    const goods_pics = v.video.goods.info_title_pics?v.video.goods.info_title_pics[0]:null;
                    const img = v.video.goods.pic_url?v.video.goods.pic_url:goods_pics;
                    return {
                        img:img,
                        goodname:v.video.goods.info_name,
                        goodtag:v.video.goods.tag_goods_value,
                        goodprice:v.video.goods.price_goods_value,
                        bindvideo:v.video.goods.vedio_url_url?'是':'否',
                        bindaddress:v.video.goods.vedio_url_url,
                        id:v.video.goods.info_id
                    }
                })
                console.log(this.tableData)
            })
        },
        deletegoods(index,goods_id){
            //确认解除
            this.$confirm('删除该商品后将无法撤回，是否继续', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() =>{
                goods_id = this.tableData[index].id
                let banId = {
                   goods_id:goods_id,
                   uid:'1209811640320002'
                }
                deleteBindGoods(banId).then(data => {
                    this.tableData.splice(this.inx,1)
                    this.getVideoList()
                })  
            })
         },
         changeDiaplay(index){
            let id= this.tableData[index].id
            //console.log(this.tableData[index])
            const path = '/bindList?goods_id=' + id;
            this.$router.push({ path: path });
         }

	}
 }
</script>