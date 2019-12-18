import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {Menu, Icon, Button} from 'antd';
import logo from '../../assets/images/logo.png'
import './index.less'

import memoryUtils from "../../utils/memoryUtils";
import menuList from "../../config/menuConfig";

const SubMenu = Menu.SubMenu;

class LeftNav extends Component {


    /*
     根据menu的数据数组生成对应的标签数组
     使用map() + 递归调用
     */
    getMenuNodes_map = (menuList) => {
        // getMenuNodes= (menuList) => {
        return menuList.map(item => {
            /*
              {
                title: '首页', // 菜单标题名称
                key: '/home', // 对应的path
                icon: 'home', // 图标名称
                children: [], // 可能有, 也可能没有
              }

              <Menu.Item key="/home">
                <Link to='/home'>
                  <Icon type="pie-chart"/>
                  <span>首页</span>
                </Link>
              </Menu.Item>

              <SubMenu
                key="sub1"
                title={
                  <span>
                    <Icon type="mail"/>
                    <span>商品</span>
                  </span>
                }
              >
                <Menu.Item/>
                <Menu.Item/>
              </SubMenu>
            */
            if (!item.children) {
                return (
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon}/>
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                )
            } else {
                return (
                    <SubMenu
                        key={item.key}
                        title={
                            <span>
              <Icon type={item.icon}/>
              <span>{item.title}</span>
            </span>
                        }
                    >
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                )
            }

        })
    }
    /*
根据menu的数据数组生成对应的标签数组
使用reduce() + 递归调用
*/
    getMenuNodes = (menuList) => {
        // 得到当前请求的路由路径
        const path = this.props.location.pathname

        return menuList.reduce((pre, item) => {

            // 如果当前用户有item对应的权限, 才需要显示对应的菜单项
            // if (this.hasAuth(item)) {
            // if (!item.children) {
            // 向pre添加<Menu.Item>
            if (!item.children) {
                pre.push((
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon}/>
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                ))
            } else {
                //
                //     // 查找一个与当前请求路径匹配的子Item
                    const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
                //     // 如果存在, 说明当前item的子列表需要打开
                    if (cItem) {
                        this.openKey = item.key
                    }


                // 向pre添加<SubMenu>
                pre.push((
                    <SubMenu
                        key={item.key}
                        title={
                            <span>
              <Icon type={item.icon}/>
              <span>{item.title}</span>
            </span>
                        }
                    >
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                ))
                }
            // }

            return pre
        }, [])
    }
    /*
  在第一次render()之前执行一次
  为第一个render()准备数据(必须同步的)
   */
    componentWillMount () {
        this.menuNodes = this.getMenuNodes(menuList)
    }
    render() {
        // debugger
        // 得到当前请求的路由路径
        let path = this.props.location.pathname
        // console.log('rendder()',path)

        if(path.indexOf('/product')===0) { // 当前请求的是商品或其子路由界面
            path = '/product'
        }

        // 得到需要打开菜单项的key
        const openKey = this.openKey
        return (

            <div>
                <div className={"left-nav"}>
                    <Link to='/' className="left-nav-header">
                        <img src={logo} alt="logo"/>
                        <h1>管理后台</h1>
                    </Link>

                </div>
                <div style={{width: 200}}>

                    <Menu
                        // defaultSelectedKeys={[path]}
                        selectedKeys={[path]}
                        defaultOpenKeys={[openKey]}
                        mode="inline"
                        theme="dark"


                    >
                        {/*          <Menu.Item key="1">*/}
                        {/*              <Icon type="pie-chart"/>*/}
                        {/*              <span>首页</span>*/}
                        {/*          </Menu.Item>*/}
                        {/*          <SubMenu*/}
                        {/*              key="sub1"*/}
                        {/*              title={*/}
                        {/*                  <span>*/}
                        {/*  <Icon type="mail" />*/}
                        {/*  <span>商品</span>*/}
                        {/*</span>*/}
                        {/*              }*/}
                        {/*          >*/}
                        {/*              <Menu.Item key="5">*/}
                        {/*                  <Icon type="mail" />*/}
                        {/*                  <span>商品</span>*/}
                        {/*              </Menu.Item>*/}
                        {/*              <Menu.Item key="6">  <Icon type="mail" />*/}
                        {/*                  <span>商品</span>*/}
                        {/*              </Menu.Item>*/}

                        {/*          </SubMenu>*/}

                        {
                            // this.getMenuNodes(menuList)
                            this.menuNodes

                        }

                    </Menu>


                </div>

            </div>

        );
    }
}

// export default LeftNav;
/*
withRouter高阶组件:
包装非路由组件, 返回一个新的组件
新的组件向非路由组件传递3个属性: history/location/match
 */
export default withRouter(LeftNav)