<template>
    <section>
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
                  <el-button type="primary">上传图片</el-button>
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
         </el-col>
    </section>
</template>