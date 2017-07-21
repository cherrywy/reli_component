 <template>
    <section>
        <el-row :gutter="20">
            <el-col>
                <el-form :label-position="labelPosition" label-width="80px">
                    <el-form-item label="商品类目">
                         <el-select v-model="big_category" filterable allow-create placeholder="大类目" @change="searchHistoryNew(0,big_category)">
                            <el-option v-for="item in bigcategory" :key="item.id" :label="item.name" :value="item.value">
                            </el-option>
                        </el-select>
                        <el-select v-model="small_category" filterable allow-create placeholder="小类目" @change="searchHistoryNew(1,small_category)">
                            <el-option v-for="item in smallcategory" :key="item.id" :label="item.name" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品品牌">
                        <el-select v-model="brand_name" @change="getBrandId(brand_name)" filterable allow-create placeholder="请选择品牌">
                            <el-option v-for="item in brand" :key="item.id" :label="item.name" :value="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品名称">
                        <el-input placeholder='请输入商品名称' v-model="name"  class="input_select"></el-input>
                    </el-form-item>
                    <el-form-item label="商品图片">
                        <el-upload class="avatar-uploader" :action="action" name="pic" :show-file-list="false" :on-success="handleAvatarSuccess">
                            <img v-if="imageUrl" :src="imageUrl" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
    
                    </el-form-item>
                    <el-form-item label="商品规格">
                        <span class='brand_text'>商品如果有多个规格，可以点击右边的按钮来“添加规格”</span>
                        <el-button type="text" @click="addSku()">添加规格</el-button>
    
                        <div v-for="(spec,index) in specs">
                            <div class="spec_content">
                                <el-select class='sku' v-model="spec.spec_name" @change="getSkuVulue(spec.spec_name)" filterable allow-create placeholder="请选择规格">
                                    <el-option v-for="item in sku" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-button type="text" @click="deletSku(index)">
                                    <i class="el-icon-close goods_close" ></i>
                                </el-button>
                            </div>
                            <div v-if="spec.spec_name!='' " class='sku_select'>
                                 <el-select class='sku_value'  v-model="spec.spec_value" @change="searchHistoryNew(3,spec.spec_value,spec.spec_name)" multiple filterable allow-create placeholder="请选择规格值">
                                    <el-option v-for="item in skuValue" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                    </el-form-item>
                </el-form>
                <el-button type="primary" @click="submit" class='blue-btn wt_100'>保存</el-button>
            </el-col>
    
        </el-row>
    
    </section>
</template>
 <script>
import { requestHistoryNew,requestSearchHistory, requestEdit, requestUpdate, requestBrand, requestBrandHistory, requestUpload } from '../../api/goodsServer';
import env from '../../env'
export default {
    data() {
        return {
            action: `${env.apiServer}/util/file/upload.json`,
            uid: '',
            head_office_id: '',
            labelPosition: 'top',
            bigcategory: [],
            smallcategory: [],
            brand: [],
            brand_name: '',
            small_category: '',
            big_category: '',
            name: '',
            imageUrl: '',
            sku: [],
            skuValue: [],
            specs: [],
            batch: [],
            goodsMes: [],
            loading: false,

        }
    },
    mounted() {
        this.uid = localStorage.getItem('uid');
        this.head_office_id = localStorage.getItem('head_office_id');
        this.loadAll(0);
        this.loadAll(1);
        this.brandHistory();
        this.getGoodsMes()
    },
    methods: {
        deletSku(index) {
            this.specs.splice(index, 1);
        },
        getSkuVulue(name) {
            this.searchHistoryNew(2, name)
            this.loadAll(3, name);
        },
        addSku() {
            if (this.specs.length == 0) {
                this.loadAll(2);
                this.loadAll(3);
            }
            if (this.specs.length < 3) {
                this.specs.push({
                    spec_name: '',
                    spec_value: []
                });

            } else {
                this.$message({
                    message: "目前只能添加3个规格",
                    type: 'warning'
                });

            }
        },
        searchHistoryNew(type, key_word, parent_key_word) {
            if (type === 3) {
                if (Array.isArray(key_word)) {
                    if (key_word.length > 0) {
                        key_word = key_word[key_word.length - 1];
                    }
                }
            }
            let historyNewParams = { uid: this.uid, type: type, key_word: key_word, parent_key_word: parent_key_word };

            requestHistoryNew(historyNewParams).then(data => {
                let { error_code, result } = data;
                if (error_code !== 0) {
                    this.$message({
                        message: "返回数据有误",
                        type: 'error'
                    });
                } else {


                }
            })
        },
        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
            this.imageUrl = res.result.original_pic

        },
        submit() {

            this.specs = this.specs.filter(v => {
                return v.spec_value.length;
            });

            this.batch = this.getBatchParam(this.specs)
            const goods_id = this.$route.query.goods_id;
            const brand_id = this.brand.filter(v => {
                return v.name === this.brand_name;
            }).map(v => v.id).pop();
            var newParams = {
                uid: this.uid,
                id: goods_id,
                batch: this.batch,
                big_category: this.big_category,
                brand_id: brand_id,
                name: this.name,
                small_category: this.small_category,
                title_pics: this.imageUrl
            };
            requestUpdate(newParams).then(data => {
                let { error_code, result } = data;
                if (error_code == 0) {
                    this.$message({
                        message: "保存成功",
                        type: 'success'
                    });
                    this.goodsList()
                } else {

                    this.$message({
                        message: "返回数据有误",
                        type: 'error'
                    });
                }
            })
        },
        getBrandId(brand_name) {
            let newbrandParams = { uid: this.uid, brand_name: brand_name };
            requestBrand(newbrandParams).then(data => {
                let { error_code, result } = data;
                if (error_code !== 0) {
                    this.$message({
                        message: "返回数据有误",
                        type: 'error'
                    });
                } else {
                    this.brand = result
                }
            })
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
        getGoodsMes() {
            const goods_id = this.$route.query.goods_id;
            let mesParams = { goods_id: goods_id };
            requestEdit(mesParams).then(data => {
                let { error_code, result } = data;
                if (error_code !== 0) {
                    this.$message({
                        message: "返回数据有误",
                        type: 'error'
                    });
                } else {
                    this.brand_name = result.list.goods_brand_name ? result.list.goods_brand_name : ''
                    this.small_category = result.list.goods_small_category ? result.list.goods_small_category : ''
                    this.big_category = result.list.goods_big_category ? result.list.goods_big_category : ''
                    this.name = result.list.goods_name ? result.list.goods_name : ''
                    this.imageUrl = result.list.goods_title_pics ? result.list.goods_title_pics : ''
                    function getSpecsResult(data) {
                        const result_specs_to_params = (data) => {
                            let specs = [];
                            if (!data) {
                                return [];
                            }
                            if (data.hasOwnProperty('spec_spec1_name') && data['spec_spec1_name']) {
                                specs.push({
                                    spec_name: data['spec_spec1_name'],
                                    spec_value: data['spec_spec1_values']
                                })
                            }
                            if (data.hasOwnProperty('spec_spec2_name') && data['spec_spec2_name']) {
                                specs.push({
                                    spec_name: data['spec_spec2_name'],
                                    spec_value: data['spec_spec2_values']
                                })
                            }
                            if (data.hasOwnProperty('spec_spec3_name' && data['spec_spec3_name'])) {
                                specs.push({
                                    spec_name: data['spec_spec3_name'],
                                    spec_value: data['spec_spec3_values']
                                })
                            }
                            return specs;
                        }
                        return result_specs_to_params(result.list);
                    }

                    this.specs = getSpecsResult(result.list) ? getSpecsResult(result.list) : []

                }
            })
        },
        loadAll(type, parent_key_word) {
            let bigParams = { uid: this.uid, type: type, parent_key_word: parent_key_word };
            requestSearchHistory(bigParams).then(data => {
                let { error_code, result } = data;
                if (error_code !== 0) {
                    this.$message({
                        message: "返回数据有误",
                        type: 'error'
                    });
                } else {
                    if (type == 0) {
                        this.bigcategory = result.map(v => {
                            return {
                                value: v
                            }
                        });
                    }
                    if (type == 1) {
                        this.smallcategory = result.map(v => {
                            return {
                                value: v
                            }
                        });
                    }
                    if (type == 2) {
                        this.sku = result.map(v => {
                            return {
                                value: v
                            }
                        });
                    }
                    if (type == 3) {
                        this.skuValue = result.map(v => {
                            return {
                                value: v
                            }
                        });
                    }

                }
            })
        },
        getBatchParam(specs) {

            const com_data = (specs) => {

                const result = specs.map((v, index) => {
                    const { spec_name, spec_value = [] } = v;
                    return spec_value.map(v => {
                        const obj = {};
                        obj[`spec${index + 1}_name`] = spec_name;
                        obj[`spec${index + 1}_value`] = v;
                        return obj;
                    })
                });
                if (result.length === 1) {
                    return result.pop();
                } else if (result.length === 2) {
                    return two_com_data(result);
                } else if (result.length === 3) {
                    return three_com_data(result);
                } else {
                    return null;
                }
            };

            function extend(target, source, source_two) {
                const tmp = JSON.parse(JSON.stringify(target));
                for (let obj in target) {
                    tmp[obj] = target[obj];
                }
                for (let obj in source) {
                    tmp[obj] = source[obj];
                }
                if (source_two) {
                    for (let obj in source_two) {
                        tmp[obj] = source_two[obj];
                    }
                }
                return tmp;
            }

            const two_com_data = (datas) => {
                let batch = [];
                for (let i = 0; i < datas[0].length; i++) {
                    for (let j = 0; j < datas[1].length; j++) {
                        let s1 = datas[0][i];
                        let s2 = datas[1][j];
                        batch.push(extend(s1, s2));
                    }
                }
                return batch;
            };

            const three_com_data = (datas) => {
                let batch = [];
                for (let i = 0; i < datas[0].length; i++) {
                    for (let j = 0; j < datas[1].length; j++) {
                        for (let k = 0; k < datas[2].length; k++) {
                            let s1 = datas[0][i];
                            let s2 = datas[1][j];
                            let s3 = datas[2][k];
                            batch.push(extend(s1, s2, s3));
                        }
                    }
                }
                return batch;
            };
            return com_data(specs);
        },
        goodsList() {
            const path = '/goodsMgtList';
            this.$router.push({ path: path });
        },
    }
}

</script>
 <style>
#goods-app {
    width: 1080px;
    margin: 20px auto;
}

.sku .el-input__icon+.el-input__inner {
    padding-right: 0px;
}

.sku .el-select .el-input {
    background-color: transparent;
    -webkit-appearance: none;
}

#goods-app .el-input__inner {
    width: 200px;
    display: inline-block;
}

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>