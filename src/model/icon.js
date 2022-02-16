import _axios, {_delete, get, put} from "lin/plugin/axios";

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

  async getIcons() {
    return _axios({
      method: 'get',
      url: 'v1/icon',
      handleError: true,
    })
  }

  async editIcon(id, info) {
    const res = await put(`v1/icon/${id}`, info)
    return res
  }

  async deleteIcon(id,) {
    const res = await _delete(`v1/icon/${id}`)
    return res
  }
}

export default new Icon()
