import request from '@/utils/request'

export async function report(){
    return request('reports/type/1')
}