<template>
    <section>
        <el-row>
            <el-col :span='24'>
                <span>轮播图</span>
            </el-col>
            <el-col :span='24'>
                <el-upload
                    class="upload-demo"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    list-type="picture-card"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                    :file-list="fileList2">
                <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog v-model="dialogVisible" size="tiny">
                      <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </el-col>
            <el-col :span='24' style='margin-top:20px'>
                <span>显示商品</span>
                <el-table
                    :data="tableData"
                    style="width: 100%;">
                    <el-table-column
                    prop="goodname"
                    label="商品名称"
                    width="300"
                    align='center'>
                    </el-table-column>
                    <el-table-column
                    prop="state"
                    label="商品状态"
                    align='center'>
                    </el-table-column>
                    <el-table-column
                    prop="address"
                    label="操作"
                    align='center'>
                        <template scope="scope">
                            <el-button  size="small"  @click="dialogFormVisible = true">更换</el-button>
                            <el-button
                                size="small"
                                @click="dialogDelete = true">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
            <el-dialog :visible.sync="dialogFormVisible">
                            <el-form :model="form">
                                <el-form-item  :label-width="formLabelWidth">
                                    <el-input v-model="input" placeholder="请输入商品名称搜索" auto-complete="off" style='width:200px;'></el-input>
                                </el-form-item>
                                <el-form-item  :label-width="formLabelWidth" align='right'>
                                    <span>找不到商品？去<el-button type='text'>添加</el-button></span>
                                </el-form-item>
                                <el-form-item  :label-width="formLabelWidth">
                                    <el-table :data="gridData" style='marign-top:10px;'>
                                            <el-table-column property="date" label="选择" width="200"></el-table-column>
                                            <el-table-column property="name" label="商品名称" ></el-table-column>
                                    </el-table>
                                </el-form-item>
                            </el-form>
                            <el-form align='right'>
                                <div class="block">
                                    <el-pagination
                                        layout="prev, pager, next"
                                        :total="50">
                                    </el-pagination> 
                                </div>
                            </el-form>
                            <div slot="footer" class="dialog-footer" align='center'>
                                <el-button type="primary" @click="dialogFormVisible = false">保 存</el-button>
                            </div>
            </el-dialog>

            <el-dialog
                title="提示"
                :visible.sync="dialogDelete"
                size="tiny"
                :before-close="handleClose">
                <span>确认删除？</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogDelete = false">取 消</el-button>
                    <el-button type="primary" @click="handleDelete()">确 定</el-button>
                </span>
            </el-dialog>
        </el-row>
    </section>
</template>
<script>
  export default {
    data() {
      return {
        fileList2: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, 
        {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
        tableData:[{
            goodname:'111',
            state:'新品',
        }],
        dialogFormVisible: false,
        dialogDelete:false
      };
    },
    methods: {
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      deleteGoods(index,row){
        tableData = this.tableData.splice(index,1)
        console.log(tableData)
      },
      handleDelete(index,row){
         // alert(111)
          this.dialogDelete = false;
          tableData = this.tableData.splice(index,1)          
      }
    }
  }
</script>