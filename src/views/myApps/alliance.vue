<template>
  <div v-loading.fullscreen="listLoading" element-loading-background="rgba(0, 0, 0, 0.8)" class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.searchType" placeholder="搜索类型" style="width: 110px">
        <el-option v-for="item in searchOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-input v-model="listQuery.keyword" clearable placeholder="关键字" style="width: 120px;" @keyup.enter.native="handleFilter" />
      <el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves type="primary" @click="resetFilter">
        清空搜索
      </el-button>
      <el-button v-waves style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>

      <el-button v-waves type="primary" icon="el-icon-setting" @click="settingMinScoreVisible = true">
        设置分数线
      </el-button>
      当前分数线： {{ minScore }} 万

      <!-- <el-upload
        class="upload-img"
        action=""
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        multiple
        :limit="3"
        :on-exceed="handleExceed"
        :file-list="fileList">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload> -->
    </div>

    <table v-if="list" class="custom--table">
      <thead>
        <tr>
          <th v-for="(item, key) in thTitle" :key="key+item">
            <div v-if="item === 'name'">联盟成员</div>
            <div v-else-if="item === 'diffScore'">今日增加分数</div>
            <div v-else>{{ item }}</div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, key) in renderList" :key="key+item">
          <td v-for="(value) in item" :key="value" :data-all="JSON.stringify(item)">
            <div :class="{ 'font-danger': key === 'diffScore' && value < minScore * 10000 }"> {{ key === 'diffScore' ? numberToChinese(value) : value }} </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="!thTitle.length" class="empty">
      暂无数据
    </div>

    <el-dialog v-el-drag-dialog title="新增用户" :close-on-click-modal="false" :visible.sync="additionVisible" width="500px">
      <el-form ref="addForm" :rules="rules" :model="userScoreData" label-position="left" label-width="70px" style="width: 100%; padding: 0 20px; ">
        <el-form-item label="名称">
          <el-input v-model="userScoreData.name" />
        </el-form-item>
        <el-form-item label="今天分数">
          <el-input v-model.number="userScoreData.score" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="additionVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createData">
          保存
        </el-button>
      </div>
    </el-dialog>
    <el-dialog v-el-drag-dialog title="设置分数线" :close-on-click-modal="false" :visible.sync="settingMinScoreVisible" width="500px">
      <el-form ref="addForm" label-position="left" label-width="70px" style="width: 100%; padding: 0 20px; ">
        <el-form-item label="分数线">
          <el-input v-model.number="minScore" placeholder="请输入分数线">
            <template slot="append">万</template>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="settingMinScoreVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="saveMinScore">
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAllData, singleUpdate } from '@/api/alliance'
import waves from '@/directive/waves'
import elDragDialog from '@/directive/el-drag-dialog'
import { parseTime, debounce, numberToChinese } from '@/utils'
// import { getLabelHtml, getLevelHtml, getAttrHtml } from '@/utils/myapp'
// import Pagination from '@/components/Pagination'
// import { mapState } from 'vuex'

export default {
  name: 'Alliance',
  // components: { Pagination },
  directives: { waves, elDragDialog },
  data() {
    return {
      searchOptions: [{ label: '名称', key: 'name' }, { label: '日期', key: 'date' }],
      tableKey: 0,
      list: null,
      total: 0,
      today: '',
      yesterday: '',
      listLoading: true,
      additionVisible: false,
      settingMinScoreVisible: false,
      minScore: 0,
      thTitle: [],
      listQuery: {
        pageIndex: 1,
        pageSize: 20,
        dateBegin: '',
        dateEnd: '',
        searchType: 'name',
        keyword: ''
      },
      userScoreData: {
        name: '',
        score: 0
      },
      rules: {
        name: [{ required: true, message: '名称是必填的', trigger: 'blur' }]
      },
      fileList: [{ name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }, { name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }]
    }
  },
  computed: {
    renderList() {
      for (const item of this.list) {
        item.diffScore = item[this.today] - item[this.yesterday]
      }
      return this.list
    }
  },
  created() {
    this.getList()
    this.today = parseTime(new Date(), '{y}-{m}-{d}')
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
    const yesterday = new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 1)
    this.yesterday = parseTime(yesterday, '{y}-{m}-{d}')
    this.listQuery.dateBegin = parseTime(start, '{y}-{m}-{d}')
    this.listQuery.dateEnd = parseTime(end, '{y}-{m}-{d}')
    console.log(this.today, this.yesterday)
    console.log(this.listQuery.dateBegin, this.listQuery.dateEnd)
    if (localStorage.minScore) {
      this.minScore = localStorage.minScore
    }
  },
  mounted() {
    setTimeout(() => {
      console.log('list', this.renderList)
    }, 2000)
  },
  methods: {
    numberToChinese,
    getList() {
      this.listLoading = true
      getAllData(this.listQuery).then(response => {
        this.thTitle = []
        for (const th in response.data.dataList[0]) {
          this.thTitle.push(th)
        }
        this.thTitle.push('diffScore')
        this.list = response.data.dataList
        this.total = response.data.dataMeta.totalCount
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
    resetFilter() {
      return debounce(() => {
        this.listQuery = {
          pageIndex: 1,
          pageSize: 20,
          searchType: 'name',
          dateBegin: this.listQuery.dateBegin,
          dateEnd: this.listQuery.dateEnd,
          keyword: ''
        }
        this.handleFilter()
      }, 300)()
    },
    resetTemp() {
      this.userScoreData = {
        name: '',
        score: 0
      }
    },
    handleCreate() {
      return debounce(() => {
        this.resetTemp()
        this.additionVisible = true
        this.$nextTick(() => {
          this.$refs['addForm'].clearValidate()
        })
      }, 300)()
    },
    createData() {
      this.userScoreData.date = this.today
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          singleUpdate(this.userScoreData).then((res) => {
            this.listQuery.pageIndex = 1
            this.getList()
            this.additionVisible = false
            this.$notify({
              title: '成功',
              message: '添加成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    saveMinScore() {
      localStorage.minScore = this.minScore
      this.$message.success('设置成功！')
      this.settingMinScoreVisible = false
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    }
  }
}
</script>

<style>
.empty {
  padding: 50px 0;
  text-align: center;
}
.upload-img {
  width: 300px;
  float: right;
}
</style>
