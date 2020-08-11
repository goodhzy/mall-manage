// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';

const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          authority: ['admin', 'user'],
          routes: [
            {
              path: '/',
              redirect: '/userManage/userList',
            },
            // {
            //   path: '/welcome',
            //   name: 'welcome',
            //   icon: 'smile',
            //   component: './Welcome',
            // },
            {
              path: '/admin',
              name: 'admin',
              icon: 'crown',
              component: './Admin',
              authority: ['admin'],
              routes: [
                {
                  path: '/admin/sub-page',
                  name: 'sub-page',
                  icon: 'smile',
                  component: './Welcome',
                  authority: ['admin'],
                },
              ],
            },
            // {
            //   name: 'list.table-list',
            //   icon: 'table',
            //   path: '/list',
            //   component: './ListTableList',
            // },
            {
              name: '用户管理',
              icon: 'table',
              path: './userManage',
              routes:[
                {
                  name: '用户列表',
                  icon: 'table',
                  path: '/userManage/userList',
                  component: './userManage/userList'
                }
              ]
            },
            {
              name: '权限管理',
              icon: 'table',
              path: '/permissonManage',
              routes:[
                {
                  name: '角色列表',
                  icon: 'table',
                  path: '/permissonManage/roleList',
                  component: './permissonManage/roleList'
                },
                {
                  name: '权限列表',
                  icon: 'table',
                  path: '/permissonManage/permissonList',
                  component: './permissonManage/permissonList'
                }
              ]
            },
            {
              name: '商品管理',
              icon: 'table',
              path: '/goodsManage',
              routes:[
                {
                  name: '商品列表',
                  icon: 'table',
                  path: '/goodsManage/goodsList',
                  component: './goodsManage/goodsList'
                },
                {
                  name: '分类参数',
                  icon: 'table',
                  path: '/goodsManage/categoryParmas',
                  component: './goodsManage/categoryParmas'
                },
                {
                  name: '商品分类',
                  icon: 'table',
                  path: '/goodsManage/goodsCateGory',
                  component: './goodsManage/goodsCateGory'
                },
                {
                  name: '商品创建',
                  icon: 'table',
                  path: '/goodsManage/goodsAdd',
                  component: './goodsManage/goodsList/components/CreateForm'
                }
              ]
            },
            {
              name: '数据统计',
              icon: 'table',
              path: '/statistics',
              routes:[
                {
                  name: '数据报表',
                  icon: 'table',
                  path: '/statistics/report',
                  component: './statistics/report'
                }
              ]
            },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
});
