import request from '@/utils/request';

export async function queryPermissonList() {
  const res = await request('rights/list');
  return {
    data: res.data,
    success: res.meta.status === 200
  }
}