import React from 'react'
import { Row, Col } from 'antd'
import styled from 'styled-components';
import NavBar from './NavBar';

const ColStyled = styled(Col)`
    height : 80vh;
    width : 100vw;
    background-color : #f5f0f0b0;
    justify-content : space-between;
`

const RowStyled = styled(Row)`
height : 100vh;
display : flex;
justify-content : center;
 align-items : center;

`

const MyLayout = () => {

    return (
        <RowStyled justify="space-between" align="middle">
      <Col  xs={24} md={3}  span={4}>
      </Col>
      <ColStyled xs={24} md={18} span={4}>
            <NavBar/>
      </ColStyled>
      <Col  xs={24} md={3}  span={4}>
      </Col>
    </RowStyled>
    )
}

export default MyLayout
