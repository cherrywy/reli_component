import './styles.scss'
const template = `
<transition name="zy-dialog-transition">
  <div class="zy-dialog" v-show="visible" @click.self="maskClick">
    <div class="zy-dialog-dialog zy-dialog-sm" ref="dialogContent" tabindex="-1">
      <div class="zy-dialog-header" :class="{'with-body': bodyContent}">
        {{ headerContent }}
      </div>

      <div class="zy-dialog-body" v-if="bodyContent">
        {{ bodyContent }}
      </div>

      <div class="zy-dialog-footer">
        <input type="button" class="zy-dialog-footer-button" :class="{'red': cancelDanger}" v-if="!lbHide" @click="lbClick" :value="lbLabel">
        <input type="button" ref="okButton" tabindex="-1" class="zy-dialog-footer-button" :class="{'red': okDanger}" v-if="!rbHide" @click="rbClick" :value="rbLabel">
      </div>
    </div>
  </div>
</transition>
`
export default {
  install (Vue, options) {
    Vue.prototype.$zydialog = (options) => {
      if (!options) options = {}
      if (typeof options === 'string') {
        let msg = options
        options = { msg, okOnly: true }
      }
      let unloadDialog
      let Dialog = Vue.extend({
        methods: {
          hide () {
            this.visible = false
            setTimeout(() => {
              unloadDialog()
            }, 200)
          },
          maskClick () {
            if (this.force === false) {
              this.hide()
              if (typeof this.lbAction === 'function') {
                this.lbAction()
              }
            }
          },
          lbClick () {
            this.hide()
            if (typeof this.lbAction === 'function') {
              this.lbAction()
            }
          },
          rbClick () {
            this.hide()
            if (typeof this.rbAction === 'function') {
              this.rbAction()
            }
          }
        },
        data () {
          return {
            headerContent: options.msg || '无提示',
            bodyContent: options.desc || null,
            lbLabel: options.cancelLabel || '取消',
            rbLabel: options.okLabel || '确定',
            visible: false,
            force: options.force || false,
            lbHide: options.okOnly || false,
            rbHide: false,
            lbAction: options.onCancel || null,
            rbAction: options.onOk || options.onOK || null,
            okDanger: options.okDanger || false,
            cancelDanger: options.cancelDanger || false
          }
        },
        template: template,
        mounted () {
          this.$nextTick(() => {
            this.visible = true
            if (this.lbHide) {
              setTimeout(() => {
                this.$refs.okButton.focus()
              }, 40)
            } else {
              setTimeout(() => {
                this.$refs.dialogContent.focus()
              }, 40)
            }
          })
        }
      })
      let tpl = new Dialog().$mount().$el
      document.body.appendChild(tpl)
      unloadDialog = () => {
        document.body.removeChild(tpl)
      }
    }
  }
}
