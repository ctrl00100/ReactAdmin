import React, {Component} from 'react';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom'
import storageUtils from '../../utils/storageUtils'
import memoryUtils from '../../utils/memoryUtils'
import {Layout} from 'antd';
import LeftNav from "../../components/left-nav";
import HeaderMy from "../../components/header";
import Category from "../category/category";
import Bar from "../charts/bar";
import Line from "../charts/line";
import Pie from "../charts/pie";
import NotFound from "../not-found/not-found";
import Order from "../order/order";
import User from "../user/user";
import Product from "../product/product";
import Home from '../home/home';
import Role from '../role/role';


const {Header, Footer, Sider, Content} = Layout;


/*后台管理路由组件*/
class Admin extends Component {
    render() {
        const user = memoryUtils.user
        // 如果内存没有存储user ==> 当前没有登陆
        if (!user || !user.id) {
            // 自动跳转到登陆(在render()中)
            // 自动跳转到登陆(在render()中)
            return <Redirect to='/login'/>
        }
        return (
            <div>
                <Layout style={{height: '100vh'}}>
                    <Sider>

                        <LeftNav></LeftNav>
                    </Sider>
                    <Layout>
                        {/*<Header>*/}

                        <HeaderMy></HeaderMy>
                        {/*</Header>*/}
                        <Content style={{margin: 10, backgroundColor: '#fff'}}>
                            <Switch>
                                <Redirect from='/' exact to='/home'/>
                                <Route path='/home' component={Home}/>
                                <Route path='/category' component={Category}/>
                                <Route path='/product' component={Product}/>
                                <Route path='/user' component={User}/>
                                <Route path='/role' component={Role}/>
                                <Route path="/charts/bar" component={Bar}/>
                                <Route path="/charts/pie" component={Pie}/>
                                <Route path="/charts/line" component={Line}/>
                                <Route path="/order" component={Order}/>
                                <Route component={NotFound}/>
                            </Switch>
                        </Content>
                        {/*<Footer>Footer</Footer>*/}
                        <Footer style={{textAlign: 'center', color: '#cccccc'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>

                    </Layout>
                </Layout>
                {/*Admin hello{user.username}*/}
            </div>
        );
    }
}

export default Admin;