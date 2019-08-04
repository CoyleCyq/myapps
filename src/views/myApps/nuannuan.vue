<template>
	<div class="app-container nuannuan-container">
		<el-row class="margin-bottom-5">
			<el-button type="primary" @click="mige('single')">迷阁单抽</el-button>
			<el-button type="info" @click="mige('ten')">迷阁十连</el-button>
			<el-button type="info">模拟流光抽卡</el-button>
		</el-row>
		<el-row class="margin-bottom-5">
			<el-button type="primary">幻阁单抽</el-button>
			<el-button type="info">幻阁十连</el-button>
			<el-button type="info">模拟流光抽卡</el-button>
		</el-row>
		<el-row class="margin-bottom-5">
			<el-button type="primary">流光单抽</el-button>
			<el-button type="info">流光三连</el-button>
			<el-button type="info">流光十连</el-button>
		</el-row>
		<el-row>
			<el-button type="primary">活动单抽</el-button>
			<el-button type="info">活动十连</el-button>
			<el-button type="info">模拟流光抽卡</el-button>
		</el-row>
	</div>
</template>

<script>
export default {
	name: 'nuannuan',
	data() {
		return {
			msg: 'hello nuannuan',
			// 迷阁数据
			migeList: [ 
				{ 
					level: '闪耀', 
					dataList: [
						{ name: '专属手链', level: '闪耀', mainType: '清新', author: '海哲', labels: ['礼服', '幻想'] },
						{ name: '时之制约', level: '闪耀', mainType: '性感', author: '夜骸', labels: ['时尚', '妮妮尔'] },
						{ name: '火烈鸟', level: '闪耀', mainType: '甜美', author: '暖暖', labels: ['知性', '幻想'] },
						{ name: '摇滚热裤', level: '闪耀', mainType: '帅气', author: '佐森', labels: ['时尚', '浪漫'] },
						{ name: '墨岚', level: '闪耀', mainType: '帅气', author: '暖暖', labels: ['礼服', '浪漫'] },
						{ name: '香草短发', level: '闪耀', mainType: '清新', author: '暖暖', labels: ['清凉', '幻想'] },
						{ name: '芝士巧克力', level: '闪耀', mainType: '典雅', author: '茶薄荷', labels: ['礼服', '浪漫'] }
					] 
				},
				{
					level: '非凡',
					dataList: [
						{ name: '黑钻', level: '非凡', mainType: '帅气', author: '海哲', labels: ['礼服', '制服'] },
						{ name: '花盈高校·樱', level: '非凡', mainType: '甜美', author: '爱衣', labels: ['校园', '时尚'] },
						{ name: '砂海风暴', level: '非凡', mainType: '帅气', author: '佐森', labels: ['时尚', '清凉'] },
						{ name: '黑色丸子头', level: '非凡', mainType: '典雅', author: '暖暖', labels: ['简约', '清凉'] },
						{ name: '惹火红唇', level: '非凡', mainType: '典雅', author: '海哲', labels: ['制服', '知性'] },
						{ name: '过膝长靴·昼', level: '非凡', mainType: '典雅', author: '江北希', labels: ['保暖', '知性'] },
						{ name: '魔法炼金', level: '非凡', mainType: '典雅', author: '叶苏夏', labels: ['保暖', '浪漫'] },
						{ name: '糖葫芦·粉', level: '非凡', mainType: '甜美', author: '夜宵', labels: ['校园', '浪漫'] },
						{ name: '潮流短发', level: '非凡', mainType: '甜美', author: '暖暖', labels: ['清凉', '知性'] }
					]
				},
				{
					level: '稀有',
					dataList: [
						{ name: '慈悲恩典', level: '稀有', mainType: '', author: '', labels: ['', ''] },
						{ name: '学院高筒袜', level: '稀有', mainType: '', author: '', labels: ['', ''] },
						{ name: '萌兔背带·夜', level: '稀有', mainType: '', author: '', labels: ['', ''] },
						{ name: '玉兰蓓蕾', level: '稀有', mainType: '', author: '', labels: ['', ''] },
						{ name: '信仰救赎', level: '稀有', mainType: '', author: '', labels: ['', ''] },
						{ name: '樱红小格', level: '稀有', mainType: '', author: '', labels: ['', ''] },
						{ name: '清风片雨', level: '稀有', mainType: '', author: '', labels: ['', ''] },
						{ name: '马蹄莲', level: '稀有', mainType: '', author: '', labels: ['', ''] },
						{ name: '荒野派对', level: '稀有', mainType: '', author: '', labels: ['', ''] },
						{ name: '蛋黄派', level: '稀有', mainType: '', author: '', labels: ['', ''] },
						{ name: '杏仁露', level: '稀有', mainType: '', author: '', labels: ['', ''] },
						{ name: '红白心情', level: '稀有', mainType: '', author: '', labels: ['', ''] },
						{ name: '性感程序·粉', level: '稀有', mainType: '', author: '', labels: ['', ''] },
						{ name: '落樱的守候', level: '稀有', mainType: '', author: '', labels: ['', ''] },
						{ name: '白猫淑女', level: '稀有', mainType: '', author: '', labels: ['', ''] },
						{ name: '芝麻', level: '稀有', mainType: '', author: '', labels: ['', ''] },
					]
				}, 
				{
					level: '普通',
					dataList: [
						{ name: '纯白吊带', level: '普通', mainType: '', author: '', labels: ['', ''] },
						{ name: '魔法协会', level: '普通', mainType: '', author: '', labels: ['', ''] },
						{ name: '清爽休闲衫', level: '普通', mainType: '', author: '', labels: ['', ''] },
						{ name: '花漾流芳', level: '普通', mainType: '', author: '', labels: ['', ''] },
						{ name: '水仙色的你', level: '普通', mainType: '', author: '', labels: ['', ''] },
						{ name: '居家吊带', level: '普通', mainType: '', author: '', labels: ['', ''] },
						{ name: '粉梦家居裤', level: '普通', mainType: '', author: '', labels: ['', ''] },
						{ name: '粉桃初绽', level: '普通', mainType: '', author: '', labels: ['', ''] },
						{ name: '白色打底裙', level: '普通', mainType: '', author: '', labels: ['', ''] },
						{ name: '淑女假日', level: '普通', mainType: '', author: '', labels: ['', ''] },
						{ name: '黑色打底裙', level: '普通', mainType: '', author: '', labels: ['', ''] },
						{ name: '醉兰', level: '普通', mainType: '', author: '', labels: ['', ''] },
						{ name: '蔷薇之翼', level: '普通', mainType: '', author: '', labels: ['', ''] },
						{ name: '紫藤的约定', level: '普通', mainType: '', author: '', labels: ['', ''] },
						{ name: '萌黄夏日', level: '普通', mainType: '', author: '', labels: ['', ''] },
						{ name: '白瓷', level: '普通', mainType: '', author: '', labels: ['', ''] },
						{ name: '黑色短袖衫', level: '普通', mainType: '', author: '', labels: ['', ''] },
						{ name: '墨色涟漪', level: '普通', mainType: '', author: '', labels: ['', ''] },
						{ name: '点点长筒袜', level: '普通', mainType: '', author: '', labels: ['', ''] },
						{ name: '蕾丝玻璃袜', level: '普通', mainType: '', author: '', labels: ['', ''] },
						{ name: '暗夜派对', level: '普通', mainType: '', author: '', labels: ['', ''] },
						{ name: '阳光马尾', level: '普通', mainType: '', author: '', labels: ['', ''] },
					]
				}
			],
			config: {
				mige: { // 迷阁
					pt: 94.40, // 普通概率
					xy: 5.00, // 稀有概率
					ff: 0.50, // 非凡概率
					sy: 0.10 // 闪耀概率
				},
				huange: { // 幻阁
					xy: 62.80, // 稀有
					ff: 25.00, // 非凡
					sy: 2.50, // 闪耀
					xyk: 6.20, // 稀有卡
					ffk: 3.00, // 非凡卡
					syk: 0.50 //闪耀卡
				},
				liuguang: { // 幻阁·流光
					xdxy: 40.00, // 限定稀有
					xdff: 16.00, // 限定非凡
					xdxyk: 5.58, // 限定稀有卡
					xdffk: 2.70, // 限定非凡卡
					ybxy: 22.80, // 一般稀有
					ybff: 9.00, // 一般非凡
					ybsy: 2.50, // 一般闪耀
					ybxyk: 0.62, // 一般稀有卡
					ybffk: 0.30, // 一般非凡卡
					ybsyk: 0.50 // 一般闪耀卡
				}
			}
		}
	},
	methods: {
		getColor(level) {
			return {
				'闪耀': 'bg-sy',
				'非凡': 'bg-ff',
				'稀有': 'bg-xy',
				'普通': '',
			}[level]
		},
		// 迷阁单抽
		migeCommon(status) {
			var numList = [] 
			let resList = []
			if (status === 'single') {
				numList.push(Math.floor(Math.random() * 10000) / 100);
			} else if (status === 'ten') {
				for (let i=0; i<10; i++) {
					numList.push(Math.floor(Math.random() * 10000) / 100)
				}
			}
			console.log(numList)
			numList.forEach((item, i) => {
				var str = ''
				if (item <= 94.40) {
					str = '普通'
				} else if (item < 99.40) {
					str = '稀有'
				} else if (item < 99.90) {
					str = '非凡'
				} else if (item <= 100) {
					str = '闪耀'
					console.log(item, str)
				}
				resList.push(str)
			})
			return resList
		},
		mige(status) {
			let resList = this.migeCommon(status)
			let list = []
			let msg = ''
			for (let res of resList) {
				for (let info of this.migeList) {
					if (res === info.level) {
						var length = info.dataList.length
						let index = Math.floor(Math.random() * length)
						list.push(info.dataList[index])
					}
				}
			}
			for (let item of list) {
				msg += `<div class="${this.getColor(item.level)}">抽到${item.level}品质服装一件, ${item.name}</div>`
			}
			this.$message({dangerouslyUseHTMLString: true, message: msg});
		}
	}
}
</script>

<style lang="scss" scoped>
.nuannuan-container {
	.margin-bottom-5 {
		margin-bottom: 5px !important;
	}
}
.bg-sy {
	color: goldenrod !important;
}
.bg-ff {
	color: silver !important;
}
.bg-xy {
	color: burlywood !important;
}
</style>
