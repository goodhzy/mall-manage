import request from '@/utils/request';

export async function queryRoleList() {
  const res = await request('roles');
  return {
    data: res.data,
    success: res.meta.status === 200,
  };
}

export async function addRole(data) {
  return request('roles', {
    method: 'POST',
    data,
  });
}

export async function putRole({ id, ...restparmas }) {
  return request(`roles/${id}`, {
    method: 'PUT',
    data: restparmas,
  })
}

export async function delRole(id) {
  return request(`roles/${id}`, {
    method: 'DELETE',
  });
}

export async function queryPermissonTree() {
  return request('rights/tree');
}

export async function setRolesPer({id,...restparmas}){
  return request(`roles/${id}/rights`,{
    method: 'POST',
    data:restparmas
  })
}

/**
 * 
 * @param {*} rid 角色id
 * @param {*} pid 权限id
 */
export async function delRolePer(rid,pid){
  return request(`roles/${rid}/rights/${pid}`,{
    method:'DELETE'
  })
}