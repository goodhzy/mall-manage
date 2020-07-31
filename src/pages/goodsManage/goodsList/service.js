import request from '@/utils/request';

export async function queryGoodsList(params) {
  const res = await request('goods', {
    params:{
      pagenum: params.current,
      pagesize: params.pageSize,
      query: params.goods_name
    },
  });
  return {
    data: res.data.goods,
    total: res.data.total,
    success: res.meta.status === 200
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

export async function delGoods(id){
  return request(`goods/${id}`,{
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
