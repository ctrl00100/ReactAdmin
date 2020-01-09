import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Input,
  Tree
} from 'antd'
import menuList from '../../config/menuConfig'

const { TreeNode } = Tree;
const Item = Form.Item


/*
添加分类的form组件
 */
export  default  class AuthForm extends Component {

  static propTypes = {
    // setForm: PropTypes.func.isRequired, // 用来传递form对象的函数
    //   checkedKeys:[],
    role: PropTypes.object
  }
    state={

          checkedKeys:[]

    }

    constructor (props) {
        super(props)

        // 根据传入角色的menus生成初始状态
        const {menus} = this.props.role
        const menu=[]
        if(menus) {
            //menus切割
            menus.split('--').map(list => (

                menu.push(list)));

        }
        this.state = {
            checkedKeys: menu
        }
    }
    /*
 为父组件提交获取最新menus数据的方法
  */
    getMenus = () =>  this.state.checkedKeys




  getTreeNodes = (menuList) => {
    return menuList.reduce((pre, item) => {
      pre.push(
          <TreeNode title={item.title} key={item.key}>
            {item.children ? this.getTreeNodes(item.children) : null}
          </TreeNode>
      )
      return pre
    }, [])
  }


    // 选中某个node时的回调
    onCheck = checkedKeys => {
        console.log('onCheck', checkedKeys);
        this.setState({ checkedKeys });
    };
  componentWillMount () {
    // this.props.setForm(this.props.form)

    this.treeNodes = this.getTreeNodes(menuList)
  }
    /*
    当组件接收到新的属性时自动调用
     */
    componentWillReceiveProps (nextProps) {
        console.log('componentWillReceiveProps()', nextProps)
        const menus = nextProps.role.menus
        const menu=[]
        if(menus) {
            //menus切割
            menus.split('--').map(list => (

                menu.push(list)));

        }
        this.setState({
            checkedKeys: menu
        })
        // this.state.checkedKeys = menus
    }
  render() {
    // const { getFieldDecorator } = this.props.form

    const {role}=this.props
    const {checkedKeys}=this.state


    // 指定Item布局的配置对象
    const formItemLayout = {
      labelCol: { span: 4 },  // 左侧label的宽度
      wrapperCol: { span: 15 }, // 右侧包裹的宽度
    }

    return (
        <div>
          <Item label='角色名称' {...formItemLayout}>

                  <Input value={role.name} disabled/>


          </Item>

          <Tree
              checkable
              defaultExpandAll={true}
              checkedKeys={checkedKeys}
              onCheck={this.onCheck}

          >
            <TreeNode title="平台权限" key="all">
              {this.treeNodes}

            </TreeNode>
          </Tree>
        </div>
    )
  }
}

