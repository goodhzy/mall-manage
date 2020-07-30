import request from '@/utils/request';
import {qs} from 'querystring'

export async function queryUserList(params) {
  const res = await request('users', {
    params:{
      pagenum: params.current,
      pagesize: params.pageSize,
      query: params.username
    },
  });
  return {
    data: res.data.users,
    total: res.data.totalpage,
    success: !res.errno
  }
}

export async function addUser(params){
  return request(`users`,{
    method: 'POST',
    data:params
  })
}

export async function putUser({id,username,...restparmas}){
  return request(`users/${id}`,{
    method: 'PUT',
    data:restparmas
  })
}

export async function delUser(id){
  return request(`users/${id}`,{
    method: 'DELETE',
  })
}

export async function getRoles(){
  return request(`roles`,{
    method: 'GET',
  })
}

export async function putUserType({uId,type}){
  return request(`users/${uId}/state/${type}`,{
    method: 'PUT',
  })
}

export async function setUserPer({id,rid}){
  return request(`users/${id}/role`,{
    method: 'PUT',
    data:{rid}
  })
}
