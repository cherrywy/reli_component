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
                    :data="tableData"
                    style="width: 100%;">
                    <el-table-column
                    prop="date"
                    label="商品图片"
                    width="100"
                    align='center'>
                    </el-table-column>
                    <el-table-column
                    prop="name"
                    label="商品名称"
                    width="100"
                    align='center'>
                    </el-table-column>
                    <el-table-column
                    prop="address"
                    label="商品标签"
                    align='center'>
                    </el-table-column>
                    <el-table-column
                    prop="address"
                    label="商品价格（元）"
                    align='center'>
                    </el-table-column>
                    <el-table-column
                    prop="address"
                    label="绑定视频"
                    align='center'>
                    </el-table-column>
                    <el-table-column
                    prop="address"
                    label="商品详情地址"
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
        </el-col>
        </el-col>
    </section>
</template>
<script>
export default {
    data() {
        return {
		  
		}
    },
	components: {
		
	},
	methods:{
		bindList:function (str) {
			this.$router.push({path:'/bindList'});
		}
	}
 }
</script>