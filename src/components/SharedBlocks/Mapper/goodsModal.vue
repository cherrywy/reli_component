<template>
  <div class="modal fade" tabindex="-2" role="dialog" id="goodslistmodal">
    <div class="modal-dialog" role="document">
      <div class="modal-content">

        <div class="modal-header">
          <h5 class="pull-left">选择要上架的商品</h5>
        </div>

        <div class="modal-body">
          <div class="box box-solid">
            <div class="box-body">
              <div class="row">
                <div class="col-xs-12">
                  <p>
                    <strong>列表过滤：</strong>
                    <button class="btn btn-flat btn-xs" :class="{'btn-primary': displayMode === 'all', 'btn-default': displayMode !== 'all'}" @click="displayAll">显示全部</button>
                    <button class="btn btn-flat btn-xs" :class="{'btn-primary': displayMode === 'onshelf', 'btn-default': displayMode !== 'onshelf'}" @click="displayOnShelf">仅显示架上的商品</button>
                  </p>
                </div>
              </div>
              <div class="row">
                <div class="col-xs-12">
                  <p>
                    <strong>批量操作：</strong>
                    <button class="btn btn-flat btn-xs btn-default" @click="deselectAll">全部取消选择</button>
                  </p>
                </div>
              </div>

              <div class="row">
                <div class="col-xs-12">
                  <p>
                    <button class="btn btn-flat btn-sm btn-primary pull-right" @click="showNewGoodModal"><i class="fa fa-plus"></i> 新增商品</button>
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <v-client-table :data="goodsList" :columns="columns" :options="options"></v-client-table>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-default btn-flat pull-left" @click="cancel">取消</button>
          <button type="button" class="btn btn-flat btn-success pull-right" @click="save">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Event } from 'vue-tables-2'

export default {
  props: [],
  components: {},
  computed: {
    ...mapGetters('mbGoods', [
      'goodsList'
    ]),
    ...mapGetters('lbSku', [
      'activeSku'
    ])
  },
  data () {
    return {
      displayMode: 'all',
      columns: ['selected', 'name', 'brand_name'],
      options: {
        sortable: ['name', 'brand_name'],
        orderBy: {
          column: 'id'
        },
        highlightMatches: true,
        customFilters: [
          {
            name: 'toggle_display',
            callback (row, itemIds) {
              if (itemIds === 'all') {
                return true
              } else if (Array.isArray(itemIds)) {
                return ~itemIds.indexOf(row.id)
              }
            }
          }
        ],
        texts: {
          count: '正在显示 {count} 条数据中的 {from} 到 {to} 条',
          filter: '',
          filterPlaceholder: '搜索关键词',
          limit: '每页条数：',
          noResults: '未找到匹配的结果',
          page: '页码',
          filterBy: '过滤条件 {column}',
          loading: '载入中...',
          defaultOption: '选择 {column}'
        },
        headings: {
          'selected': '选择',
          'name': '名称',
          'brand_name': '品牌'
        },
        templates: {
          selected: 'toggleGoods' // 在 main.js 里注册
        }
      }
    }
  },
  methods: {
    ...mapActions('lbSku', [
      'updateItemIds'
    ]),
    ...mapActions('mbBrands', [
      'getBrandsList'
    ]),
    async showNewGoodModal () {
      await this.getBrandsList()
      this.$bus.$emit('newGoodModalReset')
      window.$('#newgoodmodal').modal({
        keyboard: false,
        backdrop: 'static'
      })
    },
    hideModal () {
      window.$('#goodslistmodal').modal('hide')
    },
    cancel () {
      this.hideModal()
    },
    async save () {
      let res = await this.updateItemIds()
      if (typeof res === 'string') {
        this.$zydialog('错误：保存架上商品失败。' + res)
      } else {
        this.$zydialog('成功保存架上商品')
        this.hideModal()
      }
    },
    displayAll () {
      Event.$emit('vue-tables.filter::toggle_display', 'all')
      this.displayMode = 'all'
    },
    displayOnShelf () {
      Event.$emit('vue-tables.filter::toggle_display', this.activeSku.item_ids)
      this.displayMode = 'onshelf'
    },
    deselectAll () {
      this.$set(this.activeSku, 'item_ids', [])
    }
  },
  mounted () {}
}
</script>

<style lang="scss">
.VueTables__table tr td:first-child {
  width: 62px;
}
</style>
