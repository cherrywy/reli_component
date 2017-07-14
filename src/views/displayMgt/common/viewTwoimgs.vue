<template>
    <section>
         <el-row>
            <el-col :span ='24' style='margin-top:20px;'>
                    <el-col :span='20'>
                            <span>本页显示 
                            <el-select v-model="value" placeholder="5" style='width:80px'>
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                            </el-select> 条</span>
                    </el-col>

                    <el-col :span='4' align='right'>
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
                    <el-table
                        :data="tableData"
                        style="width: 100%;">
                        <el-table-column
                        prop="pic_url"
                        label="图片"
                        width="200"
                        align='center'>
                        </el-table-column>
                            <template><img :src="img_url" ></template>
                        <el-table-column
                        prop="jump_url"
                        label="url地址"
                        width="600"
                        align='center'>
                        </el-table-column>
                        <el-table-column
                        prop="event"
                        label="操作"
                        align='center'>
                            <template scope="scope">
                            <el-button
                                size="small"
                                @click="delete_imgs(scope.$index, scope.row)">删除</el-button>
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
import { updataimgs,requestUpload,allPic_imgs,deleteimgs} from '../../../api/display'
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
        options: [{
          value: '5',
          label: '5'
        }, {
          value: '10',
          label: '10'
        }],
        value: '',
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
        new_list:null
      };
    },
    mounted(){
        this.getImgsList()
    },
    methods:{
       handleAvatarSuccess(res, file) {
         this.btn_show = true
         this.imgInfomation.pic_url = res.result.file_download_url
        },
        bindimgs(){
            //上传图片
            this.dialogFormVisible = false
            this.imgInfomation.uid = 1209811640320002
            updataimgs(this.imgInfomation).then(data=>{
                console.log(data.result.id)
                let newImg = {
                    pic_url:this.imgInfomation.pic_url,
                    jump_url:this.imgInfomation.jump_url,
                    id:data.result.id
                }
                console.log(newImg)
                this.tableData.unshift(newImg)
                this.new_list = this.tableData
            })
        },
        getImgsList(){
            //加载轮播图信息
            let id = {
				uid:'1209811640320002'
			}
            allPic_imgs(id).then(data=>{  
                this.tableData = data.result
            })
        },
        delete_imgs(index,row){
            this.dialogDelete = true;
            this.inx = index
        },
        handleDelete(){
            //删除
            this.dialogDelete = false;
            if(this.new_list){
              let banner_id =this.new_list[this.inx].id
                console.log(this.new_list)
                console.log(this.new_list[this.inx])
            }
            let banner_id =this.tableData[this.inx].id
            let banId = {
                banner_id:banner_id
            }
            deleteimgs(banId).then(data => {
                //console.log(data)
                this.tableData.splice(this.inx,1);
            })  
         }
	}
};
</script>