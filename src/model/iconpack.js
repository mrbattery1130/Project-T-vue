import _axios, {_delete, get, put} from "lin/plugin/axios";

class Iconpack {
  async createIconPack(data) {
    return _axios({
      method: 'post',
      url: 'v1/iconpack',
      data,
    })
  }

  async getIconpack(id) {
    const res = await get(`v1/iconpack/${id}`)
    return res
  }

  async getIconpacks() {
    return _axios({
      method: 'get',
      url: 'v1/iconpack',
      handleError: true,
    })
  }

  async editIconpack(id, info) {
    const res = await put(`v1/iconpack/${id}`, info)
    return res
  }

  async deleteIconpack(id,) {
    const res = await _delete(`v1/iconpack/${id}`)
    return res
  }
}

export default new Iconpack()
