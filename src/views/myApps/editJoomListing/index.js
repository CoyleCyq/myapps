import vuedraggable from 'vuedraggable'
import dialog from 'art-dialog'
import { trim } from '@/utils'
var $ = 'jquery'
export default {
  name: 'editJoomListing',
  components: {
    vuedraggable
  },
  data() {
    return {
      listingId: '',
      itemId: '', // itemId 导入Item图片需要
      platformType: 5, // 平台类型，导入Item图片需要
      skuIds: [], // skuId 的集合， 导入SKU图片需要
      accountList: [], // 所有Joom店铺集合, 产品信息中店铺下拉需要
      colorList: [], // 颜色列表
      dangerousKindList: [], // 敏感货集合
      skuIndex: '', // 导入sku图片用到的索引
      fullscreenLoading: false,
      size: 'small', // 按钮风格：默认small
      keyword: '', // 产品信息-关键字
      checked: false,
      oldValue: '', // 获取焦点的时候，保存的数据
      stepActive: 0, // 导入的步骤条
      needImportSkuStr: '', // 需要导入的SKU字符串
      tagInputVisible: false,
      tagInputValue: '',
      info: {
        saveType: 0, // 保存类型： 0：直接保存， 1：保存并刊登到线上，
        basicInfo: {
          title: '', // 标题
          thumbnail: '',
          status: 0, // 在线状态，0：未刊登，1：在线，2：结束，3：审核不通过，4：审核中
          keyWords: []
        },
        imageInfo: [],
        variationsInfo: []
      },
      rules: {
        accountId: [{
          required: true,
          message: '请选择店铺',
          trigger: 'change'
        }],
        description: [{
          required: true,
          message: '请输入产品描述',
          trigger: 'blur'
        }],
        dangerousKind: [{
          required: true,
          message: '请选择敏感货标签',
          trigger: 'change'
        }]
      },
      importSkuOrSpuVisible: false, // 导入SKU或SPU，选择变种图弹框
      importItemImageVisible: false, // 导入Item图片的dialog
      agShowImportSkuVisable: false, // 仅导入SKU/SPU的dialog
      chooseSkuImgVisible: false, // 选择SKU图片的dialog
      changeSkuImgVisible: false, // 导入sku时选择变种图片的dialog
      titleRepeatVisible: false, // 标题重复dialog
      showSize: false, // 是否显示变种的重量尺寸
      showHsCode: false, // 是否显示变种的报关信息
      showGTIN: false, // 是否显示变种的GTIN
      imgType: 'head', // 导入Item图片需要的类型，默认导入头图
      editInfo: {
        editType: null, // 批量编辑的类型
        batEditVisible: false, // 批量修改弹框
        batTitle: '', // 批量修改的标题
        tabName: 'replace',
        changeType: 'increase',
        unit: 'percent',
        value: '',
        length: '',
        width: '',
        height: '',
        hasUnit: true,
        enable: true
      },
      imgUploadData: { // 上传图片模板数据
        id: '',
        pathId: '',
        isUpload: true,
        imageName: '',
        extensionName: '',
        fileKey: ''
      },
      // 导入的SKU数据
      importSkuData: [], // 导入的数据
      allImgList: [], // 导入SKU时选择图片的数据
      imgId: '', // 导入图片时的图片Id
      multipleSelection: [] // 多选的数据
    }
  },
  computed: {
    categoryName() {
      if (Array.isArray(this.info.basicInfo.categoryNames) && this.info.basicInfo.categoryNames.length > 0) {
        return this.info.basicInfo.categoryNames.join(' > ')
      } else {
        return ''
      }
    },
    reviewStatus() {
      return {
        'approved': '<label class="label label-sm style-label-primary style-label-iconY"></label>通过审核',
        'pending': '<label class="label label-sm style-label-primary style-label-iconY"></label>审核中',
        'rejected': '<label class="label label-sm style-label-primary style-label-yellow style-label-iconN"></label>已拒绝'
      }[this.info.basicInfo.reviewStatus]
    }
  },
  async created() {
    const hashData = $.queryToObject($.hash())
    this.listingId = hashData.listingId
    if (!this.listingId) {
      this.$message.error('缺少必要参数，请输入完整的url')
      return
    }
    this.getJoomListingInfo()
    this.accountList = await this.getJoomAccountInfo()
    this.dangerousKindList = await this.getDangerousKind()
    this.colorList = await this.getJoomColors()
  },
  methods: {
    // 测试使用
    test() {
      console.log('>>>>>this.info<<<<', this.info)
    },

    // 强制保存两位小数
    toDecimal2(x) {
      const f = Math.round(x * 100) / 100
      let s = f.toString()
      let rs = s.indexOf('.')
      if (rs < 0) {
        rs = s.length
        s += '.'
      }
      while (s.length <= rs + 2) {
        s += '0'
      }
      return s
    },

    // 获取joomListing信息
    getJoomListingInfo() {
      this.fullscreenLoading = true
      $.ajax({
        url: '/JoomSalePlat/JoomGetListingInfo',
        data: {
          listingId: this.listingId
        },
        success: (result) => {
          this.fullscreenLoading = false
          if (result.status === 'success') {
            this.itemId = result.data.basicInfo.itemId
            this.info = this.parseListingData(result.data)
          } else {
            this.$message.error(result.msg)
          }
        }
      })
    },

    // 组装listing数据
    parseListingData(data) {
      if (data.imageInfo && data.imageInfo.length) {
        data.imageInfo.forEach((item) => {
          item.loading = true
        })
      }

      if (data.variationsInfo && data.variationsInfo.length) {
        data.variationsInfo.forEach((item) => {
          item.status = data.basicInfo.status
          item.oldProp = ''
        })
      }
      return data
    },

    // 获取Joom颜色信息
    getJoomColors() {
      return new Promise((resolve, reject) => {
        $.ajax({
          url: '/Products/GetJoomColors',
          success: (result) => {
            if (result.status === 'success') {
              resolve(result.data)
            } else {
              this.$message.error(result.msg)
              reject()
            }
          }
        })
      })
    },

    // 获取导入信息
    getImportSkuInfoList() {
      if (!this.needImportSkuStr) {
        this.$message.error('请输入SKU/SPU')
        this.$refs.needImportSkuInput.focus()
        return
      }
      this.fullscreenLoading = true
      return new Promise((resolve, reject) => {
        $.ajax({
          url: '/Products/JoomGetImportSkuInfoList',
          data: {
            codes: this.needImportSkuStr
          },
          success: (result) => {
            this.fullscreenLoading = false
            if (result.status === 'success') {
              if (!result.data.skuInfos.length) {
                this.$message.error('没有找到相关数据')
                return
              }
              resolve(result.data.skuInfos)
            } else {
              this.$message.error(result.msg)
              reject()
            }
          }
        })
      })
    },

    // 导入的步骤
    async stepNext() {
      // 第一步 导入SKU
      if (this.stepActive === 0) {
        const importSkuData = await this.getImportSkuInfoList()
        this.importSkuData = this.parseImportData(importSkuData)
        this.stepActive = 1
        return
      }
      // 第二步 确认变种图片
      if (this.stepActive === 1) {
        if (!this.importSkuData.length) {
          this.$message.error('请至少导入一个SKU')
          return
        }
        this.info.variationsInfo = this.info.variationsInfo.concat(this.importSkuData)
        this.importSkuOrSpuVisible = false
      }
    },

    // 组装导入数据
    parseImportData(data) {
      data = data.map((item) => {
        var arr = []
        var oldProp = ''
        if (item.specifics) {
          arr = Object.values(item.specifics)
          oldProp = arr.join('/')
        }
        var variatObj = {
          color: null,
          declaredValue: null,
          gtin: null,
          headImage: item.headImages ? item.headImages[0] : {
            smallImgUrl: ''
          },
          hsCode: null,
          inventory: 0,
          joomEnabled: true,
          joomVariantId: null,
          listingCosts: null,
          msrp: null,
          price: 0,
          oldProp: oldProp,
          allHeadImages: item.headImages,
          propertyValueList: [],
          shipping: 0,
          shippingHeight: item.shippingHeight,
          shippingLength: item.shippingLength,
          shippingWeight: item.shippingWeight,
          shippingWidth: item.shippingWidth,
          status: 0,
          size: null,
          isImport: true,
          variantCode: null,
          variationId: Math.random(100000),
          skuInfo: [{
            code: item.code,
            propertyValueList: [],
            saleStatus: 0,
            qty: 1,
            skuId: item.skuId
          }]
        }
        return variatObj
      })
      return data
    },

    // 单独导入SKU
    async agimportSku() {
      let importSkuData = await this.getImportSkuInfoList()
      importSkuData = this.parseImportData(importSkuData)
      this.importSkuData = this.importSkuData.concat(importSkuData)
      var mapObj = {}
      this.importSkuData = this.importSkuData.reduce((cur, next) => {
        mapObj[next.skuInfo[0].code] ? '' : mapObj[next.skuInfo[0].code] = true && cur.push(next)
        return cur
      }, [])

      this.agShowImportSkuVisable = false
    },

    // 修改导入的图片
    changeSkuImg(sku, index) {
      if (!sku.allHeadImages || sku.allHeadImages.length === 1) {
        this.$message.error('该SKU没有图片, 或者没有可更换的图片！')
        return
      }
      this.imgId = sku.headImage.id || ''
      this.skuIndex = index
      this.allImgList = sku.allHeadImages
      this.changeSkuImgVisible = true
    },

    // 确认导入的变种图片
    saveChangeImg() {
      var obj = {}
      this.allImgList.forEach((item) => {
        if (item.id === this.imgId) {
          obj = item
        }
      })
      var index = this.skuIndex
      this.importSkuData[index].headImage = obj
      this.changeSkuImgVisible = false
    },

    // 获取原属性
    getOldProp(spec) {
      var arr = []
      if (!spec) return ''
      if (spec) {
        arr = Object.values(spec)
        console.log('arr', arr)
      }
      return arr.join('/')
    },

    // 获取SKU信息
    getSkuData(sku, variation) {
      // console.log(sku, variation)
      var isFirst = false
      if (!sku.code || this.oldValue === sku.code) return
      if (sku.code.indexOf(',') > -1) {
        this.$message.error('没有找到相关数据')
        sku.code = ''
        return
      }
      if (sku.code === variation.skuInfo[0].code) {
        isFirst = true
      }
      $.ajax({
        url: '/Products/JoomGetImportSkuInfoList',
        data: {
          codes: sku.code
        },
        success: (result) => {
          if (result.status === 'success') {
            if (!result.data.skuInfos.length || result.data.skuInfos.length > 1) {
              this.$message.error('没有找到相关数据')
              sku.code = ''
              return
            }
            var data = result.data.skuInfos[0]

            // 图片信息
            if ((!variation.headImage || !variation.headImage.smallImgUrl) && data.headImages && data.headImages.length || isFirst) {
              variation.headImage = data.headImages[0]
            }
            variation.shippingHeight = data.shippingHeight
            variation.shippingLength = data.shippingLength
            variation.shippingWeight = data.shippingWeight
            variation.shippingWidth = data.shippingWidth

            if (variation.oldProp && !isFirst) {
              variation.oldProp = variation.oldProp + '、' + this.getOldProp(data.specifics)
            } else {
              var oldProp = this.getOldProp(data.specifics)
              variation.oldProp = oldProp
            }

            sku.skuId = data.skuId
            this.$nextTick(() => {
              variation.isImport = true
            })
          } else {
            this.$message.error(result.msg)
            sku.code = ''
          }
        }
      })
    },

    // 获取Joom 店铺
    getJoomAccountInfo() {
      return new Promise((resolve, reject) => {
        $.ajax({
          url: '/Report/GetPermissionAccountByPlatform',
          data: {
            platformType: 5
          },
          success: (result) => {
            if (result.status === 'success') {
              if (Array.isArray(result.data.dataList[0].nodes)) {
                resolve(result.data.dataList[0].nodes)
              } else {
                resolve([])
              }
            } else {
              this.$message.error(result.msg)
              reject()
            }
          }
        })
      })
    },

    // 获取敏感货标签
    getDangerousKind() {
      return new Promise((resolve, reject) => {
        $.ajax({
          url: '/JoomSalePlat/ListJoomDangerousKind',
          success: (result) => {
            if (result.status === 'success') {
              console.log('result', result)
              resolve(result.data)
            } else {
              this.$message.error(result.msg)
              reject()
            }
          }
        })
      })
    },

    // 查看平台警告
    viewPlatformWarning() {
      dialog({
        title: '警告/错误详情',
        content: `<div class="font-gray-text"><i class="el-icon-warning margin-right-5 font-16"></i>${this.info.basicInfo.platformWarring}</div>`,
        width: 400,
        height: 'auto',
        cancelValue: '关闭',
        cancel: true
      }).showModal()
    },

    // 获取图片尺寸的信息
    getImgNaturalDimensions(img, callback) {
      var nWidth, nHeight
      if (img.naturalWidth) { // 现代浏览器
        nWidth = img.naturalWidth
        nHeight = img.naturalHeight
      } else { // IE6/7/8
        var image = new Image()
        image.src = img.src
        image.onload = function() {
          callback(image.width, image.height)
        }
      }
      return [nWidth, nHeight]
    },

    // 图片加载
    loadingHandle(item, event) {
      item.loading = false
      if (event.type === 'error') {
        event.target.src = '/Content/images/empty_gallery.png'
        item.width = 0
        item.height = 0
      } else {
        var size = this.getImgNaturalDimensions(event.target)
        item.width = size[0]
        item.height = size[1]
      }
    },

    // 简单的删除
    singleDelete(list, index, type) {
      if (type === 'sku' && list.length === 1) {
        this.$message.error('只剩一个SKU时不允许继续删除！')
        return
      }
      if (type === 'variat') {
        var item = list[index]
        if (item.status === 0) {
          list.splice(index, 1)
        } else {
          this.$message.error('只允许删除未刊登的变种')
        }
        return
      }
      list.splice(index, 1)
    },

    // 显示新增的输入tag
    showTagInput() {
      this.tagInputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    // 删除标签
    handleCloseTag(tag) {
      this.info.basicInfo.keyWords.splice(this.info.basicInfo.keyWords.indexOf(tag), 1)
    },

    // 回车或逗号
    handleTagInputConfirm(status) {
      let tagInputValue = trim(this.tagInputValue)
      tagInputValue = tagInputValue.replace(/[,，]/g, '')
      console.log('tagInputValue', tagInputValue)
      if (this.info.basicInfo.keyWords.indexOf(tagInputValue) > -1) {
        if (tagInputValue) {
          this.$message.error('产品标签不能重复')
        }
      } else {
        if (tagInputValue) {
          this.info.basicInfo.keyWords.push(tagInputValue)
        }
      }
      this.tagInputValue = ''
      if (status === 'blur') {
        this.tagInputVisible = false
      }
    },

    // 获取图片文件扩展名
    getExtname(fileName) {
      if (!fileName) return ''
      var index = fileName.lastIndexOf('.') + 1
      if (index === 0) return false
      var extname = fileName.slice(fileName.lastIndexOf('.') + 1)
      if (extname !== 'jpg' && extname !== 'jpeg' && extname !== 'gif' && extname !== 'png') {
        return ''
      }
      return extname
    },

    // 获取预览图片路径
    getObjectURL(file) {
      var url = null
      if (window.createObjectURL !== undefined) { // basic
        url = window.createObjectURL(file)
      } else if (window.URL !== undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file)
      } else if (window.webkitURL !== undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file)
      }
      return url
    },

    // 图片上传之前的处理
    beforeUpload(file) {
      this.imgUploadData.extensionName = this.getExtname(file.name)
    },

    // 上传成功(图片信息)
    uploadSuccess(result, file, fileList, index) {
      var objUrl = this.getObjectURL(file.raw)
      result.data.bigImgUrl = objUrl
      result.data.smallImgUrl = objUrl
      result.data.extensionName = this.getExtname(file.name)
      if (typeof index === 'undefined') {
        this.info.imageInfo.push(result.data)
      } else {
        this.info.variationsInfo[index].headImage = result.data
      }
    },

    // 上传失败(所有图片上传)
    uploadError(err) {
      this.$message.error('上传失败, 原因：' + err)
    },

    // 拖拽
    datadragEnd() {
      console.log('datadragEnd')
    },

    // 开始
    startend() {
      console.log('startend')
    },

    // 全选操作
    handleSelectionChange(rows) {
      this.multipleSelection = rows
    },

    // 批量删除变种
    batRemoveVariat() {
      var checkedList = this.multipleSelection
      if (!checkedList.length) return
      dialog({
        title: '删除变种属性',
        width: 200,
        height: 30,
        content: '是否确认删除此变种属性？',
        okValue: '确认',
        cancelValue: '取消',
        cancel: true,
        ok: () => {
          if (this.info.variationsInfo.length) {
            for (var i = this.info.variationsInfo.length - 1; i >= 0; i--) {
              var variationId = this.info.variationsInfo[i].variationId
              checkedList.forEach((item) => {
                if (item.variationId === variationId) {
                  this.info.variationsInfo.splice(i, 1)
                }
              })
            }
          }
        }
      }).showModal()
    },

    // 导入Item图片
    importImg(checkedList) {
      const obj = {}
      if (!this.info.imageInfo) {
        this.info.imageInfo = []
      }
      this.info.imageInfo = this.info.imageInfo.concat(checkedList)
      this.info.imageInfo = this.info.imageInfo.reduce((cur, next) => {
        obj[next.id] ? '' : obj[next.id] = true && cur.push(next)
        return cur
      }, [])
      this.importItemImageVisible = false
    },

    // 属性的搜索建议
    querySearch(queryString, cb) {
      var restaurants = this.colorList
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      cb(results)
    },

    // 返回搜索建议
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.colorName.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },

    // 添加SKU
    addSKU(skuInfo) {
      const sku = {
        code: '',
        qty: 1,
        saleStatus: 0,
        propertyValueList: [],
        skuId: ''
      }
      skuInfo.push(sku)
    },

    // 添加变种
    addVariat(variatList) {
      if (this.info.basicInfo.status !== 0) {
        this.$message.error('状态为已刊登或已结束的Listing不允许添加变种')
        return
      }

      var variatObj = {
        color: null,
        declaredValue: null,
        gtin: null,
        headImage: {
          smallImgUrl: '',
          isUpload: true,
          id: ''
        },
        index: null,
        hsCode: null,
        inventory: 0,
        joomEnabled: true,
        joomVariantId: null,
        listingCosts: null,
        msrp: null,
        price: 0,
        oldProp: '',
        propertyValueList: [],
        shipping: 0,
        shippingHeight: 0,
        shippingLength: 0,
        shippingWeight: 0,
        shippingWidth: 0,
        status: 0,
        size: null,
        isImport: true,
        variantCode: null,
        variationId: Math.random(100000),
        skuInfo: [
          {
            code: '',
            propertyValueList: [],
            saleStatus: 0,
            qty: 1,
            skuId: ''
          }
        ]
      }
      variatList.push(variatObj)
    },

    // hover显示大图
    showBigImg(e, imgObj) {
      if (!imgObj) return
      var imgurl = imgObj.bigImgUrl ? imgObj.bigImgUrl : imgObj.smallImgUrl ? imgObj.smallImgUrl : false
      if (!imgurl) return
      dialog({
        width: 300,
        height: 300,
        content: `<div><img src="${imgurl}" width="300" height="300"/></div>`,
        align: 'left top',
        onshow: function() {},
        id: 'img'
      }).show(e.target)
    },

    // 从SKU图片中选一张图片
    chooseSkuImgBtn(item, index) {
      this.skuIds = []
      this.skuIndex = index
      item.skuInfo.length && item.skuInfo.forEach((sku) => {
        this.skuIds.push(sku.skuId)
      })
      if (!this.skuIds.length) {
        this.$message.error('没有SKU，请先添加SKU！')
        return
      }
      this.chooseSkuImgVisible = true
    },

    // 保存选中的SKU图片
    saveCheckedImg(checkImgObj) {
      var index = this.skuIndex
      this.info.variationsInfo[index].headImage = checkImgObj
      this.chooseSkuImgVisible = false
    },

    // 隐藏大图
    hideBigImg() {
      var imgDialog = dialog.get('img')
      if (imgDialog) {
        imgDialog.close().remove()
      }
    },

    // 清空批量编辑的信息
    clearBatEditInfo() {
      this.editInfo.replaceValue = ''
      this.editInfo.tabName = 'replace'
      this.editInfo.changeType = 'increase'
      this.editInfo.unit = 'percent'
      this.editInfo.value = ''
      this.editInfo.length = ''
      this.editInfo.width = ''
      this.editInfo.height = ''
      this.editInfo.enable = true
    },

    // 点击批量编辑按钮
    batEdit(status) {
      if (status === 'price') {
        this.editInfo.editType = 'price'
        this.editInfo.batTitle = '批量修改价格'
        this.editInfo.hasTab = true
        this.editInfo.hasUnit = true
      }
      if (status === 'shipping') {
        this.editInfo.editType = 'shipping'
        this.editInfo.batTitle = '批量修改运费'
        this.editInfo.hasTab = true
        this.editInfo.hasUnit = true
      }
      if (status === 'msrp') {
        this.editInfo.editType = 'msrp'
        this.editInfo.batTitle = '批量修改MSRP'
        this.editInfo.hasTab = true
        this.editInfo.hasUnit = true
      }
      if (status === 'inventory') {
        this.editInfo.editType = 'inventory'
        this.editInfo.batTitle = '批量修改线上库存'
        this.editInfo.hasTab = true
        this.editInfo.hasUnit = false
      }
      if (status === 'shippingWeight') {
        this.editInfo.editType = 'shippingWeight'
        this.editInfo.batTitle = '批量修改重量'
        this.editInfo.hasTab = false
        this.editInfo.hasUnit = false
      }
      if (status === 'size') {
        this.editInfo.editType = 'size'
        this.editInfo.batTitle = '批量修改尺寸'
        this.editInfo.hasTab = false
        this.editInfo.hasUnit = false
      }
      if (status === 'hsCode') {
        this.editInfo.editType = 'hsCode'
        this.editInfo.batTitle = '批量修改海关编码'
        this.editInfo.hasTab = false
        this.editInfo.hasUnit = false
      }
      if (status === 'declaredValue') {
        this.editInfo.editType = 'declaredValue'
        this.editInfo.batTitle = '批量修改报关金额'
        this.editInfo.hasTab = true
        this.editInfo.hasUnit = true
      }
      if (status === 'joomEnabled') {
        this.editInfo.editType = 'joomEnabled'
        this.editInfo.batTitle = '批量修改上架状态'
        this.editInfo.hasTab = false
        this.editInfo.hasUnit = false
      }
      this.editInfo.batEditVisible = true
    },

    // 编辑保存
    editSave() {
      if (!this.info.variationsInfo.length) return
      if (this.editInfo.hasTab) {
        if (!this.editInfo.value) {
          this.$message.error('不能为空')
          return
        }
      }
      if (this.editInfo.hasUnit && this.editInfo.unit === 'percent' && this.editInfo.tabName === 'change' && this.editInfo.changeType === 'reduce') {
        if (this.editInfo.value < 0 || this.editInfo.value > 100) {
          this.$message.error('只能输入0到100的数')
          return
        }
      }

      // 直接替换
      if (this.editInfo.hasTab && this.editInfo.tabName === 'replace') {
        this.info.variationsInfo.forEach((item) => {
          item[this.editInfo.editType] = this.editInfo.value
        })
      }
      // 增加或减少
      if (this.editInfo.hasTab && this.editInfo.tabName === 'change') {
        // 增加
        if (this.editInfo.changeType === 'increase') {
          // 百分比
          if (this.editInfo.hasUnit && this.editInfo.unit === 'percent') {
            const value = Number(this.editInfo.value)
            this.info.variationsInfo.forEach((item) => {
              var oldValue = Number(item[this.editInfo.editType]) || 0
              var temp = oldValue * (1 + value / 100)
              item[this.editInfo.editType] = Math.floor(temp * 100) / 100
            })
          }
          // 美元
          if (this.editInfo.hasUnit && this.editInfo.unit === 'USD' || !this.editInfo.hasUnit) {
            const value = Number(this.editInfo.value)
            this.info.variationsInfo.forEach((item) => {
              var oldValue = Number(item[this.editInfo.editType]) || 0
              item[this.editInfo.editType] = oldValue + value
            })
          }
        }
        // 减少
        if (this.editInfo.changeType === 'reduce') {
          // 百分比
          if (this.editInfo.hasUnit && this.editInfo.unit === 'percent') {
            const value = Number(this.editInfo.value)
            this.info.variationsInfo.forEach((item) => {
              var oldValue = Number(item[this.editInfo.editType]) || 0
              var temp = oldValue * (1 - value / 100)
              item[this.editInfo.editType] = Math.floor(temp * 100) / 100
            })
          }
          // 美元
          if (this.editInfo.hasUnit && this.editInfo.unit === 'USD' || !this.editInfo.hasUnit) {
            const value = Number(this.editInfo.value)
            this.info.variationsInfo.forEach((item) => {
              var oldValue = Number(item[this.editInfo.editType]) || 0
              item[this.editInfo.editType] = oldValue - value
            })
          }
        }
      }

      // 重量
      if (this.editInfo.editType === 'shippingWeight' || this.editInfo.editType === 'hsCode') {
        if (!this.editInfo.value) {
          this.$message.error('不能为空')
          return
        }
        this.info.variationsInfo.forEach((item) => {
          item[this.editInfo.editType] = this.editInfo.value
        })
      }

      // 尺寸
      if (this.editInfo.editType === 'size') {
        if (!this.editInfo.length || !this.editInfo.width || !this.editInfo.height) {
          this.$message.error('不能为空')
          return
        }
        this.info.variationsInfo.forEach((item) => {
          item.shippingLength = this.editInfo.length
          item.shippingWidth = this.editInfo.width
          item.shippingHeight = this.editInfo.height
        })
      }

      if (this.editInfo.editType === 'joomEnabled') {
        this.info.variationsInfo.forEach((item) => {
          item.joomEnabled = this.editInfo.enable
        })
      }

      this.editInfo.batEditVisible = false
    },

    // 限制输入
    limitInput(value, decimal = 2) {
      var regStrs = [
        ['^0(\\d+)$', '$1'],
        ['[^\\d\\.]+$', ''],
        ['\\.(\\d?)\\.+', '.$1'],
        ['^(\\d+\\.\\d{' + decimal + '}).+', '$1']
      ]
      for (var i = 0; i < regStrs.length; i++) {
        var reg = new RegExp(regStrs[i][0])
        value = value.replace(reg, regStrs[i][1])
      }
      return value
    },

    // 验证标题
    valiateTitle() {
      return new Promise((resolve, reject) => {
        this.fullscreenLoading = true
        $.ajax({
          url: '/JoomSalePlat/CheckJoomListingTitleRepeat',
          data: {
            title: this.info.basicInfo.title,
            listingId: this.listingId
          },
          success: (result) => {
            this.fullscreenLoading = false
            if (result.status === 'success') {
              resolve(result.data)
            } else {
              resolve(false)
            }
          },
          error: (error) => {
            this.$message.error(error)
            reject(error)
          }

        })
      })
    },

    // 提交前验证
    beforeSave() {
      var msg = ''
      var lowPriceStatus = false
      var isObjectEqual = function(obj1, obj2) {
        for (var p1 in obj1) {
          if (obj2[p1] === undefined) {
            return false
          }
        }
        for (var p2 in obj2) {
          if (obj1[p2] === undefined) {
            return false
          }
        }
        return true
      }

      const p1 = new Promise((resolve, reject) => {
        this.$refs['productForm'].validate((valid) => {
          if (valid) resolve()
        })
      })
      const p2 = new Promise((resolve, reject) => {
        this.$refs['otherForm'].validate((valid) => {
          if (valid) resolve()
        })
      })

      Promise.all([p1, p2]).then(async() => {
        if (!this.info.basicInfo.title) {
          this.$message.error('请输入产品标题')
          return
        }
        if (this.info.basicInfo.keyWords.length < 2) {
          this.$message.error('最少输入两个产品标签')
          return
        }
        if (!this.info.imageInfo.length) {
          this.$message.error('图片最少选择1张')
          return
        }
        if (this.info.imageInfo.length > 11) {
          this.$message.error('图片最多选择11张')
          return
        }
        if (!this.info.variationsInfo.length) {
          this.$message.error('至少保存一条变种信息！')
          return
        }

        var validateObjs = []
        for (const item of this.info.variationsInfo) {
          var validateObj = {}
          var validateProp = {}
          if (!+item.price) {
            msg = '请输入价格'
            break
          }
          if (!+item.shippingWeight) {
            msg = '请输入重量'
            break
          }

          if (item.price <= 0 || item.shipping < 0 || item.inventory < 0 || item.msrp < 0 || item.shippingHeight < 0 || item.shippingLength < 0 || item.shippingWidth < 0 || item.shippingWeight <= 0) {
            msg = '价格, 运费, 等参数不能为负数'
            break
          }

          if (trim(item.color)) {
            for (const val of this.info.variationsInfo) {
              if (!val.color) {
                msg = '变种属性信息有误！,请检查！'
                break
              }
            }
          }

          if (trim(item.size)) {
            for (const val of this.info.variationsInfo) {
              if (!val.size) {
                msg = '变种属性信息有误！,请检查！'
                break
              }
            }
          }

          if (item.listingCosts) {
            if (Number(item.price) + Number(item.shipping) < item.listingCosts) {
              lowPriceStatus = true
            }
          }
          // 未刊登（除完全没有属性）： 全部需要验证， 其他需要判断是否是否启用
          if (trim(item.color) || trim(item.size)) {
            validateProp[item.color + '_' + item.size] = true
            validateObjs.push(validateProp)
          }

          if ((item.status !== 0 && item.joomEnabled) || item.status === 0) {
            item.skuInfo.forEach((sku) => {
              validateObj[sku.code + '_' + sku.qty] = true
              if (!sku.code || !sku.qty) {
                msg = '未填写SKU信息，请返回填写！'
              }
            })
            validateObjs.push(validateObj)
          }
        }
        for (var i = 0, len = validateObjs.length; i < len; i++) {
          var cmpObj = validateObjs[i]
          if (i === len - 1) break
          for (var j = i + 1; j < len; j++) {
            if (isObjectEqual(cmpObj, validateObjs[j])) {
              this.$message.error('存在相同SKU或SKU属性，请检查', '错误')
              return
            }
          }
        }
        if (msg) {
          this.$message.error(msg)
          return
        }

        // 检查标题是否重复
        if (this.info.saveType === 0 || (this.info.saveType === 1 && (this.info.basicInfo.joomId == null || this.info.basicInfo.joomId === ''))) {
          var isTitleRepeat = await this.valiateTitle()
          if (!isTitleRepeat) {
            this.titleRepeatVisible = true
            return
          }
        }

        if (lowPriceStatus) {
          var lowPrice = dialog({
            title: '售价过低',
            content: '部分产品的售价+运费低于成本价, 是否继续保存?',
            width: 360,
            height: 50,
            cancel: true,
            cancelValue: '取消',
            okValue: '确认',
            ok: async() => {
              this.save()
            }
          })
          lowPrice.showModal()
          return
        }
        this.save()
      })
    },

    save() {
      this.fullscreenLoading = true
      $.ajax({
        url: '/JoomSalePlat/JoomListingUpdate',
        data: this.info,
        success: (result) => {
          this.fullscreenLoading = false
          if (result.status === 'success') {
            if (this.info.saveType === 0) {
              this.$message.success('保存成功')
              setTimeout(() => {
                window.location.reload()
              }, 2000)
            } else {
              this.$message.success('操作成功')
              setTimeout(() => {
                window.close()
              }, 2000)
            }
          } else {
            this.$message.error(result.msg)
          }
        }
      })
    }
  }
}
