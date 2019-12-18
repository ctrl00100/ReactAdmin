import React, {Component} from 'react';
import {reqLogin} from "../../api"
import {Redirect} from "react-router-dom"
import "./login.less"
import logo from './images/logo.png'
import {Form, Icon, Input, Button, Checkbox,message} from 'antd';
import storageUtils from '../../utils/storageUtils'
import memoryUtils from '../../utils/memoryUtils'


/*登陆路由组件*/
class Login extends Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                // const {username, password} = values;
                // reqLogin(username, password).then(response=>{
                //     console.log("成功了",response.data)
                // }).catch(error=>{
                //     console.log("没有成功了",error)
                // })
                // console.log('Received values of form: ', values);
            //     const {username, password} = values;
            //     try{
            //         const response= await reqLogin(username, password)
            //
            //         console.log("ok",response.data)
            //
            //     }catch (error) {
            //         console.log("请求错误",error)
            //
            //     }
            //
            // }else {
            //     console.log("检验失败")
                // console.log('提交登陆的ajax请求', values)
                // 请求登陆
                const {username, password} = values
                const result = await reqLogin(username, password) // {status: 0, data: user}  {status: 1, msg: 'xxx'}
                // console.log('请求成功', result)
                if (result.status===0) { // 登陆成功
                    // 提示登陆成功
                    message.success('登陆成功')

                    // 保存user
                    const user = result.data
                    memoryUtils.user = user // 保存在内存中
                    storageUtils.saveUser(user) // 保存到local中

                    // 跳转到管理界面 (不需要再回退回到登陆)
                    this.props.history.replace('/home')
                    // this.props.history.push('/')

                } else { // 登陆失败
                    // 提示错误信息
                    message.error(result.msg)
                }

            } else {
                console.log('检验失败!')
            }
        });
    };
    render() {
        // 如果用户已经登陆, 自动跳转到管理界面
        const user = memoryUtils.user
        if(user && user._id) {
            return <Redirect to='/admin'/>
        }

        // 得到具强大功能的form对象
        const { getFieldDecorator } = this.props.form;

        return (
            <div className={"login"} >
                <header className={"login-header"}>
                    <img src={logo} alt="logo"/>
                    <h1> React项目:后台管理系统</h1>
                </header>
                <section className={"login-content"}>
                    <h2>用户登陆</h2>
                    <div><Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            {getFieldDecorator('username', {
                                rules: [
                                    {required: true, whitespace: true, message: '必须输入用户名'},
                                    {min: 4, message: '用户名必须大于 4 位'},
                                    {max: 12, message: '用户名必须小于 12 位'},
                                    {pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须包含英文、数组或下划线组成'}
                                ],
                                initialValue:"admin"
                            })(
                                <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="Username"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: 'Please input your Password!' }],
                                initialValue:"admin"
                            })(
                                <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="Password"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>

                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Log in
                            </Button>

                        </Form.Item>
                    </Form></div>
                </section>
            </div>
        );
    }
}

/*const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(NormalLoginForm);

ReactDOM.render(<WrappedNormalLoginForm />, mountNode);*/

const WrapLogin=Form.create()(Login)
export default WrapLogin;