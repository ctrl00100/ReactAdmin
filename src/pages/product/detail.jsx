import React, {Component} from 'react'
import {
    Card,
    Icon,
    List
} from 'antd'

import LinkButton from '../../components/link-button'
import {BASE_IMG_URL} from '../../utils/constants'
import {reqCategory,reqPCategory} from '../../api'
import "./product.less"
const Item = List.Item

/*
*
*ProductDetail 商品路由
*
* */
class ProductDetail extends Component {

    state = {
        cName1: '', // 一级分类名称
        cName2: '', // 二级分类名称
    }

   async componentDidMount () {

        // 得到当前商品的分类ID
        const {pcategoryId, categoryId} = this.props.location.state.product
           // console.log(pcategoryId)
           // console.log(categoryId)

       // if(pcategoryId==='0') { // 一级分类下的商品
        //     const result = await reqCategory(pcategoryId)
        //
        //     console.log(result)
        //     const cName1 = result.data.name
        //     this.setState({cName1})
        // } else{
            //通过多个await方式发多个请求: 后面一个请求是在前一个请求成功返回之后才发送
           /* const result1 = await reqCategory(pCategoryId) // 获取一级分类列表
            const result2 = await reqCategory(categoryId) // 获取二级分类
            const cName1 = result1.data.name
            const cName2 = result2.data.name*/

            const results = await Promise.all([reqPCategory(pcategoryId), reqCategory(categoryId)])
       // console.log(results)

       const cName1 = results[0].data.name
            const cName2 = results[1].data.name
            this.setState({
                cName1,
                cName2
            })
        // }


    }
    render() {

        // 读取携带过来的state数据
        const {name, ddesc, price, detail, imgs} = this.props.location.state.product

        // console.log(imgs,'imgs,detail')

        const {cName1, cName2} = this.state
        const title=(
            <span>
            <LinkButton>

                <Icon type={"arrow-left"} style={{marginRight:15,fontSize:20}}

                      onClick={() => this.props.history.goBack()}
                />


                <span>商品详情</span>
            </LinkButton>
                </span>
        )
        return (
       <Card title={title} className={"product-detail"}>
        <List>
            <Item>
                <span className={"left"}>商品名称:</span>
                <span>{name}</span>
            </Item>
            <Item>
                <span className={"left"}>商品描述:</span>
                <span>{ddesc}</span>
            </Item>
            <Item>
                <span className={"left"}>商品价格:</span>
                <span>{price}元</span>
            </Item>
            <Item>
                <span className={"left"}>所属分类:</span>
                {/*<span>电脑-->笔记本</span>*/}
                <span>{cName1} {cName2 ? ' --> '+cName2 : ''}</span>
            </Item>
            <Item>
                <span className={"left"}>商品图片:</span>
                <span>
                         {/*{*/}
                         {/*    imgs.map(img => (*/}
                         {/*        <img*/}
                         {/*            key={img}*/}
                         {/*            src={BASE_IMG_URL + img}*/}
                         {/*            className="product-img"*/}
                         {/*            alt="img"*/}
                         {/*        />*/}
                         {/*    ))*/}
                         {/*}*/}
                    <img src={imgs} alt="img"      className={"product-img"}   />
                 </span>
            </Item>

            <Item>
                <span className={"left"}>商品详情:</span>
                {/*<span dangerouslySetInnerHTML={{__html: "<h1 style='color: red'>商品详情的内容标题</h1>"}}></span>*/}
                <span dangerouslySetInnerHTML={{__html: detail}}></span>
            </Item>
        </List>



       </Card>
        );
    }
}

export default ProductDetail;