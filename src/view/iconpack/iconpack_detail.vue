<template>
  <div class="container">
    <div class="header">
      <div class="title">图标包详情</div>
      <el-select v-model="id" @change="handleChange" filterable>
        <el-option
          v-for="item in iconpacks"
          :key="strMethod(item.id)"
          :label="item.name"
          :value="strMethod(item.id)"
        ></el-option>
      </el-select>
    </div>
    <el-table :data="icons" v-loading="iconLoading">
      <el-table-column type="index" :index="indexMethod" width="80px" label="序号"/>
      <el-table-column prop="id" label="ID" width="80px"/>
      <el-table-column label="URL">
        <template #default="scope">
          <el-image :key="scope.row.url" :src="scope.row.url" lazy>
            <template #error>
                <span>图片加载失败：<br/>{{scope.row.url}}</span>
            </template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="app.name" label="App名称"/>
    </el-table>

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
  </div>
</template>

<script>
import {onMounted, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import iconpackModel from '@/model/iconpack'
import iconModel from '@/model/icon'

export default {
  name: 'iconpack_detail',
  setup() {
    const route = useRoute()
    const router = useRouter()

    const id = ref(null)
    const iconpacks = ref([])
    const iconpackLoading = ref(false)
    const icons = ref([])
    const iconLoading = ref(false)

    const totalNum = ref(0)
    const pageCount = ref(10)
    const currentPage = ref(1)
    const refreshPagination = ref(false)

    onMounted(async () => {
      await getIconpacks()
      if (route.query.id) {
        id.value = route.query.id
        await getIcons()
      }
    })
    const getIconpacks = async () => {
      try {
        iconpackLoading.value = true
        iconpacks.value = await iconpackModel.getIconpacks()
        iconpackLoading.value = false
      } catch (e) {
        iconpackLoading.value = false
        if (e.code === 10020) {
          iconpacks.value = []
        }
      }
    }

    const getIcons = async () => {
      try {
        iconLoading.value = true
        refreshPagination.value = false

        const data = await iconModel.getIcons({
          count: pageCount.value,
          page: currentPage.value,
          iconpack_id: id.value,
        })
        icons.value = data.items
        totalNum.value = data.total
        pageCount.value = data.count
        currentPage.value = data.page

        iconLoading.value = false
        refreshPagination.value = true
      } catch (e) {
        iconLoading.value = false
        refreshPagination.value = true
        if (e.code === 10020) {
          icons.value = []
        }
      }
    }

    // 选择图标包
    const handleChange = () => {
      router.push({
        path: route.path, // '/iconpack/detail'
        query: {id: id.value},
      })
    }

    const indexMethod = index => index + 1

    const strMethod = number => number.toString()

    // 翻页
    const handleCurrentChange = async val => {
      currentPage.value = val
      await getIcons()
    }
    return {
      id,
      iconpacks,
      iconpackLoading,
      icons,
      handleChange,
      iconLoading,
      totalNum,
      pageCount,
      currentPage,
      refreshPagination,
      handleCurrentChange,
      indexMethod,
      strMethod,
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
