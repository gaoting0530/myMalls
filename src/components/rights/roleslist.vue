<template>
    <el-card class="mycard">
        <my-bread title1="权限管理" title2="角色列表"></my-bread>
        <el-button type="info" class="addRole" @click="addRoleShow">添加角色</el-button>
         <el-table
            height="460px"
            class="my-table"
            :data="roleList"
            stripe
            style="width: 100%">
            <el-table-column
            type="expand"
            width="80">
            <template slot-scope="scope">
                <el-row v-for="(item,i) in scope.row.children" :key="i">
                    <el-col :span="4">
                        <el-tag @close="deleteZ(item.id,scope.row)" type="success" closable>{{item.authName}}</el-tag>
                    </el-col>
                    <el-col :span="20">
                        <el-row v-for="(item1,i) in item.children" :key="i">
                            <el-col :span="6">
                                <el-tag @close="deleteZ(item1.id,scope.row)" type="danger" closable>{{item1.authName}}</el-tag>
                            </el-col>
                            <el-col :span="18">
                                <el-tag @close="deleteZ(item2.id,scope.row)" closable type="warning" v-for="(item2,i) in item1.children" :key="i">{{item2.authName}}</el-tag>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <span v-if="scope.row.children.length === 0">没有相关的权限</span>
            </template>
            </el-table-column>
            <el-table-column
            type="index"
            width="80">
            </el-table-column>
            <el-table-column
            prop="roleName"
            label="角色名称"
            width="280">
            </el-table-column>
            <el-table-column
            prop="roleDesc"
            label="角色描述"
            width="280">
            </el-table-column>
            <el-table-column
            label="操作">
            <template slot-scope="scope">
                <el-button @click="editRoleShow(scope.row.id)" plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
                <el-button @click="deleteRole(scope.row.id)" plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
                <el-button @click="rightsShow(scope.row)" plain size="mini" type="success" icon="el-icon-check" circle></el-button>
            </template>
            </el-table-column>
        </el-table>
         <!-- 对话框 -->
            <!-- 修改角色对话框 -->
        <el-dialog title="添加角色" :visible.sync="editRolesShowDialog">
            <el-form :model="form">
                <el-form-item label="角色名称" :label-width="formLabelWidth">
                    <el-input v-model="form.roleName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" :label-width="formLabelWidth">
                    <el-input v-model="form.roleDesc" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editRolesShowDialog = false">取 消</el-button>
                <el-button type="primary" @click="editRoles">确 定</el-button>
            </div>
        </el-dialog>
            <!-- 添加角色对话框 -->
        <el-dialog title="添加角色" :visible.sync="addRolesShowDialog">
            <el-form :model="form">
                <el-form-item label="角色名称" :label-width="formLabelWidth">
                    <el-input v-model="form.roleName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" :label-width="formLabelWidth">
                    <el-input v-model="form.roleDesc" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addRolesShowDialog = false">取 消</el-button>
                <el-button type="primary" @click="addRoles">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 树形控件 -->
            <!-- 权限关系对话框 -->
        <el-dialog title="权限修改" :visible.sync="rightsShowDialog">
            <el-tree
            ref="tree"
            :data="rightsList"
            show-checkbox
            :default-expand-all="true"
            node-key="id"
            :default-checked-keys="defaultCheckedKeys"
            :props="defaultProps">
            </el-tree> 
            <div slot="footer" class="dialog-footer">
                <el-button @click="addRolesShowDialog = false">取 消</el-button>
                <el-button type="primary" @click="editRights">确 定</el-button>
            </div>
        </el-dialog>
               
    </el-card>
</template>

<script>
export default {
    data() {
        return {
            roleList:[],
            rightsList:[],
            addRolesShowDialog: false,
            editRolesShowDialog: false,
            rightsShowDialog: false,
            formLabelWidth: '120px',
            currentRid: -1,
            form: {
                roleName:'',
                roleDesc:''
            },
            defaultProps: {
                children: 'children',
                label: 'authName'
            },
            defaultCheckedKeys : []
        }
    },
    created() {
        this.getAllRoles()
    },
    methods: {
        // 权限修改
        async editRights() {
            let checkedKeys = this.$refs.tree.getCheckedKeys()
            let halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
            let ridarr = [...checkedKeys,...halfCheckedKeys]
            const res = await this.$http.post(`roles/${this.currentRid}/rights`,{rids: ridarr.join(',')})
            if(res.data.meta.status === 200) {
                this.$message.success(res.data.meta.msg)
                this.getAllRoles()
            }
            this.rightsShowDialog = false
        },
        async rightsShow(role) {
            const res = await this.$http.get(`rights/tree`)
            this.currentRid = role.id
            this.rightsList = res.data.data
            var tmparr = []
            role.children.forEach((item) => {
                // tmparr.push(item.id)
                item.children.forEach(item1 => {
                    // tmparr.push(item1.id)
                    item1.children.forEach(item2 => {
                        tmparr.push(item2.id)
                    })
                })
            })
            this.defaultCheckedKeys = tmparr
            this.rightsShowDialog = true
        },
        // 删除职责
        async deleteZ(rightId,role) {
            const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
            if(res.data.meta.status === 200) {
                this.$message.success(res.data.meta.msg)
                role.children = res.data.data
            }
        },
        // 编辑角色
        async editRoles() {
            const res = await this.$http.put(`roles/${this.currentRid}`,this.form)
            if(res.data.meta.status === 200) {
                this.$message.success(res.data.meta.msg)
                this.getAllRoles()
            }
            this.form = {}
            this.editRolesShowDialog = false
        },
        async editRoleShow(id) {
            const res = await this.$http.get(`roles/${id}`)
            this.form = res.data.data
            this.currentRid = this.form.roleId
            this.editRolesShowDialog = true
        },
        // 删除角色
        async deleteRole(id) {
             this.$confirm('确定要删除该用户?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                    }).then(async () => {
                        const res = await this.$http.delete(`roles/${id}`)
                        if(res.data.meta.status === 200) {
                            this.$message.success(res.data.meta.msg)
                            this.getAllRoles()
                        }
                    }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
            })
        },
        // 添加角色
        async addRoles() {
            const res = await this.$http.post(`roles`,this.form)
            if(res.data.meta.status === 201) {
                this.$message.success(res.data.meta.msg)
                this.getAllRoles()
            }
            this.form = {}
            this.addRolesShowDialog = false
        },
        addRoleShow() {
            this.addRolesShowDialog = true
        },
        // 获取所有角色
        async getAllRoles() {
            const res = await this.$http.get(`roles`)
            this.roleList = res.data.data
        }
    },
}
</script>

<style>
.mycard {
    height: 100%
}
.addRole {
    margin-top: 20px;
}
.my-table {
    margin-top: 20px;
}
.myspan {
    text-align: center
}
</style>
