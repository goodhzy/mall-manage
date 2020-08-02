import request from '@/utils/request';

export async function queryAttributesList({catId,...params}) {
  const res = await request(`categories/${catId}/attributes`, {
    params:{
      pagenum: params.current ? params.current : undefined,
      pagesize: params.pageSize ? params.pageSize : undefined,
      sel: params.sel
    },
  });
  return {
    data: res.data,
    success: res.meta.status === 200
  }
}

export async function queryAttrParmasList({catId,attrId,...parmas}){
  return request(`categories/${catId}/attributes/${attrId}`,{
    method: 'get',
    data:parmas
  })
}

export async function putAttrParmas({catId,attrId,...restparmas}){
  return request(`categories/${catId}/attributes/${attrId}`,{
    method: 'PUT',
    data:restparmas
  })
}

export async function addAttributes({catId,...restparmas}){
  return request(`categories/${catId}/attributes`,{
    method: 'POST',
    data:restparmas
  })
}

export async function delAttributes({catId,attr_id}){
  return request(`categories/${catId}/attributes/${attr_id}`,{
    method: 'DELETE'
  })
}
