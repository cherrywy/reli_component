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
                <el-table
                    :data="arr"
                    style="width: 100%;">
                    <el-table-column
                        prop="goodimage"
                        label="商品图片"
                        width="100"
                        align='center'>
                    </el-table-column>
                    <el-table-column
                    prop="goodname"
                    label="商品名称"
                    width="100"
                    align='center'>
                    </el-table-column>
                    <el-table-column
                    prop="goodtag"
                    label="商品标签"
                    align='center'>
                    </el-table-column>
                    <el-table-column
                    prop="goodprice"
                    label="商品价格（元）"
                    align='center'>
                    </el-table-column>
                    <el-table-column
                    prop="bindvideo"
                    label="绑定视频"
                    align='center'>
                    </el-table-column>
                    <el-table-column
                    prop="bindaddress"
                    label="商品详情地址"
                    align='center'>
                    </el-table-column>
                    <el-table-column
                    prop="address"
                    label="操作"
                    align='center'>
                        <template scope="scope">
                            <el-button
                                size="small"
                            @click="unbindVideo(scope.$index,scope.row)">解除绑定</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
            <el-dialog
                title="提示"
                :visible.sync="dialogDelete"
                size="tiny">
                <span>确认解除绑定？</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogDelete = false">取 消</el-button>
                    <el-button type="primary" @click="handleDelete()">确 定</el-button>
                </span>
            </el-dialog>
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
          arr:[{
            goodimage:'',
            goodname:'',
            goodtag:'',
            goodprice:'',
            bindvideo:'',
            bindaddress:'',
            id:''
          }],
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
		bindList:function (str) {
			this.$router.push({path:'/bindList'});
		},
        getVideoList(){
            //加载视频信息
            let id = {
               uid:'1209811640320002' 
            }
            updatavideo(id).then(data=>{  
                this.video_list = data.result.video_list
                for(var i = 0;i<this.video_list.length;i++){
                    this.tableData.goodimage = this.video_list[i].video.goods.pic_url
                    this.imgs = this.video_list[i].video.goods.pic_url
                    this.tableData.goodname = this.video_list[i].video.goods.info_name
                    this.tableData.goodtag = this.video_list[i].video.goods.tag_goods_value
                    this.tableData.goodprice = this.video_list[i].video.goods.price_goods_value
                    this.tableData.bindvideo = this.video_list[i].video.goods.vedio_url_url ? '是' : '否'
                    this.tableData.bindaddress = this.video_list[i].video.goods.jump_url_url
                    this.tableData.id = this.video_list[i].video.goods.info_id
                    if(this.tableData !== []){
                         this.arr.push(this.tableData)
                    }              
                }
            })
        },
        //解除绑定
        unbindVideo(index,row){
            this.dialogDelete = true;
            this.inx = index
        },
        handleDelete(){
            //确认解除
            this.dialogDelete = false;
            let banner_id =this.arr[this.inx].id
            let banId = {
                goods_id:banner_id
            }
            deleteBindGoods(banId).then(data => {
                //console.log(data)
                this.arr.splice(this.inx,1);
            })  
         }

	}
 }
</script>