import React, { useRef, useEffect, useCallback, useState, useMemo, memo } from 'react'
import styled from 'styled-components'
import { Tooltip, Col } from 'antd'
import moment from 'moment';
import Link from 'next/link';
import Router from 'next/router';
const StyledDivForContainer = styled(Col)`

    height : 15vh;
    .content {
        border : 3px solid #dbdbdb;
        padding-top : 5px;
        padding-left : 10px;
        margin-left : 10px;
        height : 100%;
        overflow-y : scroll;
        border-radius : 7px 7px 7px 7px ;

        .title {
            width : 32%;
            height : 20px;
            margin-bottom : 5px;
            margin-right : 10px;
            overflow : hidden;
            white-space : nowrap;
            text-overflow : ellipsis;
            border-right : 2px solid #1d7dccd3;
            a {
                color : black;
                &:hover {
                color : gray;
                cursor : pointer;
            }
        }
        }

        .contentWrapper {
            display : flex;
            justify-content : space-between;
            b {
                padding-left : 10px;
                margin-right : 10px;
                border-left : 2px solid #1d7dccd3;
            }
            .innerHtml {
                overflow : hidden;
            }
        }
        
        .innerHtml {
            overflow : hidden;
            white-space : nowrap;
            text-overflow : ellipsis;
        }


    }
`

const StyledDivForTabWrapper = styled.div`
    display : flex;
    position : relative;
    .emptyBox {
        width : 80%;
    }
`

const StyledDivForTab = styled.div`
    margin-left : 10px;
    width : 90px;
    height : 30px;
    text-align : center;
    border : 0;
    border : 3px solid #1d7dccd3;
    border-bottom : 0;
    border-radius : 7px 7px 0 0 ;
    transition : border 300ms, font-weight 300ms;
    &:hover {
        font-weight : bolder;
        cursor : pointer;
        border : 3px solid #0c20ced3;
        border-bottom : 0;
        transition : border 300ms, font-weight 300ms ;
    }
    transition : border 300ms, font-weight 300ms ;

`




const InfomationUserPost = ({ User }) => {
    const [clicked, setClicked] = useState('글');

    
    const onClickTab = useCallback((e) => {
        setClicked(e.currentTarget.innerText);
    },[])

    const clickStyle = useMemo(() => {
         return {
                fontWeight : 'bolder',
                border : '3px solid #0c20ced3',
                borderBottom : 0,
                backgroundColor : '#dbdbdeaa'
        }
    },[])

    if(!User) {
        return <div></div>
    }


    return (
        <StyledDivForContainer xs={23.5}>
        <StyledDivForTabWrapper>
            <StyledDivForTab style={clicked === '글' ? clickStyle : {}} onClick={onClickTab}>글</StyledDivForTab>
            <StyledDivForTab style={clicked === '좋아요' ? clickStyle : {}} onClick={onClickTab}>좋아요</StyledDivForTab>
            <div className="emptyBox"></div>
        </StyledDivForTabWrapper>
        <Col xs={22} md={24} className="content">
        {clicked === '글' && User?.Posts?.map((v, i) =>
        (<Col xs={24} className="contentWrapper">
        <div className="title">
                <Link href={`/page/${v?.id}`}><a>{i + 1}. {v?.title}</a></Link>
                </div>
                <div className="innerHtml" dangerouslySetInnerHTML={{__html : v?.content.length > 20 ? v?.content?.slice(0, 19) + '...' : v?.content}} />   
                <div>
                <b>{moment(v?.createdAt).format('MM.DD.')}</b>             
                </div>
            </Col>
                ))}
        </Col>
        </StyledDivForContainer>
    )
}

export default memo(InfomationUserPost)
