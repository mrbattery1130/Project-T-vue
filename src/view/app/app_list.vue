<template>
  <div>
    <div class="container">
      <div class="header">
        <div class="title">App列表</div>
      </div>
      <!--  Add Button  -->
      <el-button type="primary">新建App</el-button>
      <!--    list table-->
      <el-table :data="apps" v-loading="appLoading">
        <el-table-column type="index" :index="indexMethod" label="序号"/>
        <el-table-column prop="name" label="App名称"/>
        <el-table-column prop="name_en" label="App英文名"/>
        <el-table-column prop="catalogue.name" label="分类"/>
        <el-table-column label="包名"/>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button plain size="mini" type="primary"
                       @click="handleEdit(scope.row.id)">编辑
            </el-button>
            <el-button
              plain size="mini" type="danger"
              @click="handleDelete(scope.row.id)">删除
            </el-button>
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
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <!-- 编辑页面 -->
    <!--    <book-modify v-else @editClose="editClose" :editBookId="editBookId"></book-modify>-->
  </div>
</template>

<script>
import {onMounted, ref} from "vue";
import appModel from '@/model/app'
import appRelModel from '@/model/app_rel'
import {ElMessage, ElMessageBox} from "element-plus";

export default {
  name: "app_list",
  setup() {
    const apps = ref([])
    const editAppId = ref(1)
    const appLoading = ref(false);
    const showEdit = ref(false)

    const totalNum = ref(0)
    const pageCount = ref(0)
    const currentPage = ref(0)
    const refreshPagination = ref(false);

    onMounted(() => {
      getApps()
    })

    const getApps = async () => {
      try {
        appLoading.value = true
        refreshPagination.value = false

        const data = await appModel.getApps()
        apps.value = data.items
        totalNum.value = data.total
        pageCount.value = data.total_page
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

    const handleEdit = id => {
      showEdit.value = true
      editAppId.value = id
    }

    const editClose = () => {
      showEdit.value = false
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
    /**
     * 翻页
     */
    const handleCurrentChange = async val => {
      currentPage.value = val
      await getApps()
    }
    return {
      apps,
      appLoading,
      indexMethod,
      editAppId,
      showEdit,
      editClose,
      handleEdit,
      handleDelete,
      totalNum,
      pageCount,
      currentPage,
      refreshPagination,
      handleCurrentChange,
    }
  }
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
