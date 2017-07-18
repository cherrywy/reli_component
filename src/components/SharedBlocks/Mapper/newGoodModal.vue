<template>
  <div class="modal fade" tabindex="-2" role="dialog" id="newgoodmodal">
    <div class="modal-dialog" role="document">
      <div class="modal-content">

        <div class="modal-header">
          <h5 class="pull-left">新增商品</h5>
        </div>

        <div class="modal-body">
          <div class="row">
            <div class="col-xs-12">
              <div class="form-group">
                <label>名称</label>
                <input type="text" v-model="goodData.name" class="form-control">
              </div>

              <div class="form-group">
                <label>品牌</label>
                <select v-model="goodData.brand_id" class="form-control">
                  <option disabled value="0">请选择品牌</option>
                  <option v-for="brand in brandsList" :value="brand.id" :key="brand.id">{{ brand.name }}</option>
                </select>
              </div>

              <div class="form-group">
                <label>描述</label>
                <textarea class="form-control" rows="3" v-model="goodData.desc"></textarea>
              </div>

              <div class="form-group pull-left">
                <label>图片</label>
                <input type="file" @change="_readFile" ref="readFile" accept=".jpg, .jpeg, .png, .gif">
              </div>
              <div class="form-group pull-right" v-if="src">
                <label>预览</label>
                <img :src="src" alt="good-preview" class="good-preview img-responsive">
              </div>

            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-default btn-flat pull-left" @click="cancel" :disabled="uploading">取消</button>
          <button type="button" class="btn btn-flat btn-success pull-right" @click="save" :disabled="uploading">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import _ from 'lodash'

export default {
  props: [],
  components: {},
  computed: {
    ...mapGetters('storage', [
      'uploading'
    ]),
    ...mapGetters('mbBrands', [
      'brandsList'
    ])
  },
  data () {
    return {
      goodData: {
        name: '',
        brand_id: '0',
        desc: '',
        image_url: ''
      },
      file: null,
      src: ''
    }
  },
  methods: {
    ...mapActions('storage', [
      'upload'
    ]),
    ...mapActions('mbGoods', [
      'createGood'
    ]),
    hideModal () {
      window.$('#newgoodmodal').modal('hide')
      window.$('#newgoodmodal').on('hidden.bs.modal', () => {
        window.$('body').addClass('modal-open')
      })
    },
    cancel () {
      this.hideModal()
    },
    async save () {
      if (!this.goodData.name) {
        this.$zydialog('请填写商品名称')
        return false
      }
      let brandId = parseInt(this.goodData.brand_id)
      if (isNaN(brandId) || brandId === 0) {
        this.$zydialog('请选择品牌')
        return false
      }
      if (!this.file) {
        this.$zydialog('请选择一张商品图片')
        return false
      }
      try {
        let uResult = await this.upload(this.file)
        if (uResult.result && uResult.result.original_pic) {
          this.goodData.image_url = uResult.result.original_pic
          let result = await this.createGood(_.merge({}, this.goodData))
          if (result === true) {
            this.hideModal()
            this.$zydialog('成功新增商品')
          } else {
            this.$zydialog('错误：新增商品失败。' + result)
          }
        } else {
          this.$zydialog('错误：上传图片失败，请重试')
        }
      } catch (err) {
        console.error(err)
        this.$zydialog('错误：上传图片失败，请重试')
      }
    },
    _readFile (e) {
      if (!window.FileReader) {
        this.$zydialog('抱歉，你的浏览器不支持文件预览上传功能。请安装最新版 Chrome、Firefox 或 Safari 浏览器后再试。')
        return false
      }
      this.file = null
      this.goodData.image_url = ''
      let files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        return false
      }
      let reader = new FileReader()
      reader.onload = event => {
        this.src = event.target.result
      }
      reader.readAsDataURL(files[0])
      this.file = files[0]
    },
    resetForm () {
      this.goodData = {
        name: '',
        brand_id: '0',
        desc: '',
        image_url: ''
      }
      this.file = null
      this.src = ''
    }
  },
  mounted () {},
  created () {
    this.$bus.$off('newGoodModalReset')
    this.$bus.$on('newGoodModalReset', this.resetForm)
  }
}
</script>

<style lang="scss" scoped>
.good-preview {
  max-width: 160px;
}
</style>
