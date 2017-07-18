<template>
  <div class="modal fade" tabindex="-1" role="dialog" id="skugroupmodal">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <transition name="fade">
          <div class="modal-header" v-if="!editMode">
            <h4>背柜模板选择 <small>请点击模板进行选择</small></h4>
          </div>
          <div class="modal-header" v-else>
            <h4>编辑背柜模板</h4>
          </div>
        </transition>

        <transition name="fade">
          <div class="modal-body" v-if="!editMode">
            <div class="row">
              <div class="col-xs-12">
                <div class="row">
                  <div class="col-xs-6 col-sm-4 col-md-3" v-for="sg in skuGroupTemplateList" :key="sg.id">
                    <div class="box box-solid">
                      <div class="box-body square-container" @click="applySkuGroupTemplate(sg)">
                        <img :src="sg.image_url" :alt="sg.id + '_preview'" class="preview img-responsive">
                        <h5>{{ sg.name }}</h5>
                        <small class="text-muted">区域数量 {{ sg.sku_ids.length }}</small>
                      </div>

                      <div class="box-footer">
                        <button class="btn btn-flat btn-xs btn-default" @click="editSkuGroupTemplate(sg)">编辑</button>                    
                        <button class="btn btn-flat btn-xs btn-default pull-right" @click="_deleteSkuGroupTemplate(sg)"><i class="fa fa-trash"></i></button>
                      </div>
                    </div>
                  </div>
                  <div class="col-xs-6 col-sm-4 col-md-3">
                    <div class="box box-solid square-container" @click="addTemplate">
                      <div class="box-body">
                        <div class="row">
                          <div class="col-xs-12">
                            <div class="plus-box">
                              <div class="plus-btn">
                                <i class="fa fa-plus-circle" aria-hidden="true"></i>                          
                              </div>
                              <h5 class="text-center">新增模板</h5>
                              <small>&nbsp;</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>

          <div class="modal-body painter" v-else>
            <Painter :sgid="selectedSGId"></Painter>
          </div>
        </transition>

        <div class="modal-footer" v-if="!editMode">
          <button type="button" class="btn btn-flat btn-default" @click="_hideModal">取消</button>
        </div>

      </div>
    </div>
    <AddTemplate></AddTemplate>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Painter from './Painter'
import AddTemplate from './AddTemplate'

export default {
  props: [],
  components: {
    Painter,
    AddTemplate
  },
  computed: {
    ...mapGetters('lbSkuGroup', [
      'skuGroupTemplateList'
    ])
  },
  watch: {
    selectedSGId (after) {
      //
    }
  },
  data () {
    return {
      selectedSGId: 0,
      editMode: false
    }
  },
  methods: {
    ...mapActions('lbSkuGroup', [
      'fetchSkuGroupTemplateData',
      'deleteSkuGroup'
    ]),
    addTemplate () {
      this.$bus.$emit('resetAddTemplateForm')
      window.$('#addtemplatemodal').modal({
        keyboard: false,
        backdrop: 'static'
      })
    },
    _hideModal () {
      window.$('#skugroupmodal').modal('hide')
    },
    applySkuGroupTemplate (skuGroup) {
      if (skuGroup.sku_ids.length === 0) {
        this.$zydialog('模板中尚未绘制区域，请先编辑区域再使用此模板')
        return false
      }
      this.$zydialog({
        msg: `确定使用模板「${skuGroup.name || '未命名'}」吗？`,
        onOk: () => {
          this.$bus.$emit('saveActiveObjectFromSkuTemplate', parseInt(skuGroup.id))
          this._hideModal()
        }
      })
    },
    editSkuGroupTemplate (skuGroup) {
      this.selectedSGId = skuGroup.id
      this.editMode = true
    },
    async _deleteSkuGroupTemplate (skuGroup) {
      this.$zydialog({
        msg: `确实要删除背柜模板「${skuGroup.name}」吗？`,
        desc: '使用此模板的背柜不会受影响',
        okDanger: true,
        onOK: async () => {
          let res = await this.deleteSkuGroup(skuGroup.id)
          if (typeof res === 'string') {
            this.$zydialog('错误：删除背柜模板失败。' + res)
          } else {
            await this.fetchSkuGroupTemplateData()
          }
        }
      })
    },
    async exitEditSkuGroupTemplate () {
      await this.fetchSkuGroupTemplateData()
      this.editMode = false
    }
  },
  mounted () {},
  created () {
    this.$bus.$on('skuGroupPaint.editMode.false', this.exitEditSkuGroupTemplate)
  }
}
</script>

<style lang="scss" scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .4s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

img.preview {
  max-width: 130px;
  height: 130px;
  object-fit: contain;
  margin: 0 auto;
}

.painter {
  padding: 0;
}

.square-container {
  transition: all .2s;
}

.square-container:hover {
  background: #f0f0f0;
  cursor: pointer;
}

.square-container:active {
  background: #eaeaea;
}

.plus-box {
  display: flex;
  flex-direction: column;

  .plus-btn {
    font-size: 60px;
    height: 134px;
    align-self: center;
    padding-top: 20px;
    color: #49ca41;
  }
}
</style>
