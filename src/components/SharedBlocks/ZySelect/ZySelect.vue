// 通用下拉菜单组件 for Vue.js
// 依赖 font awesome 字体库
// by zhiyi

<template>
  <div class="zyselect">
    <div class="select-box" @click="toggleDropdown">
      {{options.activeLabel}}<i class="fa fa-caret-down"></i>
    </div>
    <div class="dropdown-overlay" v-if="open" @click="toggleDropdown"></div>
    <transition name="fade">
      <div class="dropdown" v-if="open">
        <ul>
          <template v-for="(item, key) in options.list">
            <li @click="setActive(key)" :class="{active: item.active}">
              {{ item.label }}<i class="submenu-indicator fa fa-caret-right" v-if="Array.isArray(item.children) && item.children.length > 0"></i>
              <template v-if="Array.isArray(item.children) && item.children.length > 0">
                <ul class="submenu">
                  <template v-for="(subitem, subkey) in item.children">
                    <li @click="setSubActive(subkey, key)" @click.stop="" :class="{active: subitem.active}">{{ subitem.label }}</li>
                  </template>
                </ul>
              </template>
            </li>
          </template>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: ['options'],
  components: {},

  data () {
    return {
      open: false
    }
  },

  methods: {
    initSelect () {
      // 准备下拉列表项
      let hasChildren = false
      this.options.list.forEach(item => {
        if (typeof item === 'object') {
          item.active = false
          if (Array.isArray(item.children) && item.children.length > 0) {
            hasChildren = true
            item.children.forEach(child => {
              child.active = false
            })
          }
        }
      })
      // 制作默认值
      if (hasChildren) {
        // 有二级菜单
        this.options.list[0].active = true
        this.options.list[0].children[0].active = true
        this.options.active = [this.options.list[0].name, this.options.list[0].children[0].name, this.options.list[0].type, this.options.list[0].event]
        this.options.activeLabel = this.options.list[0].label + '的' + this.options.list[0].children[0].label
      } else {
        // 没有二级菜单
        this.options.list[0].active = true
        this.options.active = [this.options.list[0].name]
        this.options.activeLabel = this.options.list[0].label
      }
    },
    toggleDropdown () {
      this.$data.open = !this.$data.open
    },
    setActive (index) {
      if (Array.isArray(this.options.list[index].children) && this.options.list[index].children.length > 0) {
        return false
      }

      this.options.list.forEach(item => {
        item.active = false
      })
      this.options.list[index].active = true
      this.options.active = [this.options.list[index].name]
      this.options.activeLabel = this.options.list[index].label
      this.$data.open = false
    },
    setSubActive (subIndex, index) {
      this.options.list.forEach(item => {
        if (Array.isArray(item.children) && item.children.length > 0) {
          item.children.forEach(child => {
            child.active = false
          })
        }
      })
      this.options.list.forEach(item => {
        item.active = false
      })
      this.options.list[index].active = true
      this.options.list[index].children[subIndex].active = true
      this.options.active = [this.options.list[index].name, this.options.list[index].children[subIndex].name, this.options.list[index].type, this.options.list[index].event]
      this.options.activeLabel = this.options.list[index].label + '的' + this.options.list[index].children[subIndex].label
      this.$data.open = false
    }
  },
  mounted () {
    this.$nextTick(_ => {
      this.initSelect()
    })
  }
}
</script>

<style lang="scss" scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .1s
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0
}

.zyselect {
  display: inline-block;
  user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -webkit-user-select: none;
  cursor: pointer !important;
  margin: 3px 10px;

  .select-box {
    display: inline-block;
    color: #666666;
    background-color: #f0f8ff;
    padding: 6px 8px 5px 8px;
    border-radius: 3px;
    border: 1px solid #36acf1;
    cursor: pointer !important;

    .fa {
      margin-left: 8px;
      cursor: pointer !important;
    }
  }

  .select-box:hover {
    border-color: #80c6ef;
    background-color: #f6f8ff;
  }

  .select-box:active {
    color: #555555;
    border-color: #36acf1;
    background-color: #f0f8ff;
  }

  .dropdown-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: transparent;
    z-index: 99;
    cursor: default;
  }

  .dropdown {
    position: absolute;
    border: 1px solid #36acf1;
    border-radius: 3px;
    padding: 0;
    margin-top: 1px;
    background: #ffffff;
    z-index: 999;
    min-width: 50px;

    ul {
      margin: 0;
      list-style: none;

      li {
        padding: 6px 8px;
        transition: background 0.1s;
        color: #666666;
        position: relative;
        display: block;

        .submenu-indicator {
          float: right;
          margin-left: 6px;
          margin-top: 2px;
          color: #999999;
        }

        .submenu {
          visibility: hidden;
          position: absolute;
          left: 100%;
          top: 0px;
          min-width: 80px;
          border: 1px solid #36acf1;
          border-radius: 3px;
          padding: 0;
          margin-top: -1px;
          background: #ffffff;
        }
      }

      li.active, li.active:hover {
        background: #36acf1;
        color: #ffffff;

        .submenu-indicator {
          color: #ffffff;
        }
      }

      li:hover {
        background: rgba(200, 200, 200, 0.3);

        .submenu {
          visibility: visible;
        }
      }
    }
  }
}
</style>
