<template>
  <el-container class="container">
      <el-header class="header">
        <el-row>
          <el-col :span="4"><div class="grid-content bg-purple"><img src="@/assets/logo.png" alt=""></div></el-col>
          <el-col :span="18"><div class="grid-content bg-purple-light middle">傲雪其电商后台管理系统</div></el-col>
          <el-col :span="2"><a href="javascript:;" class="logout" @click="logout">退出登录</a></el-col>
        </el-row>
      </el-header>
      <el-container>
        <el-aside width="200px" class="aside">
           <el-menu
            default-active="2"
            :unique-opened="true"
            :router="true"
            class="el-menu-vertical-demo">
              <el-submenu v-for="(item,i) in menusList" :key="i" :index=" '' + item.order">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{item.authName}}</span>
                </template>
                  <el-menu-item :index="item1.path" v-for="(item1,i) in item.children" :key="i"><i class="el-icon-setting"></i>{{item1.authName}}</el-menu-item>
              </el-submenu>
           </el-menu>
        </el-aside>
        <el-main class="main">
          <router-view></router-view>
        </el-main>
      </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menusList:[]
    }
  },
  beforeCreate() {
    if(!localStorage.getItem('token')) {
      this.$router.push({name: 'login'})
    }
  },
  created() {
    this.getMenus()
  },
    methods: {
      logout() {
         this.$confirm('确定要退出系统?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          localStorage.clear()
          this.$router.push({name: 'login'})
          this.$message({
            type: 'success',
            message: '退出成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      async getMenus() {
        const res = await this.$http.get(`menus`)
        this.menusList = res.data.data
        console.log(res)
      }
    }
  
}
</script>

<style scoped>
.container {
  height: 100%;
}

.header {
  background-color: #b3c0d1;
}

.aside {
  background-color: #d3dce6;
}

.main {
  background-color: #e9eef3;
}
.middle {
  line-height: 60px;
  text-align: center;
  font-size: 18px;
  font-weight: 700;
}
.logout {
  line-height: 60px;
  text-decoration: none;
}
</style>
