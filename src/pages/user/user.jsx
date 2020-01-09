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
import {reqDeleteUser, reqUsers, reqAddOrUpdateUser} from "../../api/index";
import UserForm from './user-form'
import {PAGE_SIZE} from "../../utils/constants";
import AddForm from "../role/add-form";
import AuthForm from "../role/auth-form";

class User extends Component {
    state = {
        // roles: [], // 所有角色的列表
        // role: {}, // 选中的role
        // isShowAdd: false, // 是否显示添加界面
        isShowAuth: false, // 是否显示设置权限界面
        users:[]
    }
    initColumn=()=> {

        this.columns=[
            {
                title: '用户名',
                dataIndex: 'name',
            },
            {
                title: '邮箱',
                dataIndex: 'createTime',
            },
            {
                title: '电话',
                dataIndex: 'authTime',
            },
            {
                title: '注册时间',
                dataIndex: 'authName',
            },
            {
                title: '所属角色',
                dataIndex: 'authName',
            },
            {
                title: '操作',
                dataIndex: 'authName',
            }

        ]
    }

    componentWillMount() {



        this.initColumn()
    }
    render() {
        const {users}=this.state

        const title=(
            <span>

            <Button  type={'primary'}  >创建用户</Button>&nbsp;&nbsp;
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
                    title="设置角色权限"
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    onCancel={this.handleCancel2}
                >
                    <AuthForm ref={this.auth} role={role}/>

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