<template>
  <div class="modal fade" tabindex="-2" role="dialog" id="updateplanmodal">
    <div class="modal-dialog" role="document">
      <div class="modal-content">

        <div class="modal-header">
          <h5 class="pull-left">更换平面图背景图片</h5>
        </div>

        <div class="modal-body">
          <div class="form-group">
            选择平面图图片：
            <label>
              <input type="file" @change="_readFile" ref="readFile" accept=".jpg, .jpeg, .png, .gif">
            </label>
          </div>
          <div class="form-group" v-if="src">
            平面图图片预览：
            <label>
              <img :src="src" alt="sku-group-upload-preview" class="img-responsive">
            </label>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-default btn-flat pull-left" @click="_hideModal" :disabled="uploading">取消</button>
          <button type="button" class="btn btn-flat btn-primary pull-right" @click="_save" :disabled="uploading">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  props: ['plan'],
  components: {},
  computed: {
    ...mapGetters('storage', [
      'uploading'
    ])
  },
  data () {
    return {
      src: '',
      file: null
    }
  },
  methods: {
    ...mapActions('storage', [
      'upload'
    ]),
    ...mapActions('lbPlan', [
      'updatePlan'
    ]),
    _hideModal () {
      window.$('#updateplanmodal').modal('hide')
    },
    _readFile (e) {
      if (!window.FileReader) {
        this.$zydialog('抱歉，你的浏览器不支持文件预览上传功能。请安装最新版 Chrome、Firefox 或 Safari 浏览器后再试。')
        return false
      }
      this.file = null
      this.src = ''
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
    async _save () {
      if (!this.file) {
        this.$zydialog('请选择一张平面图图片')
        return false
      }
      try {
        let uResult = await this.upload(this.file)
        if (uResult.result && uResult.result.original_pic) {
          let result = await this.updatePlan({
            plan_id: this.plan.id,
            image_url: uResult.result.original_pic
          })
          if (typeof result === 'string') {
            this.$zydialog('错误：更新平面图失败。' + result)
          } else {
            window.$('#updateplanmodal').modal('hide')
            this.$zydialog('成功更新平面图')
            this.$bus.$emit('updatePlanImage', result.data.image_url)
          }
        } else {
          this.$zydialog('错误：上传图片失败，请重试')
        }
      } catch (err) {
        console.error(err)
        this.$zydialog('错误：更新平面图失败。')
      }
    },
    _resetForm () {
      this.file = null
      this.src = ''
      if (this.$refs.readFile) this.$refs.readFile.value = ''
    }
  },
  mounted () {},
  created () {
    this.$bus.$on('resetUpdatePlanForm', this._resetForm)
  }
}
</script>

<style lang="scss" scoped>
</style>
