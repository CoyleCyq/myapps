<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      style="padding-bottom: 30px"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="40"
      />
      <el-table-column
        type="index"
        width="50"
      />
      <el-table-column label="国家简码" align="center">
        <template slot-scope="scope">
          {{ scope.row.code }}
        </template>
      </el-table-column>
      <el-table-column label="国家名称(英文)">
        <template slot-scope="scope">
          {{ scope.row.en }}
        </template>
      </el-table-column>
      <el-table-column label="国家名称(英文)" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cn }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹框 -->
    <el-dialog
      :visible.sync="exportVisible"
      title="导出"
    >
      <el-input
        v-model="exportStr"
        type="textarea"
        autosize
        placeholder="请输入内容"
      />
    </el-dialog>
  </div>
</template>

<script>
import { getAllCountry } from '@/api/country'
import { exportListData, cloneDeep } from '@/utils'
import waves from '@/directive/waves' // wave 指令

export default {
  directives: { waves },
  data() {
    return {
      // 搜索数据
      query: {
        keyword: '',
        searchType: 'code' // 下拉按钮组默认展示的选项
      },
      // 搜索数据（默认）
      initQuery: {
        keyword: '',
        searchType: 'code' // 下拉按钮组默认展示的选项
      },
      checkData: [], // 选中数据
      exportVisible: false, // 导出弹框
      exportData: [], // 导出数据
      pageIndex: 1, // 当前页数
      pageSize: 20, // 一页的总数据
      conditions: [], // 调用接口时传递的参数数组
      list: null, // 列表数据
      listLoading: true, // 加载动画
      total: 0 // 数据总个数
    }
  },
  computed: {
    // 配置筛选菜单
    defaultQuery: {
      get() {
        return [
          {
            type: 'group',
            text: 'text',
            value: 'value',
            selectModel: 'searchType',
            selectLabel: '搜索类型',
            inputModel: 'keyword',
            inputLabel: '请输入关键字',
            options: [
              {
                value: 'code',
                text: '国家简码'
              },
              {
                value: 'countryEn',
                text: '国家名称(英文)'
              },
              {
                value: 'countryCn',
                text: '国家名称(中文)'
              }
            ]
          }
        ]
      }
    },
    // 配置操作按钮
    operations: {
      get() {
        return [
          {
            name: '同步',
            action: 'sync',
            type: '',
            float: 'fl'
          },
          {
            name: '导出',
            action: 'exportCode',
            type: '',
            float: 'fr'
          }
        ]
      }
    },
    exportStr: {
      get() {
        return this.exportData.join(',')
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 获取列表数据
    fetchData() {
      this.listLoading = true
      getAllCountry(this.pageIndex, this.pageSize, this.conditions).then(response => {
        this.list = response.data.dataList
        this.total = response.data.dataMeta.totalCount
        this.listLoading = false
      }).catch(error => {
        this.listLoading = false
        console.log(error)
      })
    },
    // 生成搜索条件
    buildConditionsData() {
      this.conditions = []
      Object.keys(this.query).forEach((key) => {
        if (key === 'keyword') {
          this.conditions.push({
            name: 'keyword',
            value: this.query[key]
          })
        } else if (key === 'time') {
          if (this.query[key] && this.query[key].length === 2) {
            this.conditions.push({
              name: 'datetimeType',
              value: this.query['datetimeType']
            })
          }
        } else if (key === 'dateBegin' || key === 'dateEnd') {
          this.conditions.push({
            name: key,
            value: this.query[key]
          })
        } else {
          this.conditions.push({
            name: key,
            value: this.query[key]
          })
        }
      })
    },
    // 搜索
    search() {
      this.pageIndex = 1
      this.update()
    },
    // 更新数据
    update() {
      this.buildConditionsData()
      this.fetchData()
    },
    // 清除单项
    cleanSearchItem(model) {
      this.query[model] = cloneDeep(this.initQuery[model])
    },
    // 清除全部
    cleanSearchAll() {
      this.query = cloneDeep(this.initQuery)
      this.conditions = []
    },
    // 分页数更改
    sizeChange(size) {
      this.pageSize = size
      this.pageIndex = 1
      this.update()
    },
    // 页码更新触发
    currentChange(current) {
      this.pageIndex = current
      this.update()
    },
    // 同步
    sync() {
      console.log(777)
    },
    // 表格多选修改
    handleSelectionChange(val) {
      this.checkData = val
    },
    // 导出国家简码
    exportCode() {
      if (this.checkData.length > 0) {
        this.exportData = exportListData(this.checkData, 'code')
        this.exportVisible = true
      } else {
        this.$message({
          message: '至少选择一条数据',
          type: 'error',
          duration: 5 * 1000
        })
      }
    }
  }
}
</script>
