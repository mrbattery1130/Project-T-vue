const iconpackRouter = {
  route: null,
  name: null,
  title: '图标包管理',
  type: 'folder',
  filePath: 'view/iconpack',
  icon: 'iconfont icon-tushuguanli',
  order: null,
  inNav: true,
  children: [
    {
      title: '图标包列表',
      type: 'view',
      name: 'IconpackList',
      route: '/iconpack/list',
      filePath: 'view/iconpack/iconpack_list.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
    {
      title: '图标包详情',
      type: 'view',
      name: 'IconpackList',
      route: '/iconpack/list',
      filePath: 'view/iconpack/iconpack_detail.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',

    },
  ]

}

export default iconpackRouter
