<template>
    <section>
        <el-col :span="24">
            <el-col :span="7">
                <el-select v-model="brand_name" style="width: 261px;" placeholder="品牌">
                    <el-option v-for="item in brand" :key="item.id" :label="item.name" :value="item.name">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="7" :offset="1">
                <el-input v-model="key_word" icon="search" placeholder="请输入商品的名称，规格"></el-input>
            </el-col>
            <el-col :span="3" :offset="2">
                <el-button type="text" style="font-size:16px" @click="searchList">搜索</el-button>
                <el-button type="text" style="font-size:16px" @click="removekeyWord">清空</el-button>
            </el-col>
        </el-col>
    
        <el-col :span="24" style="margin-bottom:20px">
    
            <el-button type="primary" style="float:right;background:#70a5ec" @click="goodsNew">添加商品</el-button>
    
        </el-col>
        <el-table :data="tableData" border style="width: 100%; margin-top: 15px;">
            <el-table-column label="商品图片" width="120" align="center" >
                <template scope="scope">
                    <img v-if='scope.row.goods_title_pics&&scope.row.goods_title_pics.length!=0' style='margin: 5px;' width='60' height='60' :src="scope.row.goods_title_pics">
                     <img width='60' height='60' style='margin: 5px;'  v-else src="/static/pic_blank.png">
                </template>
    
            </el-table-column>
            <el-table-column prop="goods_name" label="商品名称" align="center">
            </el-table-column>
            <el-table-column label="规格" width="150" align="center">
                <template scope="scope">
                    <div v-for="item in scope.row.spec_info">
                       
                   {{item.spec1_value?item.spec1_value:''}} {{item.spec2_value?","+item.spec2_value:''}}{{item.spec3_value?","+item.spec3_value:''}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="goods_brand_name" label="品牌" align="center" width="100">
            </el-table-column>
            <el-table-column prop="goods_created_at" label="创建时间" width="130" align="center">
            </el-table-column>
            <el-table-column label="操作" align="center" width="150">
                <template scope="scope">
                    <el-button size="small" type="info" style="background:#70a5ec" @click="handleEdit(scope.row.goods_id)">编辑</el-button>
                    <el-button size="small" style="background:#E0595B;opacity:0.66;color:#000" @click="handleDelete(scope.$index, scope.row.goods_id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-row class="row center">
            <el-pagination style="margin: 20px auto;float:right" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total='total'>
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

import { requestList, requestRemove, requestBrandHistory } from '../../api/goodsServer';

export default {
    data() {
        return {
            uid: '',
            tableData: [],
            brand: [],
            key_word: '',
            brand_name: '',
            currentPage: 1,
            pageSize: 20,
            total: 0
        }
    },
    mounted: function () {
        this.uid = localStorage.getItem('uid');
        this.head_office_id= localStorage.getItem('head_office_id');
        this.brandHistory()
        this.getList()

    },
    methods: {
        removekeyWord(){
           this.brand_name = ''
            this.key_word = ''
        },
        brandHistory() {
            let brandParams = { head_office_id: this.head_office_id, name: this.brand_name };
            requestBrandHistory(brandParams).then(data => {
                let { error_code, result } = data;
                if (error_code !== 0) {
                    this.$message({
                        message: "返回数据有误",
                        type: 'error'
                    });
                } else {
                    this.brand = result.list
                }
            })
        },
        getList(brand_name,key_word, pageNum) {
            let listParams = { uid:this.uid, page: pageNum };
            if (brand_name) {
                listParams['brand_name'] = brand_name
            }
            if (key_word) {
                listParams['key_word'] = key_word
            }
            requestList(listParams).then(data => {
                console.log(data.tableData)
                    this.tableData = data.tableData;
                   
                    this.total = data.total_count;
            }).catch(err=>{
                this.$message({
                        message: "返回数据有误",
                        type: 'error'
                    });
            })
        },
        searchList() {
            this.getList(this.brand_name, this.key_word, 0)
           
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getList(this.brand_name, this.key_word, this.currentPage)
        },
        handleEdit(goods_id) {
            const path = '/goodsMgtEdit?goods_id=' + goods_id;
            this.$router.push({ path: path });
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
                        this.tableData.splice(index, 1);
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


