<template>
    <section>
        <el-col :span="24">
            <el-col :span="6">
                <el-select v-model="value" placeholder="品牌">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="7" :offset="1">
                <el-input v-model="name" icon="search" placeholder="请输入商品的名称，规格"></el-input>
            </el-col>
            <el-col :span="2" :offset="2">
                <el-button type="text" style="font-size:16px">搜索</el-button>
            </el-col>
        </el-col>
    
        <el-col :span="24" style="margin-bottom:20px">
    
            <el-button type="primary" style="float:right;background:#70a5ec" @click="goodsNew">添加商品</el-button>
    
        </el-col>
        <el-table :data="tableData" border style="width: 100%; margin-top: 15px;">
            <el-table-column label="商品图片" width="120" align="center">
                <template scope="scope">
                    <img width='20' height='20' :src="scope.row.goods_title_pics">
                </template>
    
            </el-table-column>
            <el-table-column prop="goods_name" label="商品名称" align="center">
            </el-table-column>
            <el-table-column prop="goods_name" label="规格" width="100" align="center">
            </el-table-column>
            <el-table-column prop="goods_brand_name" label="品牌" align="center" width="100">
            </el-table-column>
            <el-table-column prop="goods_created_at" label="创建时间" width="130" align="center">
            </el-table-column>
            <el-table-column label="操作" align="center" width="150">
                <template scope="scope">
                    <el-button size="small" type="info" style="background:#70a5ec" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="small" style="background:#E0595B;opacity:0.66;color:#000" @click="handleDelete(scope.$index, scope.row.goods_id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-row class="row center">
            <el-pagination style="margin: 20px auto;float:right" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="10" layout="total, prev, pager, next, jumper" :total='total'>
            </el-pagination>
        </el-row>
    </section>
</template>

<style>
#goods-app {
    width: 1080px;
    margin: 20px auto;
}
</style>

<script>

import { requestList, requestRemove } from '../../api/goodsServer';
import moment from 'moment';
export default {
    data() {
        return {
            tableData: [],
            tableContent:[],
            options: [{
                value: '0',
                label: '用户名'
            }, {
                value: '1',
                label: '姓名'
            }, {
                value: '2',
                label: '手机号'
            }, {
                value: '3',
                label: '邮箱'
            }],
            name: '',
            time: '',
            currentPage: 1,
            value: '',
            total: 0
        }
    },
    mounted: function () {

        getList: {
            let listParams = { uid: 1185378158575618, brand_name: this.brand_name, key_word: this.key_word };
            requestList(listParams).then(data => {
                let { error_code, result } = data;
                if (error_code !== 0) {
                    this.$message({
                        message: "返回数据有误",
                        type: 'error'
                    });
                } else {
                    this.tableContent = result.list.map(v => {
                        v.goods_created_at = moment(v.goods_created_at).format('YYYY/MM/DD');
                        return v;
                    })
                    this.total = this.tableContent.length;
                    let dataLength = 20;
                    if (this.total < 20) {
                        dataLength = this.total;

                    };
                    for (var x = 0; x < dataLength; x++) {
                        this.tableData.push(this.tableContent[x]);
                    };

                }
            })
        }

    },
    methods: {
         handleCurrentChange(val) {
                // var vm = this;
                this.currentPage = val;
                var page = 20;
                var maxpage = Math.ceil(this.total / page);
                if (maxpage == val) {
                    if (this.isPositiveNum(this.total / page)) {
                        for (var x = (val - 1) * page; x < val * page; x++) {
                            this.tableData.push(this.tableContent[x]);
                        }
                    } else {
                        for (var x = (val - 1) * page; x < this.total; x++) {
                            this.tableData.push(this.tableContent[x]);
                        }
                    }
                }
            },
        
        handleDelete(index, goods_id) {
            this.$confirm('删除该商品后将无法撤回，是否继续', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let removeParams = { goods_id: goods_id };
                requestRemove(removeParams).then(data => {
                    let { error_code, result } = data;
                    if (error_code == 0) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.tableData.splice(index,1);
                        console.log(index)
                        this.getList();

                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        goodsNew() {
            const path = '/goodsMgtNew';
            this.$router.push({ path: path });
        },

    }
}

</script>


