import _axios, { _delete, get, put } from 'lin/plugin/axios'

class Icon {
  async createIcon(data) {
    return _axios({
      method: 'post',
      url: 'v1/icon',
      data,
    })
  }

  async getIcon(id) {
    const res = await get(`v1/icon/${id}`)
    return res
  }

  async getIcons({ count = this.uCount, page = this.uPage, iconpack_id, app_id }) {
    const res = await get('v1/icon', {
      count,
      page,
      iconpack_id,
      app_id,
    })
    return res
  }

  async editIcon(id, info) {
    const res = await put(`v1/icon/${id}`, info)
    return res
  }

  async deleteIcon(id) {
    const res = await _delete(`v1/icon/${id}`)
    return res
  }
}

export default new Icon()
