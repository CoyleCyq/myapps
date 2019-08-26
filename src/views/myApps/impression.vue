<template>
  <div v-loading.fullscreen="listLoading" element-loading-background="rgba(0, 0, 0, 0.8)" class="app-container">
    <!-- 过滤区域 -->
    <div class="filter-container">
      <el-select v-model="listQuery.searchType" placeholder="搜索类型" style="width: 110px">
        <el-option v-for="item in searchOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-input v-model="listQuery.keyword" clearable placeholder="关键字" style="width: 120px;" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.level" placeholder="品质" clearable style="width: 90px">
        <el-option v-for="item in levelOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.mainAttr" placeholder="主属性" clearable style="width: 90px">
        <el-option v-for="item in attrOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
      <el-button v-waves :loading="downloadLoading" type="primary" icon="el-icon-download" @click="handleDownload">
        导出Excel
      </el-button>
    </div>

    <!-- 主表区域 -->
    <el-table
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="印象名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="品质" width="110px" align="center">
        <template slot-scope="scope">
          <div v-html="getLevelHtml(scope.row.level)" />
        </template>
      </el-table-column>
      <el-table-column label="主属性" width="70px" align="center">
        <template slot-scope="scope">
          <div v-html="getAttrHtml(scope.row.mainAttr)" />
        </template>
      </el-table-column>
      <el-table-column label="属性值" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.attrvalue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设计师" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="来源" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.source }}</span>
        </template>
      </el-table-column>
      <el-table-column label="核心技能" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.skill }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="共鸣效果" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.resonance }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <!-- 编辑/新建弹框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 90%; margin-left:50px;">
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="品阶" prop="level">
              <el-select v-model="temp.level" class="filter-item" placeholder="请选择品阶">
                <el-option v-for="level in levelOptions" :key="level" :label="level" :value="level" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主属性" prop="mainAttr">
              <el-select v-model="temp.mainAttr" class="filter-item" placeholder="请选择属性">
                <el-option v-for="attr in attrOptions" :key="attr" :label="attr" :value="attr" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="属性值">
              <el-input v-model.number="temp.attrvalue" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设计师">
              <el-input v-model="temp.author" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="图片路径">
              <el-input v-model="temp.imgurl" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来源">
              <el-input v-model="temp.source" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="核心技能">
          <el-input v-model="temp.skill" />
        </el-form-item>
        <el-form-item label="共鸣效果">
          <el-input v-model="temp.resonance" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="temp.description" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus ==='create' ? createData() : updateData()">
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchImpression, addImpression, updateImpression } from '@/api/impression'
import waves from '@/directive/waves'
import { parseTime, debounce } from '@/utils'
import { getLabelHtml, getLevelHtml, getAttrHtml } from '@/utils/myapp'
import Pagination from '@/components/Pagination'
import { mapState } from 'vuex'

export default {
  name: 'Impression',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageIndex: 1,
        pageSize: 20,
        searchType: 'name',
        keyword: '',
        level: undefined,
        mainAttr: undefined
      },
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogFormVisible: false,
      downloadLoading: false,
      searchOptions: [{ label: '名称', key: 'name' }, { label: '核心技能', key: 'skill' }, { label: '设计师', key: 'author' }],
      rules: {
        name: [{ required: true, message: '印象名称是必填的', trigger: 'blur' }],
        level: [{ required: true, message: '品阶是必选的', trigger: 'change' }],
        mainAttr: [{ required: true, message: '主属性是必选的', trigger: 'change' }]
      },
      temp: { // 新增数据
        id: undefined,
        name: '',
        level: '',
        mainAttr: '',
        attrvalue: 0,
        source: '印象合成',
        skill: '',
        description: '',
        resonance: '',
        imgurl: ''
      }
    }
  },
  computed: {
    ...mapState({
      levelOptions: state => state.app.levelOptions,
      attrOptions: state => state.app.attrOptions
    })
  },
  created() {
    this.getList()
  },
  methods: {
    getLabelHtml,
    getLevelHtml,
    getAttrHtml,
    getList() {
      this.listLoading = true
      fetchImpression(this.listQuery).then(response => {
        console.log('res', response)
        this.list = response.data.dataList
        this.total = response.data.dataMeta.totalCount
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 1000)
      })
    },
    handleFilter() {
      return debounce(() => {
        this.listQuery.pageIndex = 1
        this.getList()
      }, 300)()
    },
    // 重置新建弹框
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        level: '',
        mainAttr: '',
        attrvalue: 0,
        source: '印象合成',
        skill: '',
        description: '',
        resonance: '',
        imgurl: ''
      }
    },
    handleCreate() {
      return debounce(() => {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      }, 300)()
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addImpression(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      console.log('row', row)
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateImpression(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleDownload() {
      return debounce(() => {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['印象名称', '品质', '主属性', '属性值', '设计师', '来源', '核心技能', '共鸣效果', '描述']
          const filterVal = ['name', 'level', 'mainAttr', 'attrvalue', 'author', 'source', 'skill', 'resonance', 'description']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '印象'
          })
          this.downloadLoading = false
        })
      }, 300)()
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
