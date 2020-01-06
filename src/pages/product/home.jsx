import React, {Component} from 'react'
import {
    Card,
    Select,
    Input,
    Button,
    Icon,
    Table,
    message
} from 'antd'

import LinkButton from '../../components/link-button'
import {reqProducts, reqSearchProducts, reqUpdateStatus} from '../../api'
import {PAGE_SIZE} from '../../utils/constants'

const Option = Select.Option

/*
*
*ProductHome 默认子路由组件
*
* */


class ProductHome extends Component {

    state = {
        total: 0, // 商品的总数量
        products: [], // 商品的数组
        loading: false, // 是否正在加载中
        searchName: '', // 搜索的关键字
        searchType: 'productName', // 根据哪个字段搜索
    }

    //     {
    //     "status": 1,
    //     "imgs": [
    //         "image-1559402396338.jpg"
    //     ],
    //     "_id": "5ca9e05db49ef916541160cd",
    //     "name": "联想ThinkPad 翼4809",
    //     "desc": "年度重量级新品，X390、T490全新登场 更加轻薄机身设计9",
    //     "price": 65999,
    //     "pCategoryId": "5ca9d6c0b49ef916541160bb",
    //     "categoryId": "5ca9db9fb49ef916541160cc",
    //     "detail": "<p><span style=\"color: rgb(228,57,60);background-color: rgb(255,255,255);font-size: 12px;\">想你所需，超你所想！精致外观，轻薄便携带光驱，内置正版office杜绝盗版死机，全国联保两年！</span> 222</p>\n<p><span style=\"color: rgb(102,102,102);background-color: rgb(255,255,255);font-size: 16px;\">联想（Lenovo）扬天V110 15.6英寸家用轻薄便携商务办公手提笔记本电脑 定制【E2-9010/4G/128G固态】 2G独显 内置</span></p>\n<p><span style=\"color: rgb(102,102,102);background-color: rgb(255,255,255);font-size: 16px;\">99999</span></p>\n",
    //     "__v": 0
    // },
    //     {
    //         "status": 1,
    //         "imgs": [
    //             "image-1559402448049.jpg",
    //             "image-1559402450480.jpg"
    //         ],
    //         "_id": "5ca9e414b49ef916541160ce",
    //         "name": "华硕(ASUS) 飞行堡垒",
    //         "desc": "15.6英寸窄边框游戏笔记本电脑(i7-8750H 8G 256GSSD+1T GTX1050Ti 4G IPS)",
    //         "price": 6799,
    //         "pCategoryId": "5ca9d6c0b49ef916541160bb",
    //         "categoryId": "5ca9db8ab49ef916541160cb",
    //         "detail": "<p><span style=\"color: rgb(102,102,102);background-color: rgb(255,255,255);font-size: 16px;\">华硕(ASUS) 飞行堡垒6 15.6英寸窄边框游戏笔记本电脑(i7-8750H 8G 256GSSD+1T GTX1050Ti 4G IPS)火陨红黑</span>&nbsp;</p>\n<p><span style=\"color: rgb(228,57,60);background-color: rgb(255,255,255);font-size: 12px;\">【4.6-4.7号华硕集体放价，大牌够品质！】1T+256G高速存储组合！超窄边框视野无阻，强劲散热一键启动！</span>&nbsp;</p>\n",
    //         "__v": 0
    //     }


/*初始化table列的数组          initColumns*/

    initColumns=()=>{
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'ddesc',
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: (price) => '¥' + price  // 当前指定了对应的属性, 传入的是对应的属性值
            },
            {
                width: 100,
                title: '状态',
                // dataIndex: 'status',
                // render: (status) =>{
                //
                // return(
                //     <span>
                //         <Button type={"primary"}>下架</Button>
                //         <pan>在售</pan>
                //     </span>
                // )
                // } // 当前指定了对应的属性, 传入的是对应的属性值
                render: (product) => {
                    const {status, id} = product
                    // console.log(product)
                    const newStatus = status===1 ? 2 : 1
                    return (
                        <span>
              <Button
                  type='primary'
                  onClick={() => this.updateStatus(id, newStatus)}
              >
                {status===1 ? '下架' : '上架'}
              </Button>
              <span>{status===1 ? '在售' : '已下架'}</span>
            </span>
                    )
                }



            },
            {
                title: '操作',
                render: (product) =>{
                        // console.log(product,'119home')
                    return(
                        <span>
                        {/*<LinkButton type={"primary"}>详情</LinkButton>*/}
                            <LinkButton onClick={() => this.props.history.push('/product/detail', {product})}>详情</LinkButton>
              <LinkButton onClick={() => this.props.history.push('/product/addupdate', product)}>修改</LinkButton>

                        {/*<LinkButton >修改</LinkButton>*/}
                    </span>
                    )
                } // 当前指定了对应的属性, 传入的是对应的属性值
            }
        ];

    }
    /*
    更新指定商品的状态
     */
    updateStatus = async (productId, status) => {
        const result = await reqUpdateStatus(productId, status)
        if(result.status===0) {
            message.success('更新商品成功')
            this.getProducts(this.pageNum)
        }
    }

    componentWillMount () {
        this.initColumns()
    }
    /*
   获取指定页码的列表数据显示
    */
    getProducts = async (pageNum) => {

        this.pageNum = pageNum // 保存pageNum, 让其它方法可以看到


        this.setState({loading: true}) // 显示loading
        // 如果搜索关键字有值, 说明我们要做搜索分页

        const {searchName, searchType} = this.state

        let result
        if (searchName) {
            result = await reqSearchProducts({pageNum, pageSize: PAGE_SIZE, searchName, searchType})
        } else { // 一般分页请求
            result = await reqProducts(pageNum, PAGE_SIZE)
        }
        //const result = await reqProducts(pageNum, PAGE_SIZE);
        this.setState({loading: false}) // 显示loading



        // if (result.status==='0') {
            if (result.status === 0) {


            // 取出分页数据, 更新状态, 显示分页列表
                const total= result.data.total
                const list= result.data.list




            this.setState({
                total,
                products:list
            })
        }
    }



    componentDidMount () {
        this.getProducts(1)
    }
    render() {

        // 取出状态数据
        const {products, total, loading, searchType, searchName} = this.state

        const title = (
            <span>
                {/*<Select value={"1"}   style={{width: 150}}>*/}
                <Select value={searchType}   style={{width: 150}}
                        onChange={value => this.setState({searchType:value})}
                >
                    <Option value={"productName"}>按名称搜索</Option>
                    <Option value={"productDesc"}>按描述搜索</Option>
                </Select>
                <Input
                    placeholder={"关键字"}
                    style={{width: 200, margin: '0 15px'}}
                value={searchName}
                    onChange={event => this.setState({searchName:event.target.value})}

                />
        <Button type='primary' onClick={() => this.getProducts(1)}>搜索</Button>
      </span>
        );

        const extra = (
            <Button type='primary' onClick={() => this.props.history.push('/product/addupdate')}>
                {/*<LinkButton     onClick={() => this.props.history.push('/product/detail', {product})}>详情</LinkButton>*/}
                <Icon type='plus'/>
                添加商品
            </Button>
        )

        const dataSource = [
            {
                key: '1',
                name: '胡彦斌',
                age: 32,
                address: '西湖区湖底公园1号',
            },
            {
                key: '2',
                name: '胡彦祖',
                age: 42,
                address: '西湖区湖底公园1号',
            },
        ];

        const columns = [
            {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '年龄',
                dataIndex: 'age',
                key: 'age',
            },
            {
                title: '住址',
                dataIndex: 'address',
                key: 'address',
            },
        ];




        return (
            <Card title={title} extra={extra}>
                {/*<Table dataSource={products}*/}
                {/*       columns={this.columns}                />*/}

                <Table
                    loading={loading}
                    bordered
                    rowKey={"id"}
                    // rowKey={"_id"}
                    dataSource={products}
                    columns={this.columns}

                    pagination={{
                        // current: this.pageNum,
                        total,
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true,
                        onChange: this.getProducts
                    }}
                />;



            </Card>

        );
    }
}


export default ProductHome;