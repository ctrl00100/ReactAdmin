/*
用来指定商品详情的富文本编辑器组件
 */

import React, {Component} from 'react';
import {EditorState, convertToRaw,ContentState} from 'draft-js';
import {Editor} from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import PropTypes from "prop-types";

export default class RichTextEditor extends Component {

    static propTypes = {
        detail: PropTypes.array
    }
    state = {
        editorState: EditorState.createEmpty(),// 创建一个没有内容的编辑对象
    }

    constructor(props) {
        super(props);
        // const html = '<p>Hey this <strong>editor</strong> rocks 😀</p>';
        const html = this.props.detail;

        if(html){
            const contentBlock = htmlToDraft(html);
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                const editorState = EditorState.createWithContent(contentState);
                this.state = {
                    editorState,
                };
            }
        }else {
            this.state = {
                editorState: EditorState.createEmpty(),// 创建一个没有内容的编辑对象
            }
        }

    }

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };
    getDetail = () => {
        // eslint-disable-next-line no-undef
        return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    }

    render() {
        const {editorState} = this.state;
        return (
            <div>
                <Editor
                    editorState={editorState}
                    editorStyle={{border: '1px solid black', minHeight: 200, paddingLeft: 10}}

                    // wrapperClassName="demo-wrapper"
                    // editorClassName="demo-editor"
                    onEditorStateChange={this.onEditorStateChange}
                />
                {/*<textarea*/}
                {/*    disabled*/}
                {/*    value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}*/}
                {/*/>*/}
            </div>
        );
    }
}
