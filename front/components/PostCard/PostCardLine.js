import React from 'react'
import styled from 'styled-components'
import { SmileOutlined } from '@ant-design/icons'

const LineWrapperDiv = styled.span`
   display : flex;
    align-items : center;
    margin-left : 4vw;
    margin-top : 3px;
    width : 90%;
    justify-content : center;

    .left, .right {
        width : 40%;
        border-bottom : 2px dashed #777;
    }

    .smile {
        color : #50db7eea;
        font-size : 17;
        margin-left : 7px;
        margin-right : 7px;
    }
`

const PostCardLine = () => {
    return (
        <LineWrapperDiv>
            <div className="left"/>
            <SmileOutlined className="smile"/>
            <div className="right"/>    
        </LineWrapperDiv>
    )
}

export default PostCardLine;