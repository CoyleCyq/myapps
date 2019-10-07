<template>
  <div v-loading.fullscreen="listLoading" element-loading-background="rgba(0, 0, 0, 0.8)" class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.searchType" placeholder="搜索类型" style="width: 110px">
        <el-option v-for="item in searchOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-input v-model="listQuery.keyword" clearable placeholder="关键字" style="width: 120px;" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.level" placeholder="品质" clearable style="width: 90px">
        <el-option v-for="level in levelOptions" :key="level.label" :label="level.label" :value="level.value" />
      </el-select>
      <el-select v-model="listQuery.mainAttr" placeholder="主属性" clearable style="width: 90px">
        <el-option v-for="attr in attrOptions" :key="attr.label" :label="attr.label" :value="attr.value" />
      </el-select>
      <el-select v-model="listQuery.type" filterable placeholder="部位" clearable style="width: 90px">
        <el-option v-for="item in typeOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves type="primary" @click="resetFilter">
        清空搜索
      </el-button>
      <el-button v-if="isAdmin" v-waves style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
      <el-button v-waves :loading="downloadLoading" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
      <el-button v-if="isAdmin" v-waves type="primary" icon="el-icon-setting" @click="calcToolsVisible = true">
        计算初始
      </el-button>
      <el-button v-waves type="primary" icon="el-icon-setting" @click="additionVisible = true">
        设置加成
      </el-button>
      <div class="margin-top-10">
        <el-checkbox v-model="showDescription" @change="tableKey=tableKey+1">
          描述
        </el-checkbox>
        <el-checkbox v-model="showLabel" @change="tableKey=tableKey+1">
          标签
        </el-checkbox>
        <el-checkbox v-model="showSource" @change="tableKey=tableKey+1">
          来源
        </el-checkbox>
        <el-checkbox v-model="showImg">
          显示图片
        </el-checkbox>
        <el-checkbox v-model="showAddition">
          显示加成数值
        </el-checkbox>
      </div>
    </div>

    <el-table
      :key="tableKey"
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
      <el-table-column v-if="showImg" label="图片" width="130px" align="center">
        <template slot-scope="scope">
          <img v-show="scope.row.imgurl" :src="scope.row.imgurl" style="width: 100px; height: 100px">
        </template>
      </el-table-column>
      <el-table-column v-if="showDescription" label="描述" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="品质" width="70px" align="center">
        <template slot-scope="scope">
          <div v-html="getLevelHtml(scope.row.level)" />
        </template>
      </el-table-column>
      <el-table-column label="主属性" width="70px" align="center">
        <template slot-scope="scope">
          <div v-html="getAttrHtml(scope.row.mainAttr)" />
          <div>{{ scope.row.mainAttrValue }}</div>
        </template>
      </el-table-column>
      <el-table-column label="部位" width="70px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设计师" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="套装名称" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.suit.name || '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="典雅" width="60px" align="center">
        <template slot-scope="scope">
          <span>{{ additionValue(scope.row.type, scope.row.elegantValue) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="清新" width="60px" align="center">
        <template slot-scope="scope">
          <span>{{ additionValue(scope.row.type, scope.row.freshValue) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="甜美" width="60px" align="center">
        <template slot-scope="scope">
          <span>{{ additionValue(scope.row.type, scope.row.sweetValue) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性感" width="60px" align="center">
        <template slot-scope="scope">
          <span>{{ additionValue(scope.row.type, scope.row.sexyValue) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="帅气" width="60px" align="center">
        <template slot-scope="scope">
          <span>{{ additionValue(scope.row.type, scope.row.handsomeValue) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showLabel" label="标签" align="center" width="120px">
        <template slot-scope="scope">
          <div v-if="scope.row.label">
            <div v-html="getLabelHtml(scope.row.label)" />
            <div v-if="scope.row.labelValue">
              <label v-for="(val, key) in scope.row.labelValue.toString().split(/[,，]/)" :key="val+key" class="label text-label">{{ additionValue(scope.row.type, val) }}</label>
            </div>
          </div>
          <div v-else>--</div>
        </template>
      </el-table-column>
      <el-table-column v-if="showSource" label="来源" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.source }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="isAdmin" type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="primary" size="mini" @click="handleClipboard(row.id, $event)">
            复制Id
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :page-sizes="[10, 20, 30, 50, 100]" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog v-el-drag-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" :visible.sync="dialogFormVisible" width="1000px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" size="mini" label-width="70px" style="width: 100%; padding: 0 20px; ">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="名称" prop="name">
              <el-input v-model="temp.name" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属套装" prop="suitName">
              <el-select v-model="temp.suit" filterable value-key="id" class="filter-item" placeholder="请选择套装" @change="changeSuit">
                <el-option v-for="suit in suitOptions" :key="suit.id" :label="suit.name" :value="suit" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="设计师" prop="author">
              <el-input v-model="temp.author" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="品阶" prop="level">
              <el-select v-model="temp.level" class="filter-item" placeholder="请选择品阶" @change="changeLevel">
                <el-option v-for="level in levelOptions" :key="level.label" :label="level.label" :value="level.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="主属性" prop="mainAttr">
              <el-select v-model="temp.mainAttr" class="filter-item" placeholder="请选择属性">
                <el-option v-for="attr in attrOptions" :key="attr.label" :label="attr.label" :value="attr.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="部位" prop="type">
              <el-select v-model="temp.type" filterable class="filter-item" placeholder="请选择部位">
                <el-option v-for="type in typeOptions" :key="type" :label="type" :value="type" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">
            <el-form-item label="典雅">
              <el-input v-model.number="temp.elegantValue" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="清新">
              <el-input v-model.number="temp.freshValue" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="甜美">
              <el-input v-model.number="temp.sweetValue" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="性感">
              <el-input v-model.number="temp.sexyValue" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="帅气">
              <el-input v-model.number="temp.handsomeValue" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="价格类型">
              <el-select v-model="temp.priceType" filterable class="filter-item" placeholder="请选择类型">
                <el-option v-for="type in priceTypeOptions" :key="type" :label="type" :value="type" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="价格">
              <el-input v-model.number="temp.price" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="品牌">
              <el-input v-model="temp.brand" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="拥有数">
              <el-input v-model.number="temp.amount" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="来源">
              <el-input v-model="temp.source" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="标签">
              <el-input v-model="temp.label" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="标签值">
              <el-input v-model="temp.labelValue" @keyup.native="temp.labelValue = completeValue(temp.labelValue, $event)" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="图片路径">
          <el-input v-model="temp.imgurl" />
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

    <el-dialog v-el-drag-dialog title="服装初始计算工具" :close-on-click-modal="false" :visible.sync="calcToolsVisible" width="1000px">
      <el-form ref="calcform" :model="calcForm" label-position="left" size="mini" label-width="70px" style="width: 100%; padding: 0 20px; ">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="部位" prop="type">
              <el-select v-model="calcForm.type" filterable class="filter-item" placeholder="请选择部位">
                <el-option v-for="type in typeOptions" :key="type" :label="type" :value="type" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标签值">
              <el-input v-model.number="calcForm.labelValue" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">
            <el-form-item label="典雅">
              <el-input v-model.number="calcForm.elegantValue" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="清新">
              <el-input v-model.number="calcForm.freshValue" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="甜美">
              <el-input v-model.number="calcForm.sweetValue" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="性感">
              <el-input v-model.number="calcForm.sexyValue" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="帅气">
              <el-input v-model.number="calcForm.handsomeValue" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="时装">
              <el-input v-model="calcForm.fashion" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="发型">
              <el-input v-model="calcForm.hairstyle" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="袜子">
              <el-input v-model="calcForm.sock" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="鞋子">
              <el-input v-model="calcForm.shoes" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="饰品">
              <el-input v-model="calcForm.accessories" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="外套">
              <el-input v-model="calcForm.coat" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="全属性">
              <el-input v-model="calcForm.all" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <div ref="resultContainer" class="resultContainer" v-text="text" />
          </el-col>
          <el-col v-if="text" :span="4">
            <el-button type="primary" @click="isCopy = true">复制</el-button>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="calcToolsVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="calcPower">
          计算
        </el-button>
      </div>
    </el-dialog>

    <el-dialog v-el-drag-dialog title="设置加成" :close-on-click-modal="false" :visible.sync="additionVisible" width="1000px">
      <el-form ref="calcform" :model="calcForm" label-position="left" size="mini" label-width="70px" style="width: 100%; padding: 0 20px; ">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="时装">
              <el-input v-model="calcForm.fashion" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="发型">
              <el-input v-model="calcForm.hairstyle" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="袜子">
              <el-input v-model="calcForm.sock" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="鞋子">
              <el-input v-model="calcForm.shoes" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="饰品">
              <el-input v-model="calcForm.accessories" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="外套">
              <el-input v-model="calcForm.coat" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="全属性">
              <el-input v-model="calcForm.all" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="additionVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="saveAddition">
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchClothes, addClothes, updateClothes } from '@/api/clothes'
import { fetchAllSuit } from '@/api/suit'
import waves from '@/directive/waves'
import elDragDialog from '@/directive/el-drag-dialog'
import { parseTime, debounce } from '@/utils'
import { getLabelHtml, getLevelHtml, getAttrHtml } from '@/utils/myapp'
import clipboard from '@/utils/clipboard'
import Pagination from '@/components/Pagination'
import { mapState } from 'vuex'

export default {
  name: 'Clothes',
  components: { Pagination },
  directives: { waves, elDragDialog },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageIndex: 1,
        pageSize: 100,
        searchType: 'name',
        keyword: '',
        level: undefined,
        mainAttr: undefined,
        type: undefined
      },
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      calcToolsVisible: false,
      showDescription: false,
      showLabel: true,
      showSource: false,
      showAddition: false,
      showImg: false,
      additionVisible: false,
      dialogFormVisible: false,
      downloadLoading: false,
      rules: {
        name: [{ required: true, message: '名称是必选的', trigger: 'blur' }],
        level: [{ required: true, message: '品阶是必选的', trigger: 'change' }],
        type: [{ required: true, message: '部位是必选的', trigger: 'change' }],
        mainAttr: [{ required: true, message: '主属性是必选的', trigger: 'change' }]
      },
      searchOptions: [{ label: '名称', key: 'name' }, { label: '标签', key: 'label' }, { label: '套装名称', key: 'suitName' }, { label: '来源', key: 'source' }, { label: '描述', key: 'description' }, { label: '设计师', key: 'author' }, { label: '价格类型', key: 'priceType' }, { label: '品牌', key: 'brand' }],
      suitOptions: [],
      priceTypeOptions: ['活动券', '免费', '幻之券', '谜之券', '礼赞之花', '金币', '钻石', '联盟币'],
      temp: { // 新增数据
        id: undefined,
        name: '',
        level: '',
        type: '',
        suit: {
          id: '',
          name: null
        },
        author: '',
        imgurl: '',
        mainAttr: '',
        source: '幻之海，幻之海·流光',
        brand: '',
        amount: 0,
        elegantValue: 0,
        freshValue: 0,
        sweetValue: 0,
        sexyValue: 0,
        handsomeValue: 0,
        price: 0,
        priceType: '幻之券',
        label: '',
        labelValue: '',
        description: ''
      },
      calcForm: {
        elegantValue: 0,
        freshValue: 0,
        sweetValue: 0,
        sexyValue: 0,
        handsomeValue: 0,
        labelValue: 0,
        type: '',
        fashion: '0', // 时装穿搭法则
        hairstyle: '0', // 发型
        sock: '0', // 袜子
        shoes: '0', // 鞋子
        accessories: '0', // 饰品
        coat: '0', // 外套
        all: '0' // 所有
      },
      text: '', // 初始计算结果文字
      rawObj: { // 初始计算结果
        rawElegantValue: 0,
        rawFreshValue: 0,
        rawSweetValue: 0,
        rawSexyValue: 0,
        rawHandsomeValue: 0,
        rawLabelValue: 0
      },
      isCopy: false // 是否复制
    }
  },
  computed: {
    ...mapState({
      levelOptions: state => state.app.levelOptions,
      attrOptions: state => state.app.attrOptions,
      typeOptions: state => state.app.typeOptions
    }),
    isAdmin: {
      get() {
        return this.$store.state.settings.isAdmin
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'isAdmin',
          value: val
        })
      }
    }
  },
  created() {
    this.getList()
  },
  async mounted() {
    this.suitOptions = (await fetchAllSuit()).data.dataList
    if (localStorage.calcForm) {
      const calcForm = JSON.parse(localStorage.calcForm)
      this.calcForm.fashion = calcForm.fashion
      this.calcForm.hairstyle = calcForm.hairstyle
      this.calcForm.sock = calcForm.sock
      this.calcForm.shoes = calcForm.shoes
      this.calcForm.coat = calcForm.coat
      this.calcForm.accessories = calcForm.accessories
      this.calcForm.all = calcForm.all
    }
    console.log('isadmin', this.isAdmin)
  },
  methods: {
    getLevelHtml,
    getLabelHtml,
    getAttrHtml,
    getList() {
      this.listLoading = true
      fetchClothes(this.listQuery).then(response => {
        this.list = response.data.dataList
        this.total = response.data.dataMeta.totalCount
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 1000)
      })
    },
    resetFilter() {
      return debounce(() => {
        this.listQuery = {
          pageIndex: 1,
          pageSize: 100,
          searchType: 'name',
          keyword: '',
          level: undefined,
          mainAttr: undefined,
          type: undefined
        }
        this.handleFilter()
      }, 300)()
    },
    changeSuit(suit) {
      this.temp.level = suit.level
      this.temp.mainAttr = suit.mainAttr
      this.temp.label = suit.label
      this.temp.author = suit.author
      this.temp.source = suit.source
    },
    changeLevel(level) {
      if (level === '1' && this.temp.labelValue) {
        const arr = this.temp.labelValue.split(/[,，]/g)
        this.temp.labelValue = arr[0]
      }
    },
    handleClipboard(text, event) {
      clipboard(text, event)
    },
    // changeName() {
    //   if (this.temp.name.indexOf('袜') > -1) {
    //     this.temp.type = '袜子'
    //   } else if (this.temp.name.indexOf('靴') > -1 || this.temp.name.indexOf('鞋') > -1 || this.temp.name.indexOf('履') > -1 || this.temp.name.indexOf('屐') > -1) {
    //     this.temp.type = '鞋子'
    //   } else if (this.temp.name.indexOf('裤') > -1) {
    //     this.temp.type = '下装'
    //   } else if (this.temp.name.indexOf('背心') > -1 || this.temp.name.indexOf('袖') > -1 || this.temp.name.indexOf('衫') > -1 || this.temp.name.indexOf('吊带') > -1) {
    //     this.temp.type = '上衣'
    //   } else if (this.temp.name.indexOf('西装') > -1) {
    //     this.temp.type = '外套'
    //   } else if (this.temp.name.indexOf('裙') > -1) {
    //     this.temp.type = '连衣裙'
    //   } else if (this.temp.name.indexOf('发') > -1) {
    //     this.temp.type = '发型'
    //   } else if (this.temp.name.indexOf('耳') > -1) {
    //     this.temp.type = '耳饰'
    //   } else if (this.temp.name.indexOf('帽') > -1) {
    //     this.temp.type = '头饰'
    //   } else if (this.temp.name.indexOf('项链') > -1) {
    //     this.temp.type = '颈饰'
    //   }
    // },
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
        type: '',
        suit: {
          id: '',
          name: null
        },
        author: '',
        imgurl: '',
        mainAttr: '',
        source: '幻之海，流光', //
        brand: '',
        amount: 0,
        elegantValue: 0,
        freshValue: 0,
        sweetValue: 0,
        sexyValue: 0,
        handsomeValue: 0,
        price: 0,
        priceType: '幻之券', //
        label: '',
        labelValue: '',
        description: ''
      }
    },
    handleCreate() {
      return debounce(() => {
        this.resetTemp()
        this.dialogStatus = 'create'
        if (this.isCopy) {
          this.temp.elegantValue = this.rawObj.rawElegantValue
          this.temp.freshValue = this.rawObj.rawFreshValue
          this.temp.sweetValue = this.rawObj.rawSweetValue
          this.temp.sexyValue = this.rawObj.rawSexyValue
          this.temp.handsomeValue = this.rawObj.rawHandsomeValue

          const mainValue = Math.max(this.rawObj.rawElegantValue, this.rawObj.rawFreshValue, this.rawObj.rawSweetValue, this.rawObj.rawSexyValue, this.rawObj.rawHandsomeValue)
          for (const objItem in this.rawObj) {
            if (this.rawObj[objItem] === mainValue) {
              if (objItem === 'rawElegantValue') {
                this.temp.mainAttr = '1'
              } else if (objItem === 'rawFreshValue') {
                this.temp.mainAttr = '2'
              } else if (objItem === 'rawSweetValue') {
                this.temp.mainAttr = '3'
              } else if (objItem === 'rawSexyValue') {
                this.temp.mainAttr = '4'
              } else if (objItem === 'rawHandsomeValue') {
                this.temp.mainAttr = '5'
              }
            }
          }
          this.temp.type = this.calcForm.type
          this.temp.labelValue = `${this.rawObj.rawLabelValue},${this.rawObj.rawLabelValue}`
        }
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      }, 300)()
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addClothes(this.temp).then((res) => {
            this.temp.id = res.data.id
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.isCopy = false
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
    handleUpdate(row) {
      console.log('更新前', row)
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
          console.log('更新后', tempData)
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
          const tHeader = ['名称', '品质', '主属性', '部位', '套装名称', '典雅', '清新', '甜美', '性感', '帅气']
          const filterVal = ['name', 'level', 'mainAttr', 'type', 'suitName', 'elegantValue', 'freshValue', 'sweetValue', 'sexyValue', 'handsomeValue']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'table-list'
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
    },
    calcPower() {
      if (this.calcForm.type) {
        this.rawObj = {
          rawElegantValue: 0,
          rawFreshValue: 0,
          rawSweetValue: 0,
          rawSexyValue: 0,
          rawHandsomeValue: 0,
          rawLabelValue: 0
        }
        let calcNumber = 0
        if (this.calcForm.type === '发型') {
          calcNumber = Number(this.calcForm.hairstyle) + Number(this.calcForm.all)
        }
        if (['连衣裙', '上衣', '下装'].indexOf(this.calcForm.type) > -1) {
          calcNumber = Number(this.calcForm.fashion) + Number(this.calcForm.all)
        }
        if (this.calcForm.type === '袜子') {
          calcNumber = Number(this.calcForm.sock) + Number(this.calcForm.all)
        }
        if (this.calcForm.type === '鞋子') {
          calcNumber = Number(this.calcForm.shoes) + Number(this.calcForm.all)
        }
        if (['头饰', '耳饰', '颈饰', '手套', '手饰', '手持物', '特殊'].indexOf(this.calcForm.type) > -1) {
          calcNumber = Number(this.calcForm.accessories) + Number(this.calcForm.all)
        }
        if (this.calcForm.type === '外套') {
          calcNumber = Number(this.calcForm.coat) + Number(this.calcForm.all)
        }
        this.rawObj.rawElegantValue = Math.ceil(this.calcForm.elegantValue / (1 + calcNumber / 100))
        this.rawObj.rawFreshValue = Math.ceil(this.calcForm.freshValue / (1 + calcNumber / 100))
        this.rawObj.rawSweetValue = Math.ceil(this.calcForm.sweetValue / (1 + calcNumber / 100))
        this.rawObj.rawSexyValue = Math.ceil(this.calcForm.sexyValue / (1 + calcNumber / 100))
        this.rawObj.rawHandsomeValue = Math.ceil(this.calcForm.handsomeValue / (1 + calcNumber / 100))
        this.rawObj.rawLabelValue = Math.ceil(this.calcForm.labelValue / (1 + calcNumber / 100))
        this.text = `原始典雅值：${this.rawObj.rawElegantValue},  原始清新值：${this.rawObj.rawFreshValue}， 原始甜美值：${this.rawObj.rawSweetValue},  原始性感值：${this.rawObj.rawSexyValue},  原始帅气值：${this.rawObj.rawHandsomeValue},  原始标签值：${this.rawObj.rawLabelValue}`
        localStorage.calcForm = JSON.stringify(this.calcForm)
      }
    },
    additionValue(type, value) {
      if (this.showAddition) {
        let calcNumber = 0
        let resValue = 0
        if (type === '发型') {
          calcNumber = Number(this.calcForm.hairstyle) + Number(this.calcForm.all)
        }
        if (['连衣裙', '上衣', '下装'].indexOf(type) > -1) {
          calcNumber = Number(this.calcForm.fashion) + Number(this.calcForm.all)
        }
        if (type === '袜子') {
          calcNumber = Number(this.calcForm.sock) + Number(this.calcForm.all)
        }
        if (type === '鞋子') {
          calcNumber = Number(this.calcForm.shoes) + Number(this.calcForm.all)
        }
        if (['头饰', '耳饰', '颈饰', '手套', '手饰', '手持物', '特殊'].indexOf(type) > -1) {
          calcNumber = Number(this.calcForm.accessories) + Number(this.calcForm.all)
        }
        if (type === '外套') {
          calcNumber = Number(this.calcForm.coat) + Number(this.calcForm.all)
        }
        resValue = Math.floor(value * (1 + calcNumber / 100))
        return resValue
      } else {
        return value
      }
    },
    saveAddition() {
      localStorage.calcForm = JSON.stringify(this.calcForm)
      this.additionVisible = false
    },
    completeValue(labelValue, e) {
      if (e.keyCode === 188) {
        return `${parseInt(labelValue)}, ${parseInt(labelValue)}`
      }
      return labelValue
    }
  }
}
</script>
