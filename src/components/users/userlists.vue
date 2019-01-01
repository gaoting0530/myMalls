<template>
    <el-card class="mycard">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 搜索框 -->
        <el-input placeholder="请输入内容" clearable v-model="query" class="input-with-select searchbox" @change="searchUsers">
            <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="success" @click="addUserShow">添加用户</el-button>
        <!-- 用户列表--表格 -->
        <el-table
            class="mytable"
            border
            height="420px"
            :data="userlists"
            style="width: 100%">
            <el-table-column
                type="index"
                width="50">
            </el-table-column>
            <el-table-column
                prop="username"
                label="姓名"
                width="180">
            </el-table-column>
            <el-table-column
                prop="email"
                label="邮箱">
            </el-table-column>
            <el-table-column
                prop="mobile"
                label="手机">
            </el-table-column>
            <el-table-column
                prop="create_time"
                label="创建时间">
                <template slot-scope="scope">
                    {{scope.row.create_time | fmtDate}}
                </template>
            </el-table-column>
            <el-table-column
                label="用户状态">
                <template slot-scope="scope">
                    <el-switch
                    v-model="scope.row.mg_state"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    @change="stateChange(scope.row.id,scope.row.mg_state)">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column
                label="操作">
                <template slot-scope="scope">
                        <el-button @click="editUserShow(scope.row.id)" plain size="small" type="primary" icon="el-icon-edit" circle></el-button>
                        <el-button @click="deleteUser(scope.row.id)" plain size="small" type="danger" icon="el-icon-delete" circle></el-button>
                        <el-button @click="setRoleShow(scope.row.id)" plain size="small" type="success" icon="el-icon-check" circle></el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
            class="mypagination"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagenum"
            :page-sizes="[2, 4, 6, 8]"
            :page-size="2"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>

        <!-- 对话框 -->
            <!-- 添加用户对话框 -->
        <el-dialog title="添加用户" :visible.sync="addUserShowDialog">
            <el-form :model="form">
                <el-form-item label="用户名" :label-width="formLabelWidth">
                    <el-input v-model="form.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth">
                    <el-input v-model="form.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" :label-width="formLabelWidth">
                    <el-input v-model="form.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话" :label-width="formLabelWidth">
                    <el-input v-model="form.mobile" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addUserShowDialog = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </div>
        </el-dialog>
            <!-- 编辑用户对话框 -->
        <el-dialog title="编辑用户" :visible.sync="editUserShowDialog">
            <el-form :model="form">
                <el-form-item label="用户名" :label-width="formLabelWidth" >
                    <el-input v-model="form.username" autocomplete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" :label-width="formLabelWidth">
                    <el-input v-model="form.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话" :label-width="formLabelWidth">
                    <el-input v-model="form.mobile" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editUserShowDialog = false">取 消</el-button>
                <el-button type="primary" @click="editUser">确 定</el-button>
            </div>
        </el-dialog>
            <!-- 分配角色对话框 -->
        <el-dialog title="角色分配" :visible.sync="setRoleShowDialog">
            <el-form :model="form">
                <el-form-item label="用户名" :label-width="formLabelWidth" >
                    <el-row>{{currentUser}}</el-row>
                </el-form-item>
                <el-form-item label="角色" :label-width="formLabelWidth">
                    <el-select v-model="currentRid" clearable placeholder="请选择">
                        <el-option
                        v-for="item in roleList"
                        :key="item.id"
                        :label="item.roleName"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="setRoleShowDialog = false">取 消</el-button>
                <el-button type="primary" @click="setRole">确 定</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>

<script>
export default {
    data() {
        return {
            value1: true,
            value2: '',
            query:'',
            userlists: [],
            roleList:[],
            pagenum: 1,
            pagesize: 2,
            total: -1,
            formLabelWidth: '100px',
            addUserShowDialog: false,
            editUserShowDialog: false,
            setRoleShowDialog: false,
            currentId: -1,
            currentUser: -1,
            currentRid: '',
            form: {
                usernam:'',
                password:'',
                email: '',
                mobile: ''
            }
        }
    },
    created() {
        this.getAllUsers();
    },
    methods: {
        //用户角色分配
        async setRole() {
            const res = await this.$http.put(`users/${this.currentId}/role`,{rid: this.currentRid})
            // console.log(res)
            if(res.data.meta.status === 200) {
                this.$message.success(res.data.meta.msg)
                this.getAllUsers()
            }else {
                this.$message.error(res.data.meta.msg)
            }
            this.setRoleShowDialog = false
        },
        async setRoleShow(id) {
            this.currentId = id
            const res1 = await this.$http.get(`users/${id}`)
            if(res1.data.meta.status === 200) {
                this.currentUser = res1.data.data.username
                this.currentRid = res1.data.data.rid
            }
            const res2 = await this.$http.get(`roles`)
            if(res2.data.meta.status === 200) {
                this.roleList = res2.data.data
            }
            this.setRoleShowDialog = true
        },
        //编辑用户
        async editUser() {
            const res = await this.$http.put(`users/${this.currentId}`,{email:this.form.email,mobile: this.form.mobile})
            if(res.data.meta.status === 200) {
                this.$message.success(res.data.meta.msg)
                this.getAllUsers()
            }else {
                this.$message.error(res.data.meta.msg)
            }
            this.form = {}
            this.editUserShowDialog = false
        },
        async editUserShow(id) {
            const res = await this.$http.get(`users/${id}`)
            if(res.data.meta.status === 200) {
                this.form = res.data.data
                this.currentId = res.data.data.id
            }
            this.editUserShowDialog = true
        },
        //删除用户
        deleteUser(id) {
            this.$confirm('确定要删除该用户?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                    }).then(async () => {
                        const res = await this.$http.delete(`users/${id}`)
                        if(res.data.meta.status === 200) {
                            this.$message.success(res.data.meta.msg)
                            this.getAllUsers()
                        }else {
                            this.$message.error(res.data.meta.msg)
                        }
                    }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
            });  
        },
        //搜索功能
        searchUsers() {
            this.getAllUsers()
        },
        //添加用户
        async addUser() {
            const res = await this.$http.post(`users`,this.form)
            if(res.data.meta.status === 201) {
                this.$message.success(res.data.meta.msg)
                this.getAllUsers()
            }
            this.form = {}
            this.addUserShowDialog = false
        },
        addUserShow() {
            this.addUserShowDialog = true
        },
        // 分页功能相关事件
        handleSizeChange(val) {
            this.pagesize = val
            this.pagenum = 1
            this.getAllUsers()
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.pagenum = val
            this.getAllUsers()
            console.log(`当前页: ${val}`);
        },
        // 用户状态设置
        async stateChange(uid,state) {
            const res = await this.$http.put(`users/${uid}/state/${state}`)
            this.$message.warning(res.data.meta.msg)
        },
        //获取所用用户列表
        async getAllUsers() {
            const res = await this.$http.get(`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
            if(res.data.meta.status === 200) {
                this.userlists = res.data.data.users
                this.total = res.data.data.total
            }
            console.log(res)
        }
    },
}
</script>

<style>
.mycard {
    height: 100%;
}
.searchbox {
    width: 360px;
    margin-top: 20px;
}
.mytable {
    margin-top: 20px;
}
.mypagination {
    margin-top: 20px;
}
</style>
