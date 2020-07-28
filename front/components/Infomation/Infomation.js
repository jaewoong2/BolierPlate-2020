import React, { useMemo, useEffect, useRef, useState, useCallback } from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { Col, Row } from 'antd'
import { useRouter } from 'next/router'
import InfomationContnet from './InfomationContnet'
import { COVER_POST } from '../../reducer/post'

const StyledDivForWrapperFlex = styled(Row)`
        width : 100%;
        height : 0%;
        display : flex;
        justify-content : center;
        align-items : flex-end;
        background-color : yellow;
        transition : height 0.5s linear;
    `
const StyledDivForContent = styled(Col)`
    display : flex;
    justify-content : center;
    bottom : 10vh;
    width : 100%;
    height : 0%;
    position : fixed;
    background-color : #ffffffff;
    border : 0.1px solid #2622eed8;
    border-bottom : 0;
    box-shadow : 4px 4px 10px #777;
    border-radius : 50px 50px 0px 0px;
    z-index : 4;
    transition : height 0.5s linear;
`


const Infomation = () => {
    const { CoverUp, CoverUserId } = useSelector(state => state.post)
    const dispatch = useDispatch()
    const [normal, setNormal] = useState({});
    const router = useRouter();

    useEffect(() => {
        !CoverUp && setNormal({
            height : 0,
            border : 0,
        })
        CoverUp && setNormal({
            height : '70%',
            })
    },[CoverUp])


    if(!router.pathname.slice(1).includes('page/') && router.pathname.slice(1)) {
        return <div></div>;
    }
    
    
    return (
        <StyledDivForWrapperFlex>
           <StyledDivForContent name="cover" style={normal} xs={20} md={16}>
            {CoverUp && CoverUserId && <InfomationContnet />}
            </StyledDivForContent>
        </StyledDivForWrapperFlex>
    )
}

export default Infomation
