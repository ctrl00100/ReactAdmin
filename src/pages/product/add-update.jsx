import React, {PureComponent} from 'react'
import {
    Card,
    Icon,
    Form,
    Input,
    Cascader,
    Button,
    message
} from 'antd'

// import PicturesWall from './pictures-wall'
// import RichTextEditor from './rich-text-editor'
import LinkButton from '../../components/link-button'
import {reqCategorys, reqAddOrUpdateProduct,reqCategorys2} from '../../api'

const {Item} = Form
const { TextArea } = Input



class ProductAddUpdate extends PureComponent {

    state = {
        options: [],
    }

    initOptions = async (categorys) => {
        // 根据categorys生成options数组
        const options = categorys.map(c => ({
            value: c.did,
            label: c.name,
            isLeaf: false, // 不是叶子
        }))

        // 如果是一个二级分类商品的更新
        const {isUpdate, product} = this
        const {pcategoryId,categoryId} = product
        const numm=Number (pcategoryId)
        console.log(pcategoryId,'pcategoryId33399')
        if (isUpdate && pcategoryId !== '0') {
            // 获取对应的二级分类列表
            const subCategorys = await this.getCategorys(numm)
            // 生成二级下拉列表的options
            const childOptions = subCategorys.map(c => ({
                value: c.idme,
                label: c.name,
                isLeaf: true
            }))

            // 找到当前商品对应的一级option对象
            const targetOption = options.find(option => option.value === numm)

            // 关联对应的一级option上
            targetOption.children = childOptions
        }

        // 更新options状态
        this.setState({
            options
        })
    }

    /*
     异步获取一级/二级分类列表, 并显示
     async函数的返回值是一个新的promise对象, promise的结果和值由async的结果来决定
      */
    getCategorys = async (parentId) => {
        let result
        if( parentId==='0' ){
            result = await reqCategorys(parentId)   // {status: 0, data: categorys}
        }else{

            result = await reqCategorys2(parentId)   // {status: 0, data: categorys}

        }

        if (result.status===0) {
            const categorys = result.data
            // 如果是一级分类列表
            if (parentId==='0') {
                this.initOptions(categorys)
            }else{ //二级列表

                // const   categorys = result.data
                return categorys;
            }
        }
}
    /*
验证价格的自定义验证函数
 */
    validatePrice = (rule, value, callback) => {
        // console.log(value, typeof value)
        if (value*1 > 0) {
            callback() // 验证通过
        } else {
            callback('价格必须大于0') // 验证没通过
        }
    }



    /*
     用加载下一级列表的回调函数
      */
    loadData = async selectedOptions => {
        // 得到选择的option对象
        const targetOption = selectedOptions[0]
        // 显示loading
        targetOption.loading = true

        // 根据选中的分类, 请求获取二级分类列表
        const subCategorys = await this.getCategorys(targetOption.value)
        // 隐藏loading
        targetOption.loading = false
        // 二级分类数组有数据
        if (subCategorys && subCategorys.length>0) {
            // 生成一个二级列表的options
            const childOptions = subCategorys.map(c => ({
                value: c.idme,
                label: c.name,
                isLeaf: true
            }))
            // 关联到当前option上
            targetOption.children = childOptions
        } else { // 当前选中的分类没有二级分类
            targetOption.isLeaf = true
        }

        // 更新options状态
        this.setState({
            options: [...this.state.options],
        })
    }


    submit = () => {
        // 进行表单验证, 如果通过了, 才发送请求
        this.props.form.validateFields(async (error, values) => {
            if (!error) {
                console.log('submit',values)
                // alert("99999")
            }

        })
    }



    componentDidMount () {
        this.getCategorys('0')
    }

    componentWillMount () {
        // 取出携带的state
        const product =this.props.location.state.product  // 如果是添加没值, 否则有值

        //    const product = this.props.location.state  // 如果是添加没值, 否则有值
        // <LinkButton onClick={() => this.props.history.push('/product/addupdate', product)}>修改</LinkButton>
        // 保存是否是更新的标识
        this.isUpdate = !!product
        // 保存商品(如果没有, 保存是{})
        this.product = product || {}
    }

    // var num = parseInt(str1)
    render() {
        const {isUpdate, product} = this
        const {pcategoryId, categoryId, imgs, detail} = product
        // 用来接收级联分类ID的数组
        const categoryIds = []

        const num1 = Number(pcategoryId)
        const num2 = Number(categoryId)
        if(isUpdate) {
            // 商品是一个一级分类的商品
            if(pcategoryId==='0') {
                categoryIds.push(num2)
            } else {
                // 商品是一个二级分类的商品
                categoryIds.push(num1)
                categoryIds.push(num2)
            }
        }

console.log(categoryIds,'categoryIds179');


        // 指定Item布局的配置对象
        const formItemLayout = {
            labelCol: { span: 2 },  // 左侧label的宽度
            wrapperCol: { span: 8 }, // 右侧包裹的宽度
        }

        // 头部左侧标题
        const title = (
            <span>
        <LinkButton onClick={() => this.props.history.goBack()}>
          <Icon type='arrow-left' style={{fontSize: 20}}/>
        </LinkButton>
        <span>{isUpdate ? '修改商品' : '添加商品'}</span>
        {/*<span>添加商品</span>*/}
      </span>
        )

        const {getFieldDecorator} = this.props.form
        return (
            <Card title={title}>
                <Form {...formItemLayout}>
                    <Item label="商品名称">
                        {
                            getFieldDecorator('name', {
                                initialValue: product.name,
                                rules: [
                                    {required: true, message: '必须输入商品名称'}
                                ]
                            })(<Input placeholder='请输入商品名称'/>)
                        }
                    </Item>


                    <Item label="商品描述">
                        {
                            getFieldDecorator('ddesc', {
                                initialValue: product.ddesc,
                                rules: [
                                    {required: true, message: '必须输入商品描述'}
                                ]
                            })(<TextArea placeholder="请输入商品描述" autoSize={{ minRows: 2, maxRows: 6 }} />)
                        }

                    </Item>
                    <Item label="商品价格">

                        {
                            getFieldDecorator('price', {
                                initialValue: product.price,

                                rules: [
                                    {required: true, message: '必须输入商品价格'},
                                    {validator: this.validatePrice}
                                ]
                            })(<Input type='number' placeholder='请输入商品价格' addonAfter='元'/>)
                        }
                    </Item>

                    <Item label="商品分类">
                        {
                            getFieldDecorator('categoryIds', {
                                // initialValue:  [pcategoryIds,8],
                                initialValue:   categoryIds,
                                rules: [
                                    {required: true, message: '必须指定商品分类'},
                                ]
                            })(
                                <Cascader
                                    placeholder='请指定商品分类'
                                    options={this.state.options}  /*需要显示的列表数据数组*/
                                    loadData={this.loadData} /*当选择某个列表项, 加载下一级列表的监听回调*/
                                />
                            )
                        }

                    </Item>

                    <Item label="商品图片">
                        <div>商品图片</div>
                    </Item>
                    <Item label="商品详情">
                        <div>商品图片</div>
                    </Item>

                    <Item>
                        <Button type='primary' onClick={this.submit}>提交</Button>
                    </Item>

                </Form>
            </Card>
        );
    }
}


// export default ProductAddUpdate;
export default Form.create()(ProductAddUpdate)