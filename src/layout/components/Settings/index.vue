<template>
  <div class="drawer-container">
    <div>
      <h3 class="drawer-title">Page style setting</h3>

      <div class="drawer-item">
        <span>Theme Color</span>
        <theme-picker style="float: right;height: 26px;margin: -3px 8px 0 0;" @change="themeChange" />
      </div>

      <div class="drawer-item">
        <span>Open Tags-View</span>
        <el-switch v-model="tagsView" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>Fixed Header</span>
        <el-switch v-model="fixedHeader" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>Sidebar Logo</span>
        <el-switch v-model="sidebarLogo" class="drawer-switch" />
      </div>

      <div v-if="!isAdmin" class="drawer-item">
        <el-input v-model="password" placeholder="请输入密码" />
        <el-button class="margin-top-5" type="primary" icon="el-icon-setting" @click="getEditPermission">
          获取修改权限
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import ThemePicker from '@/components/ThemePicker'

export default {
  components: { ThemePicker },
  data() {
    return {
      getEditVisible: false,
      password: ''
    }
  },
  computed: {
    fixedHeader: {
      get() {
        return this.$store.state.settings.fixedHeader
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'fixedHeader',
          value: val
        })
      }
    },
    tagsView: {
      get() {
        return this.$store.state.settings.tagsView
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'tagsView',
          value: val
        })
      }
    },
    sidebarLogo: {
      get() {
        return this.$store.state.settings.sidebarLogo
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'sidebarLogo',
          value: val
        })
      }
    },
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
    this.isAdmin = this.getPermissionInfo()
  },
  methods: {
    themeChange(val) {
      this.$store.dispatch('settings/changeSetting', {
        key: 'theme',
        value: val
      })
    },
    getPermissionInfo() {
      if (localStorage.permissionInfo) {
        const permissionInfo = JSON.parse(localStorage.permissionInfo)
        const now = Date.now()
        const time = permissionInfo.time
        const date = permissionInfo.date
        if ((parseInt(time) + parseInt(date)) < now) {
          localStorage.removeItem('permissionInfo')
          return false
        } else {
          return permissionInfo.isAdmin
        }
      } else {
        return this.$store.state.settings.isAdmin
      }
    },
    getEditPermission() {
      if (!this.password) {
        this.$message.error('密码不能为空')
        return false
      }
      if (this.password === 'coyle123') {
        this.$message.success('编辑权限获取成功')
        this.isAdmin = true
        const permissionInfo = {
          isAdmin: true,
          date: Date.now(),
          time: 3600000 // 60分钟
        }
        localStorage.permissionInfo = JSON.stringify(permissionInfo)
      } else {
        this.$message.error('权限获取失败！')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, .85);
    font-size: 14px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, .65);
    font-size: 14px;
    padding: 12px 0;
  }

  .drawer-switch {
    float: right
  }
}
</style>
