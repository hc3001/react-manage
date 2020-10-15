import request from '../plugin/axios'
//request 使用方式，url：路径，method： 方法， params：query（get用params），data：data（post用data，cacheRandom：是否启用接口缓存）

export function getLogin(query) {
    return request({
        url: 'mock/5df9f2121919976716350b0a/tcl/user/login',
        method: 'get',
        params: query
    })
}

export function addDatareport(data) {
    return request({
        url: '/api/user/info',
        method: 'post',
        data: data
    })
}
