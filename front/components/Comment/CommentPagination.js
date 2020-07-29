import React, { useCallback } from 'react'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import Link from 'next/link'

const StyledDivForFlex = styled.div`
    display : flex;
    justify-content : space-between;
    align-items : center;
    margin-right : 10%;
    margin-bottom : 10px;
    margin-top : 10px;

    .chart {
        text-align : center;
        margin-left : 10%;
        font-size : 17px;
    }
    
    span {
        font-size : 20px;
    }
`

const StyledLeftOutlined = styled(LeftOutlined)`
    font-size : 20px;
    font-weight : bolder;
    &:hover{
        color : #6868dac0;
        cursor : pointer;
    }
`

const StyledRightOutlined = styled(RightOutlined)`
    font-size : 20px;
    font-weight : bolder;
  &:hover{
        color : #6868dac0;
        cursor : pointer;
    }

`

const CommentPagination = ({comment, number, setNumber}) => {

    const onClickRightBtn = useCallback(() => {
        5 * (number + 1) < comment.length  && setNumber(prev => prev + 1)
    },[number])

    const onClickLeftBtn = useCallback(() => {
        number > 0 &&
        setNumber(prev => prev - 1)
    },[number])


    return (
        <StyledDivForFlex>
        <div className="chart"><Link href="/"><a>목록</a></Link></div>
        <div>
        <StyledLeftOutlined onClick={onClickLeftBtn}/>
            <span>{number + 1}</span>
        <StyledRightOutlined onClick={onClickRightBtn}/>
        </div>
        </StyledDivForFlex>
    )
}

export default CommentPagination
