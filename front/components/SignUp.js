import React, {useCallback, useEffect, useState } from 'react';
import {
    Form,
    Input,
    Tooltip,
    Checkbox,
    Button,
    message,
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { REGISTER_USER_REQUEST } from '../reducer/user';

  
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

const SignUp = ({ setVisible }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [mounted, setMounted] = useState(false);
    const { registerUserLoading, registerUserDone } = useSelector(state => state.user);

    // useEffect(() => {
    //     !registerUserLoading && registerUserDone && setVisible(false)
    //     registerUserDone && !registerUserLoading && message.info('회원가입 성공')
    //   },[registerUserLoading, registerUserDone])
      
    const onFinish = useCallback((values) => {
        dispatch({
            type : REGISTER_USER_REQUEST,
            data : values
        })
        setMounted(true)
        
    }, []);

    useEffect(() => {
        mounted && !registerUserLoading && setVisible(false)
        mounted && !registerUserLoading && message.info('회원가입 성공')
    },[registerUserLoading, registerUserDone, mounted])

    return (
        <div>
             <div>
            <Form
                {...formItemLayout}
                form={form}
                name="register"
                onFinish={onFinish}
                scrollToFirstError
            >
                <Form.Item
                    name="email"
                    label="이메일"
                    rules={[
                        {
                            type: 'email',
                            message: 'The input is not valid E-mail!',
                        },
                        {
                            required: true,
                            message: '이메일을 입력 해주세요',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="비밀번호"
                    rules={[
                        {
                            required: true,
                            message: '비밀번호를 입력해주세요',
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label="비밀번호 확인"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: '비밀번호를 확인 해야합니다',
                        },
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject('비밀번호가 일치 하지 않습니다.');
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="nickname"
                    label={
                        <span>
                            닉네임&nbsp;
            <Tooltip title="당신의 별명은 무엇인가요?">
                                <QuestionCircleOutlined />
                            </Tooltip>
                        </span>
                    }
                    rules={[{ required: true, message: '닉네임을 설정해주세요', whitespace: true }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="agreement"
                    valuePropName="checked"
                    rules={[
                        { validator: (_, value) => value ? Promise.resolve() : Promise.reject('동의 하셔야 합니다.') },
                    ]}
                    {...tailFormItemLayout}
                >
                    <Checkbox>
                        <a>약관</a>
                    </Checkbox>
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <Button loading={registerUserLoading} type="primary" htmlType="submit">
                        회원가입
        </Button>
                </Form.Item>
            </Form>
            </div>
        </div>
    )
}

export default SignUp
