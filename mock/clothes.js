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
    'type|1': ['发型', '连衣裙', '外套', '上衣', '下装', '袜子', '鞋子', '头饰', '耳饰', '颈饰', '手饰', '手套', '手持物', '特殊', '底妆', '睫毛', '眉毛', '瞳孔', '纯色'],
    suitId: '01d23690-c65e-11e9-8f62-315ccab08600',
    suitName: '灰灰草·流星之羽',
    suit: {
      id: '01d23690-c65e-11e9-8f62-315ccab08600',
      name: '灰灰草·流星之羽'
    },
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
    'label|1': ['妮妮尔, 制服', '制服, 户外', '保暖, 居家', '礼服, 浪漫', '云端， 简约'],
    'labelValue|1': ['100, 200', '199, 201', '600, 300', '123, 111', '222, 333'],
    description: '@cparagraph(1,3)',
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
        if (mainAttr && item.mainAttr !== mainAttr) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 0,
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
            code: 0,
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
        code: 0,
        data: 'success'
      }
    }
  },

  {
    url: '/clothes/update',
    type: 'post',
    response: _ => {
      return {
        code: 0,
        data: 'success'
      }
    }
  }
]

