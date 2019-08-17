import Mock from 'mockjs'

const List = []
const nameList = ['流光花蔓', '抖落繁星', '晨雾微风', '眠眠兔', '欲望之音', '璀璨之约', '花影瑶']
const count = 50

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@guid',
    'name|1': nameList,
    'level|1': ['普通', '稀有', '非凡', '闪耀'],
    'mainAttr|1': ['典雅', '甜美', '帅气', '性感', '清新'],
    'author|1': ['暖暖', '左一', '海哲', '一衣红雪', '洛昂', '莉莉丝'],
    amount: '@integer(5, 13)',
    source: '幻阁, 幻阁·流光',
    'label|1': ['妮妮尔', '军装', '礼服', '云端'],
    createTime: '@datetime',
    updateTime: '@datetime'
  }))
}

export default [
  {
    url: '/suit/list',
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
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },

  {
    url: '/suit/detail',
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
    url: '/suit/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/suit/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

