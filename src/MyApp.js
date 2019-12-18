import React,{Component} from 'react';
import { message, Button } from 'antd';
import {BrowserRouter,Route} from 'react-router-dom';
import  Login from './pages/login/login'
import  Admin from './pages/admin/admin'


/*
* 应用根组件
* */


class MyApp extends Component  {

     handleClick = () => {
        message.info('This is a normal message');
    }
  render() {
    return (
        <div>
            {/*<Button type="primary" onClick={this.handleClick}>*/}
            {/*    Display normal message*/}
            {/*    <span>  根路径</span>*/}
            {/*</Button>*/}
            <BrowserRouter>
                <Route exact={true} path={"/login"} component={Login}></Route>
                <Route path={"/"}  component={Admin}></Route>
                {/*<Route exact={true}  path={"/"}  component={MyApp}></Route>*/}
            </BrowserRouter>
        </div>


    );
  }
}

export default MyApp;