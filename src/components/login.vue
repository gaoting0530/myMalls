<template>
    <div class="join">
        <div class="title">傲雪其后台管理</div>
        <el-form label-position="top" label-width="80px" :model="form" class="myform">
            <el-form-item label="用户名">
                <el-input v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="form.password"></el-input>
            </el-form-item>
            <el-form-item label="">
                <el-button type="primary" class="login" @click="login">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            form:{
                username:'',
                password:''
            }
        }
    },
    methods: {
        async login() {
           const res = await this.$http.post(`login`,this.form) 
           console.log(res)
           if(res.data.meta.status === 200) {
               this.$message.success(res.data.meta.msg)
               //登录成功，将token值本地存储
               localStorage.setItem('token',res.data.data.token)
               //跳转到系统首页
               this.$router.push({name: 'home'})
           }else {
               this.$message.error(res.data.meta.msg)
               this.form = {}
           }
        }
    },
}
</script>

<style>
.join {
    height: 100%;
    background-color: #324152;
    position: relative;
}
.myform {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    width: 400px;
    background-color: #fff;
    padding: 15px;
    border-radius: 10px;
}
.login {
    display: block;
    margin-top: 20px;
    width: 100%;
}
.title {
    text-align: center;
    color: brown;
    font-size: 24px;
    font-weight: 700;
    position: absolute;
    left: 50%;
    transform: translate(-50%);
    margin-top: 100px;
    
}
</style>
