<template>
    <section>
         <el-row>
            <el-col :span ='24' style='margin-top:20px;'>      
                    <el-button type="primary" class='updataimg' @click="addImg">上传图片</el-button> 
                    <el-col :span='24'>
                        <el-dialog  :visible.sync="dialogFormVisible" >
                            <el-form :model="imgInfomation">
                                <el-form-item label="请选择图片：" :label-width="formLabelWidth" align='left'>
                                    <el-upload
                                        action="http://118.89.232.160:10001/util/file/upload.json"
                                        name="pic"
                                        :data="upload_params"      
                                        :show-file-list="true"
                                        :max='1'
                                        :file-list="fileList"
                                        :on-success='handleAvatarSuccess'>
                                        <el-button size="small" type="primary" style='margin-top:8px;' class='updataimg'>选择文件</el-button>
                                    </el-upload>                       
                                </el-form-item>
                                <el-form-item label="跳转地址：" :label-width="formLabelWidth" align='left'>
                                    <el-input   style='width:300px;' v-model='imgInfomation.jump_url'></el-input>
                                </el-form-item>
                            </el-form>
                            <div slot="footer" class="dialog-footer" align='center'>
                                <el-button type="primary" @click="bindimgs" class='updataimg'>绑 定</el-button>
                            </div>  
                        </el-dialog>
                    </el-col>   
            </el-col>
            <el-col :span='24' style='margin-top:-10px'>
                <el-table :data="tableData" border style="width: 100%; margin-top: 15px;">
                    <el-table-column label="商品图片" width="200" align="center">
                        <template scope="scope">
                            <!-- Vue.js 列表渲染机制导致图片数据加载之前显示旧图片，添加 key 即可  -->
                            <img width='60' height='60'  :src="scope.row.pic_url" :key="scope.row.pic_url" @click='img_Show(scope.$index,scope.row.pic_url)'>
                        </template>
                    </el-table-column>
                    <el-table-column prop="jump_url" label="url地址" align="center" >
                    </el-table-column>
        
                    <el-table-column label="操作" align="center" width="200">
                        <template scope="scope">
                            <el-button class='btn_red_color' size='small' @click="deleteList(scope.$index, scope.row.banner_id)">删除</el-button>
                        </template>
                    </el-table-column>
             </el-table>
             <el-dialog v-model="imgShow" size="tiny">
                 <img width="100%" :src="img_url">
            </el-dialog>
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
        fileList:[],
        upload_params:{
            type:'image'
        },
        img_url:'',
        imgInfomation:{
            jump_url:'',
            pic_url:'',
            uid:''
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
        uid:'',
        imgShow:false,
      };
    },
    mounted(){
        this.uid = localStorage.getItem('uid');
        this.getImgsList()
    },
    methods:{
        addImg(){
            this.dialogFormVisible = true
            this.fileList=[]
            this.imgInfomation.jump_url=''
        },
        handleAvatarSuccess(res, file) {
        //图片上传成功
         let upimg = {
                url:res.result.file_download_url
        }
        this.img_url = res.result.file_download_url
        this.fileList.push(upimg)
        if(this.fileList.length>1){
            this.fileList.splice(0,1)
        }else{
            this.btn_show = true
            if(res.error_code !== 0){
                this.$message({
                    message:res.error_msg,
                    type: 'error'
                }).then(this.fileList=[])
            }else{
                this.imgInfomation.pic_url = res.result.file_download_url
            }
        }
         
        },
        bindimgs(){
            //上传图片
            this.dialogFormVisible = false
            this.imgInfomation.uid = this.uid
            updataimgs(this.imgInfomation).then(data=>{
                let newImg = {
                    pic_url:this.imgInfomation.pic_url,
                    jump_url:this.imgInfomation.jump_url,
                    id:data.result.id
                }
               // this.tableData.unshift(newImg)
              //  this.new_list = this.tableData
                this.imgInfomation.pic_url = ''
                this.getImgsList()
            })
            
        },
        getImgsList(){
            //加载轮播图信息
            let id = {
				uid:this.uid,
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
            this.pageinationInfo.currentPage = currentPage;
           this.getImgsList()
        },
         handleSizeChange(size) {
            //pageSize 改变时会触发
            this.pageinationInfo.pageSize = size;
            this.getImgsList()
        },
        img_Show(index,pic_url){
            this.img_url = pic_url
            this.imgShow = true
        }
	}
};
</script>
<style>
    .updataimg{
        margin-top:-55px;
        float:right;
        background-color:#70a5ec;
        outline:none;
        border:none;
    }
    .updataimg:hover{
        margin-top:-55px;
        float:right;
        background-color:#70a5ec;
        outline:none;
        border:none;
    }
    .btn_red_color{
        background:#E0595B;
        opacity:0.66;
        outline:none;
        color:black;
        border:none;
    }
    .btn_red_color:hover{
        background:#E0595B;
        opacity:0.66;
        border:none;
        outline:none;
        color:black;
    }
</style>