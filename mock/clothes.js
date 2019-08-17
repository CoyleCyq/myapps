import Mock from 'mockjs'

const List = []
const nameList = ['奇迹之心', '繁花之径', '启明星·破晓', '露凝晨雾', '欲望之音', '永恒湖光', '绒羽欢歌', '曙光初醒', '纯白礼赞']
const count = 100

const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@guid',
    'name|1': nameList,
    'level|1': ['普通', '稀有', '非凡', '闪耀'],
    suitId: '@guid',
    'suitName|1': ['流光花蔓', '抖落繁星', '晨雾微风', '眠眠兔', '欲望之音', '璀璨之约', '花影瑶'],
    imgurl: image_uri,
    'mainAttr|1': ['典雅', '甜美', '帅气', '性感', '清新'],
    soure: '幻阁, 幻阁·流光',
    elegantValue: '@integer(100, 2000)',
    sweetValue: '@integer(100, 2000)',
    freshValue: '@integer(100, 2000)',
    sexyValue: '@integer(100, 2000)',
    handsomeValue: '@integer(100, 2000)',
    price: '@integer(1000, 20000)',
    'priceType|1': ['钻石', '金币'],
    'label|1': ['妮妮尔', '军装', '礼服', '云端'],
    labelValue: '@integer(100, 1000)',
    createTime: '@datetime',
    updateTime: '@datetime'
  }))
}

export default [
  {
    url: '/clothes/list',
    type: 'get',
    response: config => {
      const { level, name, mainAttr, page = 1, limit = 20, sort } = config.query

      let mockList = List.filter(item => {
        if (level && item.level !== level) return false
        if (name && item.name !== name) return false
        if (mainAttr && item.mainAttr != mainAttr) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },

  {
    url: '/clothes/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const clothes of List) {
        if (clothes.id === +id) {
          return {
            code: 20000,
            data: clothes
          }
        }
      }
    }
  },

  {
    url: '/clothes/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/clothes/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

