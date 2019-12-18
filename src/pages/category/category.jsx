import React, {Component} from 'react'
import {
    Card,
    Table,
    Button,
    Icon,
    message,
    Modal

} from 'antd'
import {reqCategorys, reqCategorys2, reqUpdateCategory, reqUpdateCategory2, reqAddCategory,reqAddCategory2} from '../../api'
import LinkButton from '../../components/link-button'
import AddForm from "./add-form"
import UpdateForm from "./update-form";

class Category extends Component {


    state = {
        loading: false, // 是否正在获取数据中
        categorys: [], // 一级分类列表
        subCategorys: [], // 二级分类列表
        parentId: '0', // 当前需要显示的分类列表的父分类ID
        parentName: '', // 当前需要显示的分类列表的父分类名称
        showStatus: 0, // 标识添加/更新的确认框是否显示, 0: 都不显示, 1: 显示添加, 2: 显示更新
    }

    /*
初始化Table所有列的数组
 */
    initColumns = () => {
        this.columns = [
            {
                title: '分类的名称',
                dataIndex: 'name', // 显示数据对应的属性名
            },
            {
                title: '操作',
                width: 400,
                render: (category) => ( // 返回需要显示的界面标签
                    <span>
          {/*<LinkButton>修改分类</LinkButton>*/}
                        <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
                        {/*如何向事件回调函数传递参数: 先定义一个匿名函数, 在函数调用处理的函数并传入数据*/}
                        {this.state.parentId === '0' ?
                            <LinkButton onClick={() => this.showSubCategorys(category)}>查看子分类</LinkButton> : null}

                        {/*<LinkButton  onClick={() => this.showSubCategorys(category)} >查看子分类</LinkButton>*/}
      </span>
                )
            }
        ]
    }
    /*
    异步获取一级/二级分类列表显示
    parentId: 如果没有指定根据状态中的parentId请求, 如果指定了根据指定的请求
     */
    getCategorys = async () => {
        // 在发请求前, 显示loading
        this.setState({load2: true})
        let result
        const {parentId} = this.state
        // 发异步ajax请求, 获取数据
        if (parentId === "0") {
            result = await reqCategorys(parentId)

        } else {
            result = await reqCategorys2(parentId)

        }
        // const result = await reqCategorys2()
        // 在请求完成后, 隐藏loading
        this.setState({load2: false})

        if (result.status === 0) {
            // 取出分类数组(可能是一级也可能二级的)
            const categorys = result.data
            if (parentId === '0') {
                // 更新一级分类状态
                this.setState({
                    categorys
                })
                // console.log('----', this.state.categorys.length)
            } else {
                // 更新二级分类状态
                this.setState({
                    subCategorys: categorys
                })

                message.success('获取二级分类列表')
            }
        } else {
            message.error('获取分类列表失败')
        }
    }

    /*
    显示指定一级分类对象的二子列表
     */
    showSubCategorys = (category) => {
        // 更新状态
        this.setState({
                parentId: category.did,
                parentName: category.name
            }
            //)
            // 获取二级分类列表显示
            //       this.getCategorys()
            //       console.log('parentId.did', this.state.parentId) // '0'
            //       console.log('parentName', this.state.parentName) // '0'
            , () => { // 在状态更新且重新render()后执行
                // console.log('parentId.did', this.state.parentId) // '!0'
                // console.log('parentName', this.state.parentName) // '!0'
                // console.log('category', category) // '!0'

                // 获取二级分类列表显示
                this.getCategorys()
            })

        // setState()不能立即获取最新的状态: 因为setState()是异步更新状态的
        // console.log('parentId', this.state.parentId) // '0'
    }

    /*
显示指定一级分类列表
 */
    showCategorys = () => {
        // 更新为显示一列表的状态
        this.setState({
            parentId: '0',
            parentName: '',
            subCategorys: []
        })
    }

    /*
    为第一次render()准备数据
     */
    componentWillMount() {
        this.initColumns()
    }

    /*
    执行异步任务: 发异步ajax请求
     */
    componentDidMount() {
        // 获取一级分类列表显示
        this.getCategorys()
    }

    /*
显示添加的确认框
 */
    showAdd = () => {
        this.setState({
            showStatus: 1
        })
    }

    /*
添加分类
 */
    // addCategory = async() => {
    addCategory = () => {
        console.log('addCategory()')
        this.form.validateFields(async (err, values) => {
            if(!err) {

                //隐藏确认框
                this.setState({
                    showStatus:0
                })

                //收集数据并提交添加分类请求
                // const{parentId,categoryName}=this.form.getFieldsValue()
                const{parentId,categoryName}=values
                let name=categoryName
                let result
                // 清除输入数据
                this.form.resetFields()

                if(parentId==="0"){
                    result = await reqAddCategory(name, parentId)

                }else{
                    result = await reqAddCategory2(name, parentId)


                }


                if(result.status===0) {

                    // 添加的分类就是当前分类列表下的分类
                    if(parentId===this.state.parentId) {
                        // 重新获取当前分类列表显示
                        this.getCategorys()
                    } else if (parentId==='0'){ // 在二级分类列表下添加一级分类, 重新获取一级分类列表, 但不需要显示一级列表
                        this.getCategorys('0')
                    }
                }


            }





            })

    }
    /*
显示showUpdate的确认框
*/

    showUpdate = (category) => {
        // 保存分类对象
        this.category = category
        // 更新状态
        this.setState({
            showStatus: 2
        })
    }

    /*
更新分类
*/
    updateCategory =  () => {
        console.log('updateCategory()')
        // 进行表单验证, 只有通过了才处理
        this.form.validateFields(async (err, values) => {
            if(!err) {
                // 隐藏更新框
                this.setState({
                    showStatus: 0
                })


                // 准备数据
                let result

                if (this.state.parentId === "0") {
                    const did = this.category.did
                    // 2. 发请求更新分类
                    // const {categoryName} = values

                    const name = this.form.getFieldValue('categoryName')
                    result = await reqUpdateCategory({did, name})


                } else {

                    const idme = this.category.idme
                    // const {categoryName} = values
                    const name = this.form.getFieldValue('categoryName')
                    result = await reqUpdateCategory2({idme, name})


                }


// 清除输入数据
                this.form.resetFields()

// 2. 发请求更新分类
//         reqUpdateCategory({categoryId, categoryName})


                if (result.status === 0) {
                    // 3. 重新显示列表
                    this.getCategorys()
                }
            }
        })
        }



    /*
    响应点击取消: 隐藏确定框
     */
    handleCancel = () => {
        // 清除输入数据
        // this.form.resetFields()
        // 隐藏确认框
        this.setState({
            showStatus: 0
        })
// 清除输入数据
        this.form.resetFields()


    }


    render() {
        const dataSource = [
            {
                "parentId": 0,
                "idc": 1,
                "name": "家用电器",
                "v": 0,
                "did": 1
            },
            {
                "parentId": 0,
                "idc": 2,
                "name": "电脑999999",
                "v": 0,
                "did": 2
            },
            {
                "parentId": 0,
                "idc": 3,
                "name": "图书",
                "v": 0,
                "did": 3
            },
            {
                "parentId": 0,
                "idc": 4,
                "name": "服装",
                "v": 0,
                "did": 4
            },
            {
                "parentId": 0,
                "idc": 5,
                "name": "食品",
                "v": 0,
                "did": 5
            }
        ]
        //test1
        // const dataSource = [
        //     {
        //         key: '1',
        //         name: '胡彦斌',
        //         age: 32,
        //         address: '西湖区湖底公园1号',
        //     },
        //     {
        //         key: '2',
        //         name: '胡彦祖',
        //         age: 42,
        //         address: '西湖区湖底公园1号',
        //     },
        // ];
        // const columns = [
        //     {
        //         title: '姓名',
        //         dataIndex: 'name',
        //         key: 'name',
        //     },
        //     {
        //         title: '年龄',
        //         dataIndex: 'age',
        //         key: 'age',
        //     },
        //     {
        //         title: '住址',
        //         dataIndex: 'address',
        //         key: 'address',
        //     },
        // ];
        //test1

//读取状态数据
        const {categorys, parentId, subCategorys, parentName, showStatus} = this.state

        // 读取指定的分类
        const category = this.category || {}  // 如果还没有指定一个空对象

        // const {load2} = this.state

        // card的左侧
        // const title = '一级分类列表'

        const title = parentId === '0' ? '一级分类列表' : (
            <span>
        <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
        <Icon type='arrow-right' style={{marginRight: 5}}/>
        <span>{parentName}</span>
      </span>
        )
        // Card的右侧
        const extra = (
            <Button type='primary' onClick={this.showAdd}>
                <Icon type='plus'/>
                添加
            </Button>
        )
        return (
            <Card title={title} extra={extra}>
                <Table
                    bordered={true}   //边框线

                    rowKey={parentId === '0' ? "did" : "idme"}   //循环key
                    loading={this.state.load2}
                    // dataSource={categorys}
                    dataSource={parentId === '0' ? categorys : subCategorys}

                    columns={this.columns}
                    //test1  categorys
                    // dataSource={dataSource}    columns={columns}
                    //test1
                    pagination={{defaultPageSize: 3, showQuickJumper: true}}


                />


                <Modal
                    title="添加分类"
                    visible={showStatus === 1} //可见
                    onOk={this.addCategory}  //确认事件
                    onCancel={this.handleCancel}
                >
                    <AddForm
                        categorys={categorys}
                        parentId={parentId}
                        setForm={(form) => {
                            this.form = form
                        }}
                    />
                </Modal>


                <Modal
                    title="修改分类"
                    visible={showStatus === 2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >
                    <UpdateForm
                        categoryName={category.name}
                        setForm={(form) => {
                            this.form = form
                        }}
                    />
                </Modal>

            </Card>
        );
    }
}

export default Category;