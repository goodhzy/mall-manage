import request from '@/utils/request';

export async function queryCategoriesList(params) {
  const res = await request('categories', {
    params:{
      pagenum: params.current,
      pagesize: params.pageSize,
    },
  });
  return {
    data: res.data.result,
    total: res.data.total,
    success: res.meta.status === 200
  }
}

export async function queryCategoriesListAll(type){
  return request('categories',{
    data: {type}
  })
}

export async function addCategory(params){
  return request(`categories`,{
    method: 'POST',
    data:params
  })
}

export async function putCategory({id,...restparmas}){
  return request(`categories/${id}`,{
    method: 'PUT',
    data:restparmas
  })
}

export async function delCategory(id){
  return request(`categories/${id}`,{
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
