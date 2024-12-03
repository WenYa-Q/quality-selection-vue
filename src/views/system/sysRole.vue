<template>
  <div class="search-div">
    <!-- 搜索表单 -->
    <el-form label-width="70px" size="small">
      <el-form-item label="角色名称">
        <el-input v-model="queryDto.roleName" style="width: 100%" placeholder="角色名称"></el-input>
      </el-form-item>
      <el-row style="display:flex">
        <el-button type="primary" size="small" @click="searchSysRole">
          搜索
        </el-button>
        <el-button size="small">重置</el-button>
      </el-row>
    </el-form>

    <!-- 添加按钮 -->
    <div class="tools-div">
      <el-button type="success" size="small" @click="addShow">添 加</el-button>
    </div>

    <!-- 添加角色表单对话框 -->
    <el-dialog v-model="dialogVisible" title="添加或修改角色" width="30%">
      <el-form label-width="120px">
        <el-form-item label="角色名称">
          <el-input v-model="sysRole.roleName" />
        </el-form-item>
        <el-form-item label="角色Code">
          <el-input v-model="sysRole.roleCode" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">提交</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--- 角色表格数据 -->
    <el-table :data="list" style="width: 100%">
      <el-table-column prop="roleName" label="角色名称" width="180" />
      <el-table-column prop="roleCode" label="角色code" width="180" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column label="操作" align="center" width="280" #default="scope">
        <el-button type="primary" size="small" @click="editShow(scope.row)">
          修改
        </el-button>
        <el-button type="danger" size="small" @click="deleteById(scope.row)">
          删除
        </el-button>
        <el-button type="warning" size="small" @click="showAssignMenu(scope.row)">
          分配菜单
        </el-button>
      </el-table-column>
    </el-table>

    <!-- 分配菜单的对话框 
		// tree组件添加ref属性，后期方便进行tree组件对象的获取
		-->
    <el-dialog v-model="dialogMenuVisible" title="分配菜单" width="40%">
      <el-form label-width="80px">
        <el-tree
          :data="sysMenuTreeList"
          ref="tree"
          show-checkbox
          default-expand-all
          :check-on-click-node="true"
          node-key="id"
          :props="defaultProps"
        />
        <el-form-item>
          <el-button type="primary" @click="doAssign">提交</el-button>
          <el-button @click="dialogMenuVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--分页条-->
    <el-pagination
      v-model:current-page="pageParams.pageNum"
      v-model:page-size="pageParams.pageSize"
      :page-sizes="[10, 20, 50, 100]"
      @size-change="fetchData"
      @current-change="fetchData"
      layout="total, sizes, prev, pager, next"
      :total="total"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import {
  GetSysRoleListByPage,
  SaveSysRole,
  UpdateSysRole,
  DeleteSysRoleById,
  GetSysRoleMenuIds,
  DoAssignMenuIdToSysRole,
} from "@/api/sysRole";
import { ElMessage, ElMessageBox } from "element-plus";

// 分页条总记录数
let total = ref(0);

// 定义表格数据模型
let list = ref([]);

//分页参数
const pageParamsForm = ref({
  pageNum: 1,
  pageSize: 10,
});

const pageParams = ref(pageParamsForm);

//条件查询参数
const queryDto = ref({ roleName: "" });

onMounted(() => {
  fetchData();
});

//控制添加角色弹窗是否显示
const dialogVisible = ref(false);
const addShow = () => {
  dialogVisible.value = true;
};

//修改用户
const editShow = (row) => {
  sysRole.value = row;
  dialogVisible.value = true;
};

//删除用户
const deleteById = async (row) => {
  ElMessageBox.confirm("此操作将永久删除该记录, 是否继续?", "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    const { code } = await DeleteSysRoleById(row.id);
    if (code === 200) {
      ElMessage.success("删除成功");
      pageParams.value.page = 1;
      fetchData();
    }
  });
};

//查询角色
const searchSysRole = () => {
  fetchData();
};

const defaultForm = {
  roleName: "",
  roleCode: "",
};

//提交
const sysRole = ref(defaultForm);
const submit = async () => {
  if (!sysRole.value.id) {
    const { code, data, message } = await SaveSysRole(sysRole.value);
    if (code === 200) {
      dialogVisible.value = false;
      ElMessage.success("添加成功");
      fetchData();
    }
  } else {
    const { code } = await UpdateSysRole(sysRole.value);
    if (code === 200) {
      dialogVisible.value = false;
      ElMessage.success("修改成功");
      fetchData();
    }
  }
};

//获取表格数据
const fetchData = async () => {
  const data = await GetSysRoleListByPage(
    pageParamsForm.value.pageNum,
    pageParamsForm.value.pageSize,
    queryDto.value
  );
  list.value = data.list;
  total.value = data.total;
};

const defaultProps = {
  children: "children",
  label: "title",
};

//分配菜单窗体开关
const dialogMenuVisible = ref(false);
//菜单数据
const sysMenuTreeList = ref([]);
// 树对象变量
const tree = ref();
// 默认选中的菜单数据集合
let roleId = ref();

//分配菜单
async function showAssignMenu(row) {
  dialogMenuVisible.value = true;
  roleId = row.id;

  const { data } = await GetSysRoleMenuIds(row.id);

  sysMenuTreeList.value = data.sysMenuList;
  tree.value.setCheckedKeys(data.roleMenuIds);
}

//保存菜单
async function doAssign() {
  //获取选中的节点
  const checkedNodes = tree.value.getCheckedNodes();
  const checkedNodesIds = checkedNodes.map((node) => {
    return {
      id: node.id,
      isHalf: 0,
    };
  });

  //获取半选中的节点
  const halfCheckedNodes = tree.value.getHalfCheckedNodes();
  const halfCheckedNodesIds = halfCheckedNodes.map((node) => {
    return {
      id: node.id,
      isHalf: 1,
    };
  });

  const menuIds = [...checkedNodesIds, ...halfCheckedNodesIds];

  const assignMenuDto = {
    roleId: roleId,
    menuIdList: menuIds,
  };

  const { code, message } = await DoAssignMenuIdToSysRole(assignMenuDto);
  if (code != 200) {
    ElMessage.error(message);
  } else {
    ElMessage.success("菜单分配成功");
  }

  dialogMenuVisible.value = false;
}
</script>

<style scoped>
.search-div {
  padding: 10px;
  margin-bottom: 10px;
  background-color: #fff;
  border: 1px solid #ebeef5;
  border-radius: 3px;
}

.tools-div {
  padding: 10px;
  margin: 10px 0;
  background-color: #fff;
  border: 1px solid #ebeef5;
  border-radius: 3px;
}
</style>
