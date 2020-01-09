import React, {Component} from 'react';
import {
 Card,
    Button,
    Table,
    Modal,
    message
} from 'antd'
import memoryUtils from "../../utils/memoryUtils"

import {reqRoles, reqAddRole, reqUpdateRole} from '../../api'
import AddForm from './add-form'
import AuthForm from './auth-form'
import {PAGE_SIZE} from "../../utils/constants";
import UpdateForm from "../category/update-form";
export default class Role extends Component {
    // roles:[
    //     {
    //         "menus": [
    //             "/role",
    //             "/charts/bar",
    //             "/home",
    //             "/category"
    //         ],
    //         "_id": "5ca9eaa1b49ef916541160d3",
    //         "name": "测试",
    //         "create_time": 1554639521749,
    //         "__v": 0,
    //         "auth_time": 1558679920395,
    //         "auth_name": "test007"
    //     },
    //     {
    //         "menus": [
    //             "/role",
    //             "/charts/bar",
    //             "/home",
    //             "/charts/line",
    //             "/category",
    //             "/product",
    //             "/products"
    //         ],
    //         "_id": "5ca9eab0b49ef916541160d4",
    //         "name": "经理",
    //         "create_time": 1554639536419,
    //         "__v": 0,
    //         "auth_time": 1558506990798,
    //         "auth_name": "test008"
    //     },
    //     {
    //         "menus": [
    //             "/home",
    //             "/products",
    //             "/category",
    //             "/product",
    //             "/role"
    //         ],
    //         "_id": "5ca9eac0b49ef916541160d5",
    //         "name": "角色1",
    //         "create_time": 1554639552758,
    //         "__v": 0,
    //         "auth_time": 1557630307021,
    //         "auth_name": "admin"
    //     }
    //
    // ]
    state = {
        roles: [], // 所有角色的列表
        role: {}, // 选中的role
        isShowAdd: false, // 是否显示添加界面
        isShowAuth: false, // 是否显示设置权限界面
    }
    constructor (props) {
        super(props)

        this.auth = React.createRef()
    }
    initColumn=()=> {

        this.columns=[
            {
                title: '角色名称',
                dataIndex: 'name',
            },
            {
                title: '创建时间',
                dataIndex: 'createTime',
            },
            {
                title: '授权时间',
                dataIndex: 'authTime',
            },
            {
                title: '授权人',
                dataIndex: 'authName',
            },

        ]
    }

    /*
    响应点击取消: 隐藏确定框
     */
    handleCancel = () => {
        // 清除输入数据
        // this.form.resetFields()
        // 隐藏确认框
        this.setState({
            isShowAdd: false
        })
// 清除输入数据
        this.form.resetFields()


    }

    handleCancel2 = () => {
        // 清除输入数据
        // this.form.resetFields()
        // 隐藏确认框
        this.setState({
            isShowAuth:false
        })
// 清除输入数据



    }
    getRoles=async()=>{
        const  result =await reqRoles()
        // console.log(result,'92')
        if (result.status === 0) {

            const roles=result.data
            this.setState({
                roles
            })

        }


    }
    onRow=(role)=>{

        return{
            onClick : event=>{

                console.log(role)
                // alert('点击行');
                this.setState({
                    role
                })
            }
        }

    }

    /*
    添加角色
     */
    addRole=async ()=>{
        this.form.validateFields(async (error, values) => {
//             // 准备数据
//             let result
//             if(!err) {
//                 // 隐藏更新框
//                 this.setState({
//                     isShowAdd: false
//                 })
//
//                 const roleName = this.form.getFieldValue('roleName')
//                 console.log(roleName)
//                 result = await reqAddRole({roleName})
//             }
//
//             // 清除输入数据
//             this.form.resetFields()
//
// // 2. 发请求更新分类
// //         reqUpdateCategory({categoryId, categoryName})
//
//
//             if (result.status === 0) {
//                 // 3. 重新显示列表
//                 this.getRoles();
//             }

        if(!error){
            // 收集输入数据
            const {roleName} = values
            this.form.resetFields()
            // 请求添加

            const result = await reqAddRole(roleName)
            // 根据结果提示/更新列表显示
            if (result.status===0) {
                message.success('添加角色成功')
                this.getRoles()
                // // 新产生的角色
                // const role = result.data
                // // 更新roles状态
                // const roles = this.state.roles
                // roles.push(role)
                // this.setState({
                //   roles
                // })

                // 更新roles状态: 基于原本状态数据更新
            /*    this.setState(state => ({
                    roles: [...state.roles, role]
                }))*/

            } else {
                message.error('添加角色失败')
            }

            // 隐藏确认框
            this.setState({
                isShowAdd: false
            })

        }


        })



    }
    /*
   更新角色
    */
    updateRole=async()=>{

        const role=this.state.role
        // 得到最新的menus
        const menus = this.auth.current.getMenus()
        let imgs = menus.join('--')
        role.menus = imgs
        // role.auth_time = Date.now()


        role.authName = memoryUtils.user.username


        // 请求更新
        const result = await reqUpdateRole(role)
        if (result.status===0) {
            message.success('修改用户角色权限成功')
           this.getRoles()
           //  this.setState({
           //      roles:{...this.state.roles}
           //  })
             this.setState({
                 isShowAuth: false
             })

        }
    }

    componentWillMount() {



        this.initColumn()
    }

    componentDidMount(){
        this.getRoles();
    }

    render() {


        const {roles,role,isShowAdd,isShowAuth}=this.state

        const title=(
            <span>

            <Button  type={'primary'}  onClick={()=>this.setState({isShowAdd:true})}>创建角色</Button>&nbsp;&nbsp;
            {/*<Button  type={'primary'}   onClick={()=>this.setState({isShowAuth:true})}>设置角色权限</Button>*/}
            <Button  type={'primary'}  disabled={!role.id} onClick={()=>this.setState({isShowAuth:true})}>设置角色权限</Button>
        </span>
        )


        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey={'id'}
                    dataSource={roles}
                    columns={this.columns}
                    pagination={{defaultPageSize:PAGE_SIZE}}
                    rowSelection={{type:'radio',selectedRowKeys:[role.id]}}
                    onRow={this.onRow}

                />
                <Modal
                    title="添加角色"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={this.handleCancel}
                >
                    <AddForm

                        setForm={(form) => {
                            this.form = form
                        }}
                    />
                </Modal>


                <Modal
                    title="设置角色权限"
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    onCancel={this.handleCancel2}
                >
                    <AuthForm ref={this.auth} role={role}/>

                </Modal>
            </Card>
        )
    }


}

