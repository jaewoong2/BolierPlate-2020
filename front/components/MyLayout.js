import React, { useEffect, useState } from 'react'
import { Row, Col } from 'antd'
import styled from 'styled-components';
import NavBar from './NavBar';
import Editor from './Edit/Editor';
import PostView from './PostView';
import PostCard from './PostCard';

const ColStyled = styled(Col)`
    height : 80vh;
    width : 100vw;
    background-color : white;
    justify-content : space-between;
    overflow-y : scroll;
    overflow-x : auto;
`

const RowStyled = styled(Row)`
height : 100vh;
display : flex;
justify-content : center;
align-items : center;
`

const MyLayout = ({ children }) => {
  
    return (
    <RowStyled justify="space-between" align="middle">
      <Col  xs={24} md={3}  span={4}>
      </Col>
      <ColStyled xs={24} md={18} span={4}>
            <NavBar />
            {children}
            <PostCard/>
            {/* <PostView/> */}
      </ColStyled>
      <Col xs={24} md={3}  span={4}>
      </Col>
    </RowStyled>
    )
}

export default MyLayout
