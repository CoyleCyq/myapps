/**
 * Created by CoyleCyq on 25/08/19.
 */

/**
 * 获取标签
 * @param {labelStr} 标签字符串
 * @returns {HTMLElement}
 */
export function getLabelHtml(labelStr) {
  if (!labelStr) return ''
  const lableList = labelStr.split(/[,，]/)
  let labelHtml = ''
  const labelObj = {
    '保暖': '<label class="label label-sm" style="background: #FFBD83">保暖</label>',
    '清凉': '<label class="label label-sm" style="background: #A9D8E3">清凉</label>',
    '居家': '<label class="label label-sm" style="background: #FFBD81">居家</label>',
    '户外': '<label class="label label-sm" style="background: #FFBBA9">户外</label>',
    '校园': '<label class="label label-sm" style="background: #C2D19A">校园</label>',
    '制服': '<label class="label label-sm" style="background: #86B7D9">制服</label>',
    '礼服': '<label class="label label-sm" style="background: #D096D8">礼服</label>',
    '休闲': '<label class="label label-sm" style="background: #D7DADC">休闲</label>',
    '云端': '<label class="label label-sm" style="background: #97CEFB">云端</label>',
    '废墟': '<label class="label label-sm" style="background: #BEAFAA">废墟</label>',
    '妮妮尔': '<label class="label label-sm" style="background: #F9A9C1">妮妮尔</label>',
    '浪漫': '<label class="label label-sm" style="background: #A7D8D0">浪漫</label>',
    '幻想': '<label class="label label-sm" style="background: #AADAD3">幻想</label>',
    '知性': '<label class="label label-sm" style="background: #AAD9D3">知性</label>',
    '时尚': '<label class="label label-sm" style="background: #A9D7D3">时尚</label>',
    '简约': '<label class="label label-sm" style="background: #A6D7CF">简约</label>'
  }
  for (let label of lableList) {
    label = label.replace(' ', '')
    labelHtml += labelObj[label] || ''
  }
  return labelHtml
}

/**
 * 获取品质
 * @param {levelStr} 品质字符串
 * @returns {HTMLElement}
 */
export function getLevelHtml(levelStr) {
  if (!levelStr) return ''
  const levelObj = {
    '普通': '<label class="label label-sm" style="background: #9E98BE">普通</label>',
    '稀有': '<label class="label label-sm" style="background: #AE7E65">稀有</label>',
    '非凡': '<label class="label label-sm" style="background: #92A3BF">非凡</label>',
    '闪耀': '<label class="label label-sm" style="background: #EFAE41">闪耀</label>'
  }
  return levelObj[levelStr] || ''
}

/**
 * 获取主属性
 * @param {attrStr} 品质字符串
 * @returns {HTMLElement}
 */
export function getAttrHtml(attrStr) {
  if (!attrStr) return ''
  const attrObj = {
    '典雅': '<label class="label label-sm attr-label" style="background: #E7AB71">典雅</label>',
    '清新': '<label class="label label-sm attr-label" style="background: #72CBB0">清新</label>',
    '甜美': '<label class="label label-sm attr-label" style="background: #FF8396">甜美</label>',
    '性感': '<label class="label label-sm attr-label" style="background: #A470B2">性感</label>',
    '帅气': '<label class="label label-sm attr-label" style="background: #8EB1FC">帅气</label>'
  }
  return attrObj[attrStr] || ''
}
