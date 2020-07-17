import React, { useState, useEffect } from 'react'
import { Modal } from 'antd'
import LoginForm from './LoginForm'
import SignUp from './SignUp'

const ModalForm = ({ visible, setting, setVisible }) => {
    // const [setting, setSetting] = useState('');

    // useEffect(() => {
    //     setSetting(login || signup)
    // },[])


    return (
        <Modal
        title={setting === 'SignUp' ? "회원가입" : false}
        visible={visible}
        footer={null}
        closable={setting === 'SignUp' ? true : false }
        maskClosable={setting !== 'SignUp' ? true : false }
        onCancel={() => {
            setVisible(false)
        }}
      >
        {setting === 'Login' ? <LoginForm setVisible={setVisible}/> : <SignUp/>}
      </Modal>
    )
}

export default ModalForm
