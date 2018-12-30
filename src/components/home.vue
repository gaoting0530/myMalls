<template>
  <el-container class="mycontainer">
      <el-header class="myheader">
        <el-row>
          <el-col :span="4"><div class="grid-content bg-purple"><img src="@/assets/logo.png" alt=""></div></el-col>
          <el-col :span="18"><div class="grid-content bg-purple-light middle">傲雪其电商后台管理系统</div></el-col>
          <el-col :span="2"><a href="javascript:;" class="logout" @click="logout">退出登录</a></el-col>
        </el-row>
      </el-header>
      <el-container>
        <el-aside width="200px" class="myaside">
           <el-menu
            default-active="2"
            :unique-opened="true"
            :router="true"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose">
              <el-submenu index="1">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>用户管理</span>
                </template>
                  <el-menu-item index="users"><i class="el-icon-tickets"></i>用户列表</el-menu-item>
              </el-submenu>
              <el-submenu index="2">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>导航一</span>
                </template>
                  <el-menu-item index="2-1"><i class="el-icon-location"></i>选项1</el-menu-item>
                  <el-menu-item index="2-2"><i class="el-icon-location"></i>选项2</el-menu-item>
              </el-submenu>
              <el-submenu index="3">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>导航一</span>
                </template>
                  <el-menu-item index="3-1"><i class="el-icon-location"></i>选项1</el-menu-item>
                  <el-menu-item index="3-2"><i class="el-icon-location"></i>选项2</el-menu-item>
              </el-submenu>
              <el-submenu index="4">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>导航一</span>
                </template>
                  <el-menu-item index="4-1"><i class="el-icon-location"></i>选项1</el-menu-item>
                  <el-menu-item index="4-2"><i class="el-icon-location"></i>选项2</el-menu-item>
              </el-submenu>
           </el-menu>
        </el-aside>
        <el-main class="main">Main</el-main>
      </el-container>
  </el-container>
</template>

<script>
export default {
  beforeCreate() {
    if(!localStorage.getItem('token')) {
      this.$router.push({name: 'login'})
    }
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
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  
}
</script>

<style scoped>
.mycontainerrd {
  height: 100%;
}
.myheader {
  background-color: #b3c0d1;
  margin: 0;
  padding: 0;
}
.myaside {
  background-color: #d3dce6;
}
.mymain {
  background-color: #e9eef3;
  height: 100%;
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
