import React from 'react'
import styled from 'styled-components'
import { UserOutlined, KeyOutlined } from '@ant-design/icons'

const StyledDivForInputWrapper = styled.div`
    display : flex;
    width : 100%;
    justify-content : center;
    align-items : center;
    border : 1px solid black;

    .inputWrapper {
        display : flex;
        align-items : center;
        margin-top : 15px;
        margin-bottom : 15px;
        border : 0;
        border-bottom : 1px solid #d9d9d9;

        input {
            margin-left : 10px;
            border : 0;
            background-color : inherit;
            font-size : 0.95rem;

            &:focus {
                outline : 0;
            }
        }
            &:focus {
                outline : 0;
                border : 0;
                border-bottom : 1.5px solid #638af7c7;
            }
    }
`




const LoginForm = () => {
    return (
        <StyledDivForInputWrapper>
            <div>
            <div className="inputWrapper">
            <UserOutlined/>
            <input placeholder="로그인"></input>
            </div>
            <div className="inputWrapper">
            <KeyOutlined/>
            <input type="password" placeholder="비밀번호"></input>
            </div>
            </div>
        </StyledDivForInputWrapper>
    )
}

export default LoginForm
