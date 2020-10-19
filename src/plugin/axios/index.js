import axios from 'axios'
// 进度条
import NProgress from 'nprogress'
import { createHashHistory } from 'history'
import 'nprogress/nprogress.css'
import { message } from 'antd'
import utils from '../../utils/index'

NProgress.configure({ showSpinner: false })
const history = createHashHistory()

const instance = axios.create({
    //后端做超时设置，前端不用设置
    // timeout: 5000
    baseURL: '/'
})

// 显示错误
function errorLog(err) {
    message.error({
        content: err.message,
        duration: 1.5,
        key: 'error'
    })
}

// 设置post请求头
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// 添加请求拦截器
instance.interceptors.request.use(
    config => {
        // 将 token 添加到请求头
        const token = utils.getCookie('token')
        NProgress.start()
        //通过加cacheRandom字段改接口缓存
        if (config.method === 'get' && config.cacheRandom) {
            const t = Date.now()
            config.url = `${config.url}?random=${t}`
        }
        if (!/^https:\/\/|http:\/\//.test(config.url)) {
            if (token) {
                config.headers['token'] = token
            }
        }
        return config
    },
    error => {
        // 发送失败
        return Promise.reject(error)
    }
)

// 添加响应拦截器
instance.interceptors.response.use(
    response => {
        const res = response.data
        //和后端协商返回2为未登录，其他非0一律为报错，红色弹窗处理
        if (res.code !== 0) {
            NProgress.done()
            if (res.code === 2) {
                utils.delCookie('token')
                history.push('/login')
            } else {
                message.error({
                    content: res.msg,
                    duration: 2
                })
            }
            return Promise.reject(res.msg)
        } else {
            NProgress.done()
            return res
        }
    },
    error => {
        // 相应错误处理
        var data = error.response.data
        NProgress.done()
        if (error.response && error.response.status === 500) {
            history.push('/500')
            errorLog(new Error(`系统错误!`), data)
        } else if (error.response && error.response.status === 404) {
            history.push('/404')
            errorLog(new Error(`网络超时!`), data)
        } else if (error.message && error.message.indexOf('timeout') > -1) {
            errorLog(new Error(`网络超时!`), data)
        } else {
            errorLog(new Error(`网络错误!`), data)
        }
        return Promise.reject(error)
    }
)

export default instance
