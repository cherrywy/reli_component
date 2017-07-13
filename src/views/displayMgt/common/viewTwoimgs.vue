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
                            <el-form :model="form">
                                <el-form-item label="请选择图片：" :label-width="formLabelWidth" align='left'>
                                    <el-upload
                                        class="upload-demo"
                                        action="updataimgs"
                                        :on-preview="imgPreview"
                                        :on-remove="imgRemove"
                                        :file-list="file-list">
                                        <el-button size="small" type="primary">选择文件</el-button>
                                    </el-upload>
                                </el-form-item>
                                <el-form-item label="跳转地址：" :label-width="formLabelWidth" align='left'>
                                    <el-input v-model="form.jump_url" auto-complete="off" style='width:300px;'></el-input>
                                </el-form-item>
                            </el-form>
                            <div slot="footer" class="dialog-footer" align='center'>
                                <el-button type="primary" @click="dialogFormVisible = false">绑 定</el-button>
                            </div>
                        </el-dialog>
                    </el-col>   
            </el-col>
            <el-col :span='24' style='margin-top:20px'>
                    <el-table
                        :data="tableData"
                        style="width: 100%;">
                        <el-table-column
                        prop="date"
                        label="图片"
                        width="200"
                        align='center'>
                        </el-table-column>
                        <el-table-column
                        prop="name"
                        label="url地址"
                        width="600"
                        align='center'>
                        </el-table-column>
                        <el-table-column
                        prop="address"
                        label="操作"
                        align='center'>
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
import { updataimgs } from '../../../api/display';

export default {
    data() {
      return {
        dialogFormVisible: false,
        form: {
          pic_url: '',
          jump_url: '',
          uid:'1209811640320002'
        },
        formLabelWidth: '100px'
      };
    },
    methods:{
        /*updataimgs (form) {
            console.log(data)
        }*/
	}
};
</script>