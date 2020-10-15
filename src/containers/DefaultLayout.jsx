import React, { Component } from 'react'
import { Route, Switch, Redirect, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Layout, BackTop, message } from 'antd'
import routes from '@/routes'
import { menuToggleAction } from '@/store/actionCreators'
import echarts from 'echarts/lib/echarts'
import avatar from '@/assets/images/user.jpg'
import menu from './menu'
import '@/style/layout.scss'
import utils from '../plugin/utils'

import AppHeader from './AppHeader.jsx'
import AppAside from './AppAside.jsx'
import AppFooter from './AppFooter.jsx'

const { Content } = Layout

class DefaultLayout extends Component {
    state = {
        avatar,
        show: true,
        menu: []
    }

    //是否登录
    isLogin = () => {
        if (!utils.getCookie('token')) {
            this.props.history.push('/login')
        } else {
            this.setState({
                //获取菜单
                menu: menu
            })
        }
    }

    loginOut = () => {
        utils.delCookie('token')
        this.props.history.push('/login')
        message.success('登出成功!')
    }

    componentDidMount() {
        this.isLogin()
    }

    componentDidUpdate() {
        let { pathname } = this.props.location

        // 菜单收缩展开时 echarts 图表的自适应
        if (pathname === '/' || pathname === '/index') {
            this.timer = setTimeout(() => {
                echarts.init(document.getElementById('bar')).resize()
                echarts.init(document.getElementById('line')).resize()
                echarts.init(document.getElementById('pie')).resize()
                echarts.init(document.getElementById('pictorialBar')).resize()
                echarts.init(document.getElementById('scatter')).resize()
            }, 500)
        } else {
            this.timer = null
        }
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer)
    }

    render() {
        let { menuClick, menuToggle } = this.props
        let { auth } = JSON.parse(localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : ''
        return (
            <Layout className='app'>
                <BackTop />
                {/*侧边栏*/}
                <AppAside menuToggle={menuToggle} menu={this.state.menu} />
                {/*右边栏*/}
                <Layout style={{ marginLeft: menuToggle ? '80px' : '200px', minHeight: '100vh' }}>
                    {/*右边头部*/}
                    <AppHeader
                        menuToggle={menuToggle}
                        menuClick={menuClick}
                        avatar={this.state.avatar}
                        show={this.state.show}
                        loginOut={this.loginOut}
                    />
                    {/*右边内容*/}
                    <Content className='content'>
                        <Switch>
                            {routes.map(item => {
                                return (
                                    <Route
                                        key={item.path}
                                        path={item.path}
                                        exact={item.exact}
                                        render={props =>
                                            !auth ? (
                                                <item.component {...props} />
                                            ) : item.auth && item.auth.indexOf(auth) !== -1 ? (
                                                <item.component {...props} />
                                            ) : (
                                                // 这里也可以跳转到 403 页面
                                                <Redirect to='/404' {...props} />
                                            )
                                        }></Route>
                                )
                            })}
                            <Redirect to='/404' />
                        </Switch>
                    </Content>
                    {/*右边底部*/}
                    <AppFooter />
                </Layout>
            </Layout>
        )
    }
}

const stateToProp = state => ({
    menuToggle: state.menuToggle
})

const dispatchToProp = dispatch => ({
    menuClick() {
        dispatch(menuToggleAction())
    }
})

export default withRouter(connect(stateToProp, dispatchToProp)(DefaultLayout))
