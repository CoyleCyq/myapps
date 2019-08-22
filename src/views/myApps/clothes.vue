<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.mainAttr" placeholder="主属性" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
      <el-checkbox v-model="showLevel" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        Level
      </el-checkbox>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="套装名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.suitName }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showLevel" label="品质" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.level }}</span>
        </template>
      </el-table-column>
      <el-table-column label="主属性" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.mainAttr }}</span>
        </template>
      </el-table-column>
      <el-table-column label="典雅" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.elegantValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性感" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.sexyValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="甜美" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.sweetValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="清新" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.freshValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="帅气" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.handsomeValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标签" align="center" width="95">
        <template slot-scope="scope">
          <span>{{ scope.row.label }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Edit
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="1000px">
      <el-form ref="dataForm" :inline="true" :rules="rules" :model="temp" label-position="left" size="mini" label-width="70px" style="width: 950px; margin-left:50px;">
        <el-row>
          <el-col :span="12">
            <el-form-item label="服装名称" prop="name">
              <el-input v-model="temp.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="品阶" prop="level">
              <el-select v-model="temp.level" class="filter-item" placeholder="请选择品阶">
                <el-option v-for="level in levelOptions" :key="level" :label="level" :value="level" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属套装" prop="suitName">
              <el-select v-model="temp.suitName" class="filter-item" placeholder="请选择套装">
                <el-option v-for="suit in suitOptions" :key="suit" :label="suit" :value="suit" />
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
        <el-row>
          <el-col :span="4">
            <el-form-item label="典雅">
              <el-input v-model="temp.elegantValue" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="甜美">
              <el-input v-model="temp.sweetValue" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="清新">
              <el-input v-model="temp.freshValue" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="性感">
              <el-input v-model="temp.sexyValue" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="帅气">
              <el-input v-model="temp.handsomeValue" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="来源">
              <el-input v-model="temp.source" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标签">
              <el-input v-model="temp.label" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="图片路径">
          <el-input v-model="temp.imgurl" />
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
import { fetchList, createClothes, updateClothes } from '@/api/clothes'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Clothes',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        level: undefined,
        name: undefined,
        mainAttr: undefined
      },
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogFormVisible: false,
      showLevel: false,
      downloadLoading: false,
      rules: {
        level: [{ required: true, message: '品阶是必选的', trigger: 'change' }],
        mainAttr: [{ required: true, message: '主属性是必选的', trigger: 'change' }]
      },
      levelOptions: ['普通', '稀有', '非凡', '闪耀'],
      suitOptions: ['无', '抖落繁星', '欲望之音', '璀璨之恋', '晨雾微风', '流光花蔓', '花影瑶'],
      attrOptions: ['无', '典雅', '清新', '甜美', '性感', '帅气'],
      temp: { // 新增数据
        id: undefined,
        name: '',
        level: '',
        suitId: undefined,
        suitName: '',
        imgurl: '',
        mainAttr: '',
        soure: '',
        elegantValue: '',
        sweetValue: '',
        freshValue: '',
        sexyValue: '',
        handsomeValue: '',
        price: '',
        priceType: '',
        label: '',
        labelValue: '',
        description: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 重置新建弹框
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        level: '',
        suitId: undefined,
        suitName: '',
        imgurl: '',
        mainAttr: '',
        soure: '',
        elegantValue: '',
        sweetValue: '',
        freshValue: '',
        sexyValue: '',
        handsomeValue: '',
        price: '',
        priceType: '',
        label: '',
        labelValue: '',
        description: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createClothes(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
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
          updateClothes(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['name', 'suitName', 'level', 'mainAttr', 'label']
        const filterVal = ['name', 'suitName', 'level', 'mainAttr', 'label']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}`
        ? 'ascending'
        : sort === `-${key}`
          ? 'descending'
          : ''
    }
  }
}
</script>
