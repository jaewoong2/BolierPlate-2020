import React, { useMemo, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { Col } from 'antd'
import { useRouter } from 'next/router'
import InfomationContnet from './InfomationContnet'

const StyledDivForWrapperFlex = styled.div`
        display : flex;
        justify-content : center;
        align-items : flex-end;
        width : 100vw;
        height : 100vh;
        transition : height 0.5s linear;
        background-color : inherit;
    `
const StyledDivForContent = styled(Col)`
    display : flex;
    justify-content : center;
    bottom : 10vh;
    width : 100%;
    height : 70%;
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

    if(router.pathname.slice(1)) {
        return <div></div>
    }

    return (
        <StyledDivForWrapperFlex  style={normal}>
           <StyledDivForContent name="cover" style={normal} xs={20} md={16}>
            {CoverUp && CoverUserId && <InfomationContnet UserId={CoverUserId} / >}
            </StyledDivForContent>
        </StyledDivForWrapperFlex>
    )
}

export default Infomation
