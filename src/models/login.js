import { stringify } from 'querystring';
import { history } from 'umi';
import { fakeAccountLogin } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    *login({ payload }, { call, put }) {
      try {
        const response = yield call(fakeAccountLogin, payload);
        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });
        yield put({
          type: 'setUserInfo',
          payload: response.data,
        });
          localStorage.setItem('token', response.data.token)
          localStorage.setItem('userInfo', JSON.stringify(response.data))
          const urlParams = new URL(window.location.href);
          const params = getPageQuery();
          let { redirect } = params;

          if (redirect) {
            const redirectUrlParams = new URL(redirect);

            if (redirectUrlParams.origin === urlParams.origin) {
              redirect = redirect.substr(urlParams.origin.length);

              if (redirect.match(/^\/.*#/)) {
                redirect = redirect.substr(redirect.indexOf('#') + 1);
              }
            } else {
              window.location.href = '/';
              return;
            }
          }
          history.replace(redirect || '/');
      } catch (error) {
        console.log(error);
      }
    },

    logout() {
      localStorage.setItem('token','')
      history.replace('/user/login')
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return { ...state, status: payload.status};
    },
    setUserInfo(state,{payload}){
      return {...state, userInfo: payload}
    }
  },
};
export default Model;
