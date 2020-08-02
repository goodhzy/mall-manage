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
export async function delGoods(id){
  return request(`goods/${id}`,{
    method: 'DELETE',
  })
}

export async function putGoods({goods_id,...restparmas}){
  return request(`goods/${goods_id}`,{
    method: 'PUT',
    data: restparmas
  })
}

export async function queryGoodsDec(goods_id){
  return request(`goods/${goods_id}`)
}