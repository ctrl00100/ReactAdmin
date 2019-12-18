import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Select,
  Input
} from 'antd'

const Item = Form.Item
const Option = Select.Option

/*
添加分类的form组件
 */
class UpdateForm extends Component {

  static propTypes = {
    setForm: PropTypes.func.isRequired, // 用来传递form对象的函数
    // categorys: PropTypes.array.isRequired, // 一级分类的数组
    // parentId: PropTypes.string.isRequired, // 父分类的ID
    categoryName: PropTypes.string.isRequired, //
  }

  componentWillMount () {
    // 将form对象通过setForm()传递父组件
    this.props.setForm(this.props.form)
  }

  render() {
    const {categoryName} = this.props
    const { getFieldDecorator } = this.props.form

    return (
      <Form>


        <Item>
          {
            getFieldDecorator('categoryName', {
              // initialValue: '',
              initialValue: categoryName,
              rules: [
                {required: true, message: '分类名称必须输入'}
              ]
            })(
              <Input placeholder='请输入更新分类名称'/>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(UpdateForm)