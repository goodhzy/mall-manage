import request from '@/utils/request';

export async function queryOrderList({current,pageSize,filter,sorter,...restParmas}) {
  const res = await request('orders', {
    params:{
      pagenum: current,
      pagesize: pageSize,
      ...restParmas
    },
  });
  return {
    data: res.data.goods,
    total: res.data.total,
    success: res.meta.status === 200
  }
}

export async function putOrder({order_id,...restparmas}){
  return request(`orders/${order_id}`,{
    method: 'PUT',
    data: restparmas
  })
}

export async function queryLogistics(id='1106975712662'){
  return request(`/kuaidi/${id}`)
}