<template>
  <div>
    <div class="container">
      <div class="header">
        <div class="title">App列表</div>
        <!--  Add Button  -->
        <el-button type="primary" @click="handleAdd">新建App</el-button>
      </div>
      <!--    list table-->
      <el-table :data="apps" v-loading="appLoading">
        <el-table-column type="index" :index="indexMethod" width="80px" label="序号" />
        <el-table-column prop="id" label="ID" width="80px" />
        <el-table-column prop="name" label="App名称" />
        <el-table-column prop="name_en" label="App英文名" />
        <el-table-column prop="catalogue.name" label="分类" />
        <el-table-column label="包名">
          <template #default="scope">
            <el-tag effect="plain" type="info" v-for="n in scope.row.package_names" :key="n"> {{ n }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        :total="totalNum"
        :background="true"
        :page-size="pageCount"
        v-if="refreshPagination"
        :current-page="currentPage"
        layout="prev, pager, next, jumper"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
    <!-- 编辑页面 -->
    <el-dialog v-model="showEdit" :title="editAppId ? '编辑App' : '创建App'">
      <el-form :model="editApp" ref="form" label-position="right" label-width="100px" v-loading="formLoading">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="ID">{{ editAppId ? editAppId : '未定义' }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分类">
              <el-select v-model="editApp.catalogue_id" filterable v-loading="catalogueLoading">
                <el-option v-for="c in catalogues" :label="c.name" :value="c.id" :key="c.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="App名称">
              <el-input v-model="editApp.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="App英文名">
              <el-input v-model="editApp.name_en" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开发者">
              <el-input v-model="editApp.developer_name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="优先级">
              <el-input v-model="editApp.priority" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="描述">
              <el-input autosize type="textarea" v-model="editApp.description" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item class="submit">
          <el-button type="primary" @click="submitForm">保 存</el-button>
          <el-button @click="resetForm">重 置</el-button>
        </el-form-item>

        <el-form-item label="App发行版">
          <el-table :data="editAppRels" v-loading="appRelsLoading">
            <el-table-column prop="id" label="ID" width="80px" />
            <el-table-column prop="package_name" label="包名" />
            <el-table-column prop="launch_name" label="启动类" />
          </el-table>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from 'vue'
import appModel from '@/model/app'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'app_list',
  setup() {
    const apps = ref([])
    const appLoading = ref(false)
    const showEdit = ref(false)

    const totalNum = ref(0)
    const pageCount = ref(10)
    const currentPage = ref(1)
    const refreshPagination = ref(false)

    const editAppId = ref(0)
    const editApp = reactive({
      name: '',
      name_en: '',
      catalogue_id: 0,
      developer_name: '',
      description: '',
      priority: 0,
    })
    const form = ref(null)
    const listAssign = (a, b) => Object.keys(a).forEach(key => {
      a[key] = b[key] || a[key]
    })
    const formLoading = ref(false)
    const catalogueLoading = ref(false)
    const catalogues = ref([])

    const editAppRels = ref([])
    const appRelsLoading = ref(false)

    onMounted(() => {
      getApps()
    })

    const getApps = async () => {
      try {
        appLoading.value = true
        refreshPagination.value = false

        const data = await appModel.getApps({
          count: pageCount.value,
          page: currentPage.value,
        })
        apps.value = data.items
        totalNum.value = data.total
        pageCount.value = data.count
        currentPage.value = data.page

        appLoading.value = false
        refreshPagination.value = true
      } catch (e) {
        appLoading.value = false
        refreshPagination.value = false
        if (e.code === 10020) {
          apps.value = []
        }
      }
    }

    const getApp = async () => {
      formLoading.value = true
      const res = await appModel.getApp(editAppId.value)
      listAssign(editApp, res)
      formLoading.value = false
    }

    const getCatalogues = async () => {
      catalogueLoading.value = true
      const data = await appModel.getCatalogues()
      catalogues.value = data
      catalogueLoading.value = false
    }

    const handleAdd = () => {
      showEdit.value = true
      editAppId.value = null
      getCatalogues()
    }

    const handleEdit = id => {
      showEdit.value = true
      editAppId.value = id
      getApp()
      getCatalogues()
    }

    const editClose = () => {
      showEdit.value = false
      editAppId.value = null
      getApps()
    }

    const handleDelete = id => {
      ElMessageBox.confirm('此操作将永久删除该App, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await appModel.deleteApp(id)
        if (res.code < window.MAX_SUCCESS_CODE) {
          ElMessage.success(`${res.message}`)
          await getApps()
        }
      })
    }
    const indexMethod = index => index + 1

    // 翻页
    const handleCurrentChange = async val => {
      currentPage.value = val
      await getApps()
    }
    // 重置表单
    const resetForm = () => {
      form.value.resetFields()
    }

    // 提交表单
    const submitForm = async () => {
      form.value.validate(async valid => {
        if (valid) {
          let res = {}
          if (editAppId.value) {
            res = await appModel.editApp(editAppId.value, editApp)
            editClose()
          } else {
            res = await appModel.createApp(editApp)
            editClose()
          }
          if (res.code < window.MAX_SUCCESS_CODE) {
            ElMessage.success(`${res.message}`)
          }
        } else {
          console.error('error submit!!')
          ElMessage.error('请将信息填写完整')
        }
      })
    }

    return {
      apps,
      appLoading,
      indexMethod,
      showEdit,
      editClose,
      handleAdd,
      handleEdit,
      handleDelete,
      totalNum,
      pageCount,
      currentPage,
      refreshPagination,
      form,
      handleCurrentChange,
      editAppId,
      editApp,
      submitForm,
      resetForm,
      formLoading,
      catalogues,
      catalogueLoading,
      editAppRels,
      appRelsLoading,
    }
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 30px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      height: 59px;
      line-height: 59px;
      color: $parent-title-color;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }
}
</style>
