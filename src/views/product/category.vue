<template>
  <div class="tools-div">
    <el-button type="success" size="small" @click="exportData">导出</el-button>
    <el-button type="primary" size="small" @click="importData">导入</el-button>
  </div>

  <!---懒加载的树形表格-->
  <el-table
    :data="list"
    style="width: 100%"
    row-key="id"
    border
    lazy
    :load="fetchData"
    :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
  >
    <el-table-column prop="name" label="分类名称" />
    <el-table-column prop="imageUrl" label="图标" #default="scope">
      <img :src="scope.row.imageUrl" width="50" />
    </el-table-column>
    <el-table-column prop="orderNum" label="排序" />
    <el-table-column prop="status" label="状态" #default="scope">
      {{ scope.row.status == 1 ? "正常" : "停用" }}
    </el-table-column>
    <el-table-column prop="createTime" label="创建时间" />
  </el-table>

  <el-dialog v-model="dialogImportVisible" title="导入" width="30%">
    <el-form label-width="120px">
      <el-form-item label="分类文件">
        <el-upload
          class="upload-demo"
          action="http://localhost:8080/product/category/importData"
          :on-success="onUploadSuccess"
          :headers="headers"
        >
          <el-button type="primary">上传</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { FindCategoryByParentId, ExportCategoryData } from "@/api/category";
import { useApp } from "@/pinia/modules/app";
import { ElMessage } from "element-plus";

// 定义list属性模型
const list = ref([]);

onMounted(async () => {
  const { data } = await FindCategoryByParentId(0);
  list.value = data;
});

// 加载数据的方法
const fetchData = async (row, treeNode, resolve) => {
  // 向后端发送请求获取数据
  const { data } = await FindCategoryByParentId(row.id);

  // 返回数据
  resolve(data);
};

/**
 * 导出表格
 */
function exportData() {
  ExportCategoryData().then((res) => {
    const blob = new Blob([res]);

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "分类数据.xlsx";

    link.click();
  });
}

// 文件上传相关变量以及方法定义
const dialogImportVisible = ref(false);
const headers = {
  // 从pinia中获取token，在进行文件上传的时候将token设置到请求头中
  token: useApp().authorization.token,
};

function importData() {
  dialogImportVisible.value = true;
}

// 上传文件成功以后要执行方法
const onUploadSuccess = async (response, file) => {
  ElMessage.success("操作成功");
  dialogImportVisible.value = false;
  const { data } = await FindCategoryByParentId(0);
  list.value = data;
};
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
