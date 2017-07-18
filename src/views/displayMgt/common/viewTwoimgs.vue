<template>
    <section>
         <el-row>
            <el-col :span ='24' style='margin-top:20px;'>

                    <el-col :span='24' align='right'>
                        <el-button type="primary" @click="dialogFormVisible = true">上传图片</el-button>
                    </el-col>
                    <el-col :span='24'>
                        <el-dialog  :visible.sync="dialogFormVisible" >
                            <el-form :model="imgInfomation">
                                <el-form-item label="请选择图片：" :label-width="formLabelWidth" align='left'>
                                    <el-upload
                                        action="http://118.89.232.160:10001/util/file/upload.json"
                                        name="pic"
                                        :data="upload_params"      
                                        :show-file-list="true"
                                        :on-success='handleAvatarSuccess'>
                                        <el-button size="small" type="primary" :disabled='btn_show'>选择文件</el-button>
                                    </el-upload>                       
                                </el-form-item>
                                <el-form-item label="跳转地址：" :label-width="formLabelWidth" align='left'>
                                    <el-input   style='width:300px;' v-model='imgInfomation.jump_url'></el-input>
                                </el-form-item>
                            </el-form>
                            <div slot="footer" class="dialog-footer" align='center'>
                                <el-button type="primary" @click="bindimgs">绑 定</el-button>
                            </div>  
                        </el-dialog>
                    </el-col>   
            </el-col>
            <el-col :span='24' style='margin-top:20px'>
                    <el-table :data="tableData" border style="width: 100%; margin-top: 15px;">
            <el-table-column label="商品图片" width="120" align="center">
                <template scope="scope">
                    <img width='50' height='50' :src="scope.row.pic_url">
                </template>
    
            </el-table-column>
            <el-table-column prop="jump_url" label="url地址" align="center">
            </el-table-column>
        
            <el-table-column label="操作" align="center" width="150">
                <template scope="scope">
                    <el-button @click="deleteList(scope.$index, scope.row.banner_id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
            </el-col>
            <el-dialog
                title="提示"
                :visible.sync="dialogDelete"
                size="tiny">
                <span>确认删除？</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogDelete = false">取 消</el-button>
                    <el-button type="primary" @click="handleDelete()">确 定</el-button>
                </span>
            </el-dialog>

            <el-col :span='24' align='right'>
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageinationInfo.currentPage" :page-sizes="[5, 10,]" :page-size="pageinationInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageinationInfo.total">
                </el-pagination>
            </el-col>
        </el-row>
    </section>
</template>

<script>
import { getImgsList,updataimgs,requestUpload,allPic_imgs,deleteimgs} from '../../../api/display'
export default {
    data() {
      return {
        dialogFormVisible: false,
        formLabelWidth: '100px',
        dialogDelete:false,
        btn_show:false,
        upload_params:{
            type:'image'
        },
        img_url:'',
        imgInfomation:{
            jump_url:'',
            pic_url:'',
            uid:'1209811640320002'
        },
        tableData:[{
            pic_url:'',
            jump_url:''
        }],
        displayId:null,
        inx:null,
        new_list:null,
        pageinationInfo: {
            currentPage: 1,
            pageSize: 5,
            total: 0,
        },
      };
    },
    mounted(){
        this.getImgsList()
    },
    methods:{
        handleAvatarSuccess(res, file) {
        //图片上传成功
         this.btn_show = true
         this.imgInfomation.pic_url = res.result.file_download_url
        },
        bindimgs(){
            //上传图片
            this.dialogFormVisible = false
            this.imgInfomation.uid = 1209811640320002
            updataimgs(this.imgInfomation).then(data=>{
                let newImg = {
                    pic_url:this.imgInfomation.pic_url,
                    jump_url:this.imgInfomation.jump_url,
                    id:data.result.id
                }
                this.tableData.unshift(newImg)
                this.new_list = this.tableData
                this.imgInfomation.pic_url = ''
                this.getImgsList()
            })
            
        },
        getImgsList(){
            //加载轮播图信息
            let id = {
				uid:'1209811640320002',
                page:this.pageinationInfo.currentPage,
                limit:this.pageinationInfo.pageSize
			}
            getImgsList(id).then(data=>{  
                console.log(data)
                this.pageinationInfo.total = data.total_count
                this.tableData = data.result.map(v =>{
                    return{
                        pic_url:v.data.pic_url,
                        jump_url:v.data.jump_url,
                        id:v.id
                    }
                })
                //this.tableData = this.tableData.slice(startIndex, [endIndex]) 
                
            })
        },
        deleteList(index,banner_id){
            //删除商品
            this.$confirm('删除该商品后将无法撤回，是否继续', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() =>{
                banner_id = this.tableData[index].id
                let banId = {
                   banner_id:banner_id
                }
                deleteimgs(banId).then(data => {
                       this.tableData.splice(this.inx,1)
                       this.getImgsList()
                })  
            })
         },

         //分页
         
         handleCurrentChange(currentPage) {
             //当前页变动时候触发的事件
            console.log(currentPage)
            this.pageinationInfo.currentPage = currentPage;
           this.getImgsList()
        },
         handleSizeChange(size) {
            //pageSize 改变时会触发
            console.log(size)
            this.pageinationInfo.pageSize = size;
            this.getImgsList()
        },
	}
};
</script>