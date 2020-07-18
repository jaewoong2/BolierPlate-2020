import React, { useState, useEffect, useCallback } from 'react'
import { Modal, message } from 'antd'
import LoginForm from './LoginForm'
import SignUp from './SignUp'
import { useSelector } from 'react-redux'

const ModalForm = ({ visible, setting, setVisible }) => {
    const { loginLoading, loginDone  } = useSelector(state => state.user)
  
    return (
        <Modal
        title={setting === 'SignUp' ? "회원가입" : false}
        visible={visible}
        footer={null}
        closable={setting === 'SignUp' ? true : false }
        maskClosable={setting !== 'SignUp' ? true : false }
        onCancel={useCallback(() => {
          setting !== 'SignUp' ? (!loginLoading && setVisible(false)) :
          setVisible(false)
        },[loginLoading, loginDone])}
      >
        {setting === 'Login' ? <LoginForm setVisible={setVisible}/> : <SignUp setVisible={setVisible}/>}
      </Modal>
    )
}

export default ModalForm
