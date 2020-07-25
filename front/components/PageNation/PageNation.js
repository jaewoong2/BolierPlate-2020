import React from 'react'
import styled from 'styled-components'
import { CaretLeftOutlined, CaretRightOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'

const StyledDivForPage = styled.div`
    text-align : center;
    position : fixed;
    right : 10vw;
    top : 50vh;
    font-size : 15px;

`

const StyledDivForPageSamll = styled.div`
    text-align : center;
    position : fixed;
    left : 1vw;
    bottom : 7vh;
    font-size : 15px;

`


const StyledCaretLeftOutlinedForPage = styled(CaretLeftOutlined)`
    color : #ffffb5;
    font-size : 17px;
`

const StyledCaretRightOutlinedForPage = styled(CaretRightOutlined)`
    color : #ffffb5;
    font-size : 17px;
`

const StyledCaretUpOutlinedForPage = styled(CaretUpOutlined)`
    color : #ffffb5;
    font-size : 17px;
`

const StyledCaretDownOutlinedForPage = styled(CaretDownOutlined)`
    color : #ffffb5;
    font-size : 17px;
`



const PageNation = ({resSmall}) => {

    const router = useRouter();
    if(router.pathname.slice(1)) {
        return false
    }

    if(resSmall) {
        return (
            <StyledDivForPageSamll>
            <StyledCaretLeftOutlinedForPage/>
            {3}
            <StyledCaretRightOutlinedForPage/>
        </StyledDivForPageSamll>
        )
    }

    return (
        <StyledDivForPage>
            <StyledCaretUpOutlinedForPage/>
            <br/>
            {3}
            <br/>
            <StyledCaretDownOutlinedForPage/>
        </StyledDivForPage>
    )
}

export default PageNation
