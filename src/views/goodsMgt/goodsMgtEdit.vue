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
                        <el-input placeholder='请输入商品名称' v-model="name" class="input_select"></el-input>
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
                                    <i class="el-icon-close goods_close"></i>
                                </el-button>
                            </div>
                            <div v-if="spec.spec_name!='' " class='sku_select'>
                                <el-select class='sku_value' v-model="spec.spec_value" @change="searchHistoryNew(3,spec.spec_value,spec.spec_name)" multiple filterable allow-create placeholder="请选择规格值">
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
import { getBatchParam, requestHistoryNew, requestSearchHistory, requestEdit, requestUpdate, requestBrand, requestBrandHistory, requestUpload } from '../../api/goodsServer';
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
        //删除品牌规格
        deletSku(index) {
            this.specs.splice(index, 1);
        },
        //获得品牌规格值
        getSkuVulue(name) {
            this.searchHistoryNew(2, name)
            this.loadAll(3, name);
        },
        //添加品牌规格
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
        //新建品牌类目，规格，规格值
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
        //图片上传成功之后事件
        handleAvatarSuccess(res, file) {
            this.imageUrl = res.result.original_pic

        },
        submit() {
            this.specs = this.specs.filter(v => {
                return v.spec_value.length;
            });
            this.batch = getBatchParam(this.specs)
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
        //通过name，创建品牌ID
        getBrandId(brand_name) {
            let newbrandParams = { uid: this.uid, brand_name: brand_name };
            requestBrand(newbrandParams).then(data => {
                this.brand = data.brand
            })
        },
        //品牌模糊搜索
        brandHistory() {
            let brandParams = {
                head_office_id: this.head_office_id,
                name: this.brand_name
            };
            requestBrandHistory(brandParams).then(data => {
                this.brand = data.brand
            })
        },
        //商品信息带回
        getGoodsMes() {
            const goods_id = this.$route.query.goods_id;
            let mesParams = { goods_id: goods_id };
            requestEdit(mesParams).then(data => {
                this.brand_name = data.brand_name
                this.small_category = data.small_category
                this.big_category = data.big_category
                this.name = data.name
                this.imageUrl = data.imageUrl
                this.specs = data.specs
            })
        },
        //获取品牌类目，规格，规格值，模糊搜索
        loadAll(type, parent_key_word) {
            let bigParams = { uid: this.uid, type: type, parent_key_word: parent_key_word };
            requestSearchHistory(bigParams).then(data => {
                if (data.bigcategory) {
                    this.bigcategory = data.bigcategory
                }
                if (data.smallcategory) {
                    this.smallcategory = data.smallcategory
                }
                if (data.sku) {
                    this.sku = data.sku
                }
                if (data.skuValue) {
                    this.skuValue = data.skuValue
                }
            })
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