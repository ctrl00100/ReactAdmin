import React, {Component} from 'react';
import {Upload, Icon, Modal, message} from 'antd';
import PropTypes from 'prop-types'
import {reqDeleteImg} from '../../api'
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
export default class PicturesWall extends Component {
    static propTypes = {
        imgs: PropTypes.array
    }




    state = {
        previewVisible: false, // 标识是否显示大图预览Modal
        previewImage: '', // 大图的url
        fileList: [
            // {
            //   uid: '-1', // 每个file都有自己唯一的id
            //   name: 'xxx.png', // 图片文件名
            //   status: 'done', // 图片状态: done-已上传, uploading: 正在上传中, removed: 已删除
            //   // url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png', // 图片地址
            //   url: 'http://ctrl010.k1772714.club/images/2020/01/02/15779774673019676.jpg', // 图片地址
            // },
            //
            // {
            //     uid: '-5',
            //     name: 'image.png',
            //     status: 'error',
            // },



        ],
    };

    constructor (props) {
        super(props)


      let fileList  =[]
        // 如果传入了imgs属性
        const {imgs} = this.props
        if (imgs && imgs.length>0) {
            fileList = imgs.map((img, index) => ({
                uid: -index, // 每个file都有自己唯一的id



                // name: img.substr(28,99), // 图片文件名  http://ctrl010.k1772714.club
                name: img, // 图片文件名  http://ctrl010.k1772714.club
                // name: img,// 图片文件名  http://ctrl010.k1772714.club
                status: 'done', // 图片状态: done-已上传, uploading: 正在上传中, removed: 已删除
                url:    img
            }))
        }

        // 初始化状态
        this.state = {
            previewVisible: false, // 标识是否显示大图预览Modal
            previewImage: '', // 大图的url
            fileList // 所有已上传图片的数组
        }
    }
    /*
获取所有已上传图片文件名的数组
 */
    getImgs  = () => {
        return this.state.fileList.map(file => file.name)
    }

    /*
隐藏Modal
 */
    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        console.log('handlePreview',file)
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        // 显示指定file对应的大图

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };
    /*
     file: 当前操作的图片文件(上传/删除)
     fileList: 所有已上传图片文件对象的数组
      */
    handleChange = async ({  file, fileList  }) => {
        console.log('handleChange()', file.state, fileList.length, file)
            // if (file.status === 'done') {
            //     // const result = file;
            //     file = fileList[fileList.length - 1]
            //     message.success('图片上传ok');
            //     // console.log('file1(name)', file.name)  //上传文件名
            //
            //     // const {name} = result.name
            //     file.url = file.response.name
            //     // file.name = file.response.name.substr(28, 99)
            //     file.name = file.response.name
            //
            //     // console.log('file()', file)
            //     // console.log('file.response()', file.response)
            //     // console.log('file(name)', file.name)
            //     // console.log('file(url)', file.url)
            //     // console.log('file(length)', file.length)
            //     // console.log('file(state)', file.state, fileList.length, file,file.name,file.url)
            //
            // } else {
            //     // message.error('上传失败')
            //
            // }
        // 一旦上传成功, 将当前上传的file的信息修正(name, url)
        if(file.status==='done') {
            const result = file.response  // {status: 0, data: {name: 'xxx.jpg', url: '图片地址'}}
            if(result.status==='0') {
                message.success('上传图片成功!')
                const {name} = result
                file = fileList[fileList.length-1]
                // file.name = name.substr(29, 99)
                file.name = name
                file.url = name

                    // console.log('file.url()', file.url)
                    // console.log('file.name()', file.name)

            } else {
                message.error('上传图片失败')
            }
        }

        else if (file.status==='removed') { // 删除图片
            // console.log('dddfile.name()',file.name.substr(29, 99).toString())
            let fileName=file.name.substr(29, 99).toString()
            const result = await reqDeleteImg(fileName)
            // console.log('dddfile.result()', result)

            if (result.status==='0') {
                message.success('删除图片成功!')
            } else {
                message.error('删除图片失败!')
            }
        }

        this.setState({fileList});
        }


    render() {

        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div>
                <Upload
                    action="/file/upload" /*上传图片的接口地址*/
                    accept='image/*'  /*只接收图片格式*/
                    name='file' /*请求参数名*/
                    listType="picture-card"  /*卡片样式*/
                    fileList={fileList}  /*所有已上传图片文件对象的数组*/
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 4 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}

