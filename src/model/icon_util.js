import { get } from '@/lin/plugin/axios'

// 我们通过 class 这样的语法糖使模型这个概念更加具象化，其优点：耦合性低、可维护性。
class IconUtil {
  // 类中的方法可以代表一个用户行为
  // async searchIcon(package_name) {
  //     return _axios({
  //         method: 'get',
  //         url: 'v1/icon_util/search',
  //         data: { "package_name": package_name },
  //     })
  // }
  async searchIcon(packageName) {
    const res = await get('v1/icon_util/search',
      { package_name: packageName })
    return res
  }
}

export default new IconUtil()
