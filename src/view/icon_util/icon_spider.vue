<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="packageNameInput"
        placeholder="输入包名"
        autocomplete="text"
        class="filter-item"
        style="width: 300px"
        clearable
        @keyup.enter="searchIcons(packageNameInput, $event)"
      />
      <el-button
        type="primary"
        icon="search"
        @click="searchIcons(packageNameInput, $event)"
        class="filter-item"
        style="width: 200px"
        :loading="iconDataLoading">
        搜索图标
      </el-button>
    </div>

    <el-table
      v-loading="iconDataLoading" :data="iconData"
      border fit style="width: 100%">
      <el-table-column prop="app_store" label="应用商店" align="center"></el-table-column>

      <el-table-column label="图标" align="center">
        <template #default="scope">
          <el-image :fit="fill" style="width: 100%"
                    v-bind:src="scope.row.app_icon_url" width="300px"/>
        </template>
      </el-table-column>

      <el-table-column label="应用名" align="center">
        <template #default="scope">
          <el-link type="primary" v-bind:href="scope.row.app_url"
                   target="_blank" :underline="false">
            {{ scope.row.app_name }}
          </el-link>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>
<script>
import IconUtil from '@/model/icon_util'
import {onMounted, ref} from "vue";

export default {
  setup() {
    const iconData = ref([])
    const iconDataLoading = ref(false)
    const packageNameInput = ref("")
    onMounted(() => {

    })

    const searchIcons = async (packageNameInput) => {
      try {
        iconDataLoading.value = true
        iconData.value = await IconUtil.searchIcon(packageNameInput)
        iconDataLoading.value = false
      } catch (error) {
        iconDataLoading.value = false
        if (error.code === 10020) {
          iconData.value = []
        }
      }
    }

    return {
      iconData,
      iconDataLoading,
      packageNameInput,
      searchIcons,
    }
  }
}
</script>
