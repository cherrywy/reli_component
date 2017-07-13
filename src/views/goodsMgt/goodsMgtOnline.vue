<template>
   <section>
            <el-row :gutter="20">
                <el-form :inline="true" :model="formInline" class="demo-form-inline">
                    <el-form-item label="请选择门店：">
                        <el-select v-model="formInline.user" placeholder="活动区域">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="请选择布局图：">
                        <el-select v-model="formInline.region" placeholder="活动区域">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
    
                </el-form>
            </el-row>
            <el-row :gutter="20" :offset="10" style="margin-bottom:20px;text-align:center;">
                <el-card style="margin: 0 auto; width:500px;height:300px;">
                    <img src="../../assets/logo.png" class="image">
                    <div style="padding: 14px;">
                        <span>好吃的汉堡</span>
                        <div class="bottom clearfix">
                            <time class="time">{{ currentDate }}</time>
                            <el-button type="text" class="button">操作按钮</el-button>
                        </div>
                    </div>
                </el-card>
            </el-row>
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span style="line-height: 36px;">卡片名称</span>
                    <el-button style="float: right;" type="primary" @click="dialogFormVisible = true">上架商品</el-button>
                    <el-dialog :visible.sync="dialogFormVisible">
                        <el-form :model="form">
                            <el-form-item label="">
                                <el-input v-model="form.name" placeholder="请输入商品名称搜索" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <div class="block">
                                    <span class="demonstration">每页显示条数</span>
                                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage2" :page-sizes="[2, 3, 5, 6]" :page-size="15" layout="sizes, prev, pager, next" :total="50">
                                    </el-pagination>
                                </div>
                                <el-table ref="multipleTable" :data="tableData3" border tooltip-effect="dark" style="width: 100%">
                                    <el-table-column type="selection" width="55">
                                    </el-table-column>
                                    <el-table-column label="日期">
                                        <template scope="scope">{{ scope.row.date }}</template>
                                    </el-table-column>
                                    <el-table-column prop="name" label="姓名">
                                    </el-table-column>
                                </el-table>
                                <el-row class="row center">
                                    <el-pagination style="margin: 20px auto;float:right" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="10" layout="total, prev, pager, next, jumper" :total='total'>
                                    </el-pagination>
                                </el-row>
                            </el-form-item>
                        </el-form>
                        <div style="text-align:center">
    
                            <el-button type="primary" style="margin:auto 0" @click="dialogFormVisible = false">保存</el-button>
                        </div>
                    </el-dialog>
    
                </div>
                <el-table :data="tableData" border style="width: 100%;margin-top: 15px;">
                    <el-table-column prop="address" label="商品名称">
                    </el-table-column>
                    <el-table-column prop="name" label="商品规格" align="center">
                    </el-table-column>
    
                    <el-table-column label="操作" align="center">
                        <template scope="scope">
                            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">下架</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-row class="row center">
                    <el-pagination style="margin: 20px auto;float:right" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="10" layout="total, prev, pager, next, jumper" :total='total'>
                    </el-pagination>
                </el-row>
            </el-card>
    
       </section>
</template>

<style>
#goods-app {
    width: 1080px;
    margin: 20px auto;
}

.image {
    width: 100%;
    display: block;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both
}
</style>

<script>
export default {
    data() {
        return {
            tableData3: [{
                date: '2016-05-03',
                name: '王小虎',
            }, {
                date: '2016-05-02',
                name: '王小虎',
            }, {
                date: '2016-05-04',
                name: '王小虎',
            }, {
                date: '2016-05-01',
                name: '王小虎',
            }, {
                date: '2016-05-08',
                name: '王小虎',
            }],
            multipleSelection: [],
            dialogFormVisible: false,
            form: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            },
            formLabelWidth: '120px',
            formInline: {
                user: '',
                region: ''
            },
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
            value: '品牌',
            total: 0
        }
    },
    // mounted: function () {
    //     var vm = this;
    //     var api = 'http://banklumen.iwocar.com/adver/list/admin?token=' + localStorage.getItem('api_token');
    //     vm.axios.get(api).then(response => {
    //         console.log(response.data);
    //         vm.loading = false;
    //         vm.tableData = [];
    //         vm.tableContent = response.data;
    //         vm.total = vm.tableContent.length;
    //         var dataLength = 10;
    //         if (vm.total < 10) {
    //             dataLength = vm.total;
    //         };
    //         for (var x = 0; x < dataLength; x++) {
    //             vm.tableData.push(vm.tableContent[x]);
    //         };
    //         console.log(vm.tableData);
    //     });
    // },
    methods: {
        goodsNew() {
            const path = '/goods/new';
            this.$router.push({ path: path });
        }
    }
}

</script>