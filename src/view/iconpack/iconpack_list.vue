<template>
  <div>
    <div class="container">
      <div class="header">
        <div class="title">图标包列表</div>
        <!--  Add Button  -->
        <el-button type="primary" @click="handleAdd">新建图标包</el-button>
      </div>

      <!--list table-->
      <el-table :data="iconpacks" v-loading="iconpackLoading">
        <el-table-column type="index" :index="indexMethod" width="80px" label="序号" />
        <el-table-column prop="id" label="ID" width="80px" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog width="60%" v-model="showEdit">
      <el-form :model="editIconpack" ref="form" label-position="right" label-width="100px" v-loading="formLoading">
        <el-form-item label="名称">
          <el-input v-model="editIconpack.name" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input autosize type="textarea" v-model="editIconpack.description" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">保 存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from 'vue'
import iconpackModel from '@/model/iconpack'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'iconpack_list',
  setup() {
    const iconpacks = ref([])
    const iconpackLoading = ref(false)
    const showEdit = ref(false)

    const editIconpackId = ref(0)
    const editIconpack = reactive({ name: '', description: '' })
    const form = ref(null)
    const listAssign = (a, b) => Object.keys(a).forEach(key => {
      a[key] = b[key] || a[key]
    })
    const formLoading = ref(false)

    onMounted(() => {
      getIconpacks()
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

    const getIconpack = async () => {
      try {
        formLoading.value = true
        const res = await iconpackModel.getIconpack(editIconpackId.value)
        listAssign(editIconpack, res)
        formLoading.value = false
      } catch (e) {
        formLoading.value = false
        if (e.code === 10020) {
          // editIconpack.value = null
        }
      }
    }

    const handleAdd = () => {
      showEdit.value = true
      editIconpackId.value = null
    }

    const handleEdit = id => {
      showEdit.value = true
      editIconpackId.value = id
      getIconpack()
    }

    const editClose = () => {
      showEdit.value = false
      editIconpackId.value = null
      getIconpacks()
    }

    const handleDelete = id => {
      ElMessageBox.confirm('此操作将永久删除该图标包, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await iconpackModel.deleteIconpack(id)
        if (res.code < window.MAX_SUCCESS_CODE) {
          ElMessage.success(`${res.message}`)
          await getIconpacks()
        }
      })
    }

    const indexMethod = index => index + 1

    // 提交表单
    const submitForm = async () => {
      form.value.validate(async valid => {
        if (valid) {
          let res = {}
          if (editIconpackId.value) {
            res = await iconpackModel.editIconpack(editIconpackId.value, editIconpack)
          } else {
            res = await iconpackModel.createIconPack(editIconpack)
          }
          editClose()
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
      iconpacks,
      iconpackLoading,
      showEdit,
      indexMethod,
      editClose,
      handleAdd,
      handleEdit,
      handleDelete,
      editIconpack,
      formLoading,
      form,
      submitForm,
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
