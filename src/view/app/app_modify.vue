<template>
  <div class="container">
    <div class="title">
      <span>{{ appId ? '编辑App' : '创建App' }}</span>
      <span class="back" @click="back"> <i class="iconfont icon-fanhui"></i> 返回 </span>
    </div>

    <div class="wrap">
      <el-form :model="editApp" ref="form" label-position="right" label-width="100px" v-loading="formLoading">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="ID">{{ appId ? appId : '未定义' }}</el-form-item>
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
        <el-row>
          <el-form-item class="submit">
            <el-button type="primary" @click="submitForm">保 存</el-button>
            <!--            <el-button @click="resetForm">重 置</el-button>-->
          </el-form-item>
        </el-row>

        <el-form-item label="App发行版" v-if="appId">
          <el-button type="primary" @click="handleAddAppRel">新增App发行版</el-button>
          <el-table :data="editAppRels" v-loading="appRelsLoading">
            <el-table-column prop="id" label="ID" width="80px" />
            <el-table-column prop="package_name" label="包名" />
            <el-table-column prop="launch_name" label="启动类" />
            <el-table-column label="操作">
              <template #default="scope">
                <el-button size="mini" type="primary" @click="handleEditAppRel(scope.row.id)">编辑</el-button>
                <el-button size="mini" type="danger" @click="handleDeleteAppRel(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog v-model="showEdit" :title="editAppRelId ? '编辑App发行版' : '创建App发行版'" width="50%">
      <el-form
        :model="editAppRel"
        ref="formAppRel"
        label-position="right"
        label-width="100px"
        v-loading="formAppRelLoading"
      >
        <el-form-item label="包名">
          <el-input v-model="editAppRel.package_name" />
        </el-form-item>
        <el-form-item label="启动类">
          <el-input v-model="editAppRel.launch_name" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitAppRelForm">保 存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from 'vue'
import appModel from '@/model/app'
import appRelModel from '@/model/app_rel'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'AppModify',
  props: {
    editAppId: {
      type: Number,
      default: null,
    },
  },
  setup(props, context) {
    const appId = ref(0)
    const editApp = reactive({
      name: '',
      name_en: '',
      catalogue_id: 1,
      developer_name: '',
      description: '',
      priority: 999,
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

    const showEdit = ref(false)

    const editAppRelId = ref(0)
    const editAppRel = reactive({ app_id: 0, package_name: '', launch_name: '' })
    const formAppRel = ref(null)
    const formAppRelLoading = ref(false)

    onMounted(() => {
      getCatalogues()
      if (props.editAppId) {
        appId.value = props.editAppId
        getApp()
        getAppRels()
      }
    })

    const getApp = async () => {
      formLoading.value = true
      const res = await appModel.getApp(appId.value)
      listAssign(editApp, res)
      formLoading.value = false
    }

    const getCatalogues = async () => {
      catalogueLoading.value = true
      const data = await appModel.getCatalogues()
      catalogues.value = data
      catalogueLoading.value = false
    }

    const getAppRels = async () => {
      appRelsLoading.value = true
      const data = await appRelModel.getAppRelsByApp(appId.value)
      editAppRels.value = data
      appRelsLoading.value = false
    }

    const getAppRel = async () => {
      formAppRelLoading.value = true
      const data = await appRelModel.getAppRel(editAppRelId.value)
      listAssign(editAppRel, data)
      formAppRelLoading.value = false
    }

    const back = () => {
      context.emit('editClose')
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
          if (appId.value) {
            res = await appModel.editApp(appId.value, editApp)
          } else {
            res = await appModel.createApp(editApp)
          }
          // if (res.code < window.MAX_SUCCESS_CODE) {
          //   ElMessage.success(`${res.message}`)
          //
          // }
          if (res.id) {
            appId.value = res.id
            await getApp()
            await getAppRels()
          }
        } else {
          console.error('error submit!!')
          ElMessage.error('请将信息填写完整')
        }
      })
    }
    const handleAddAppRel = () => {
      showEdit.value = true
      editAppRelId.value = null

      editAppRel.package_name = ''
      editAppRel.launch_name = ''
    }
    const handleEditAppRel = id => {
      showEdit.value = true
      editAppRelId.value = id
      getAppRel()
    }
    const handleDeleteAppRel = id => {
      ElMessageBox.confirm('此操作将永久删除该App发行版, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await appRelModel.deleteAppRel(id)
        if (res.code < window.MAX_SUCCESS_CODE) {
          ElMessage.success(`${res.message}`)
          await getApp()
          await getAppRels()
        }
      })
    }
    // 提交表单
    const submitAppRelForm = async () => {
      formAppRel.value.validate(async valid => {
        if (valid) {
          editAppRel.app_id = appId.value
          let res = {}
          if (editAppRelId.value) {
            res = await appRelModel.editAppRel(editAppRelId.value, editAppRel)
          } else {
            res = await appRelModel.createAppRel(editAppRel)
          }
          showEdit.value = false
          await getApp()
          await getAppRels()
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
      back,
      form,
      appId,
      editApp,
      submitForm,
      resetForm,
      formLoading,
      catalogues,
      catalogueLoading,
      editAppRels,
      appRelsLoading,
      handleAddAppRel,
      handleEditAppRel,
      handleDeleteAppRel,
      showEdit,
      editAppRelId,
      editAppRel,
      formAppRel,
      formAppRelLoading,
      submitAppRelForm,
    }
  },
}
</script>

<style lang="scss" scoped>
.container {
  .title {
    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-weight: 500;
    text-indent: 40px;
    border-bottom: 1px solid #dae1ec;

    .back {
      float: right;
      margin-right: 40px;
      cursor: pointer;
    }
  }

  .wrap {
    padding: 20px;
  }

  .submit {
    float: left;
  }
}
</style>
