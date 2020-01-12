import React, {Component} from 'react'
import {
    Card,
    Button,
    Table,
    Modal,
    message
} from 'antd'
import {formateDate} from "../../utils/dateUtils"
import LinkButton from "../../components/link-button/index"
import {reqDeleteUser, reqUsers, reqAddOrUpdateUser, reqRoles} from "../../api/index";
import UserForm from './user-form'
import {PAGE_SIZE} from "../../utils/constants";
import AddForm from "../role/add-form";
import AuthForm from "../role/auth-form";

class User extends Component {
    state = {
        // roles: [], // 所有角色的列表
        // role: {}, // 选中的role
        // isShowAdd: false, // 是否显示添加界面
        isShow: false, // 是否显示设置权限界面
        isShowAdd: false, // 是否显示设置权限界面
        users:[],
        roles:[],
        rol:'',
    }
    initColumn=()=> {

        this.columns=[
            {
                title: '用户名',
                dataIndex: 'username',
            },
            {
                title: '邮箱',
                dataIndex: 'email',
            },
            {
                title: '电话',
                dataIndex: 'phone',
            },
            {
                title: '注册时间',
                dataIndex: 'createTime',
                // render: formateDate

            },
            {
                title: '所属角色',
                dataIndex: 'roleId',
                render: (roleId) => this.roleNames[roleId]
                // render: (roleId) => this.state.roles.find(role=>role.id===roleId).name

            },
            {
                title: '操作',
                render: (user) =>(
                    <span>
                        <LinkButton   onClick={() => this.showUpdate(user)}>修改</LinkButton>
                        <LinkButton   onClick={() => this.deleteUser(user)}>删除</LinkButton>

                    </span>


                )
            }

        ]
    }


    /*
显示修改界面
 */
    showUpdate = (user) => {
        this.user = user // 保存user
        this.setState({
            isShowAdd: true
        })
    }

    addOrUpdateUser=async () => {


        // 1. 收集输入数据
        const user = this.form.getFieldsValue()
        this.form.resetFields()
        // 如果是更新, 需要给user指定_id属性
        if (this.user) {
            user.id = this.user.id
        }


        // 2. 提交添加的请求
        const result = await reqAddOrUpdateUser(user)

        // 3. 更新列表显示
        if(result.status===0) {
            // message.success(`${this.user ? '修改' : '添加'}用户成功`)

            this.setState({
                isShowAdd: false
            })
            // message.success('添加用户成功')
            message.success(`${this.user ? '修改' : '添加'}用户成功`)

            this.getUsers()

        }
    }

    showAdd=()=>{
        this.setState({isShowAdd:true})
        this.user = null
    }
    /*
删除指定用户
 */
    deleteUser = (user) => {
        Modal.confirm({
            title: `确认删除${user.username}吗?`,
            onOk: async () => {
                // const user2=ee;
                let a= user.id

                console.log(a)

                let a1= 1215570114825424908;

                console.log(a1)
                const result = await reqDeleteUser(user)
                if(result.status===0) {
                    message.success('删除用户成功!')
                    this.getUsers()
                }
            }
        })
    }
    /*
根据role的数组, 生成包含所有角色名的对象(属性名用角色id值)
 */
    initRoleNames = (roles) => {
        const roleNames = roles.reduce((pre, role) => {
            pre[role.id] = role.name
            return pre
        }, {})
        // 保存
        this.roleNames = roleNames
    }
    getUsers = async () => {
        const result = await reqUsers()
        const result2 = await reqRoles()
        let roles;
        if (result2.status===0) {
            // console.log(result2,'result2reqRoles')
            // const {users, roles} = result.data
             roles= result2.data
            this.initRoleNames(roles)
            // this.setState({
            //     roles
            // })
        }
        if (result.status===0) {
            console.log(result,'resultreqUsers')
            // const {users, roles} = result.data
            const users= result.data
            // this.initRoleNames(roles)
            this.setState({
                users,roles
            })
        }
    }
    componentWillMount() {



        this.initColumn()
    }

    componentDidMount () {
        this.getUsers()
    }
    render() {
        const {users,isShow,isShowAdd,roles}=this.state
        const user = this.user || {}
        const title=(
            <span>

            {/*<Button  type={'primary'}onClick={()=>{*/}
            {/*    this.setState({isShowAdd:true})*/}
            {/*    this.user = null }} >创建用户</Button> */}
         <Button type='primary' onClick={this.showAdd}>创建用户</Button>


                &nbsp;&nbsp;
                {/*<Button  type={'primary'}   onClick={()=>this.setState({isShowAuth:true})}>设置角色权限</Button>*/}
                <Button  type={'primary'} >设置角色权限</Button>
          </span>
        )
        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey={'id'}
                    dataSource={users}
                    columns={this.columns}
                    pagination={{defaultPageSize:PAGE_SIZE}}
                    // rowSelection={{type:'radio',selectedRowKeys:[role.id]}}
                    // onRow={this.onRow}

                />


                <Modal
                    title={user.id ? '修改用户' : '添加用户'}
                    visible={isShowAdd}
                    onOk={this.addOrUpdateUser}
                    onCancel={() => {
                        this.form.resetFields()
                        this.setState({isShowAdd: false})
                    }}
                >
                    <UserForm
                        setForm={form => this.form = form}
                        roles={roles}
                        user={user}
                    />
                </Modal>
            </Card>

        );
    }
}
// let imgs = menus.join('--')


// const menu=[]
// if(menus) {
//     //menus切割
//     menus.split('--').map(list => (
//
//         menu.push(list)));
//
// }
export default User;