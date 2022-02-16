import _axios, {get, put, _delete} from '@/lin/plugin/axios'

class AppRel {
  async createAppRel(data) {
    return _axios({
      method: 'post',
      url: 'v1/app/app_rel',
      data,
    })
  }

  async getAppRel(id) {
    const res = await get(`v1/app/app_rel/${id}`)
    return res
  }

  async editAppRel(id, info) {
    const res = await put(`v1/app/app_rel/${id}`, info)
    return res
  }

  async deleteAppRel(id) {
    const res = await _delete(`v1/app/app_rel/${id}`)
    return res
  }

  // async getAppRels() {
  //   return _axios({
  //     method: 'get',
  //     url: 'v1/app/app_rel',
  //     handleError: true,
  //   })
  // }
  async getAppRelsByApp(id) {
    const res = await get(`v1/app/app_rels_by_app/${id}`)
    return res
  }
}

export default new AppRel()
