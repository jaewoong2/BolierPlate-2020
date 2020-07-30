import React, { useState, useRef, useEffect, useCallback, memo, useMemo } from 'react'
import styled from 'styled-components';
import { Button, Form, Input, message, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { WRTIE_REQUEST, UPLOAD_IMAGES_REQUEST } from '../../reducer/post';
import { CloseOutlined, CloseCircleFilled, MinusCircleFilled, MinusOutlined, FileSearchOutlined } from '@ant-design/icons';
import { LOAD_MYINFO_REQUEST } from '../../reducer/user';
import UseInput from '../../Hooks/UseInput';
import Router from 'next/router';

const searchSrc = (root) => {
  const arr1 = root.split('img').map(v => v.includes('src') === true && v.split("src="));
  const arr2 = arr1.map(v => v && v[1]?.split("></p"))
  return arr2.map(v => v && v[0].slice(1, v[0]?.length - 1)).filter(v => v !== false);
}


const TitleInput = styled.input`
  font-size: 2.3rem;
  outline: none;
  padding-bottom: 0.5rem;
  background-color : inherit;
  border: none;
  border-bottom: 1px solid #434343;
  margin-bottom: 2rem;
  width: 100%;
  
  &:focus {
    border-bottom: 2px solid #763cb8b0;
    transition : border-bottom 0.4s ease-out;
  } 
`;
const QuillWrapper = styled.div`
  /* 최소 크기 지정 및 padding 제거 */
    width : 80%;
    margin-top : 10px;
  .ql-editor {
    padding: 0;
    padding-left : 10px;
    min-height: 10vh;
    font-size: 1.125rem;
    line-height: 1.5;
    overflow-y : scroll;
  }
  .ql-editor.ql-blank::before {
    left: 10px;
  }

  .ql-container {
    height : 50vh;
  }
`;

const DivWrapper = styled.div`
    width : 100%;
    height : 100%;
    display : flex;
    justify-content : center;
`

function DataURIToBlob(dataURI) {
  const splitDataURI = dataURI.split(',')
  const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
  const mimeString = splitDataURI[0].split(':')[1].split(';')[0]
  const ia = new Uint8Array(byteString.length)
  for (let i = 0; i < byteString.length; i++)
      ia[i] = byteString.charCodeAt(i)

  return new Blob([ia], { type: mimeString })
}

function Base64toServerImage(fullstring) {
  const changeStr = fullstring.split('>').map(v => { 
    if(v.includes("<p")) {
     return v + '>'
   } else if(v.includes("</p")) {
   return v + '>'
   } else if(v.includes("<img")) {
     if(v.length > 2000) {
      return false
     } return v + '>'
   } else {
   return false
   } } ).filter(v => v !== false).join('')

   return changeStr
}


const Editor = ({ data }) => {
  const { wrtieLoading,wrtieError, wrtieDone, ImagePaths, uploadImagesDone } = useSelector((state) => state.post)
  const { loginInfo, loadUserInfoLoading, loadUserInfoDone } = useSelector((state) => state.user)
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [count, setCount] = useState(0);
  const [images, setImages] = useState(ImagePaths)
  const [hashtag, setHashtag, hashtagChange] = UseInput('');
  const [hashtagArr, setHashtagArr] = useState([]);

  const dispatch = useDispatch();
  const Quill = typeof window === 'object' ? require('quill') : () => false;

    const imageRef = useRef();
    const quillElement = useRef(); // Quill을 적용할 DivElement를 설정
    const quillInstance = useRef(); // Quill 인스턴스를 설정
  
    useEffect(() => {
      if(data && loginInfo) {
        if(data.User.id && loginInfo.id) {
          if(data?.User?.id !== loginInfo?.id) {
            message.warn('접근할 수 없는 페이지...')
            Router.back()
          } 
        }
      }
      if(data === null) {
        message.warn('존재하지 않는 게시글...')
        Router.back()
      }
      if(loadUserInfoDone && !loadUserInfoLoading && !loginInfo.id) {
          message.warn('접근할 수 없는 페이지...')
          Router.back()
      }
    },[data, loginInfo, loadUserInfoDone, loadUserInfoLoading])

    useEffect(() => {
     count && !wrtieError && !wrtieLoading && wrtieDone && (() => {
        message.info('글 올리기 성공!')
        Router.replace('/')
      })()
      count && wrtieError && message.warn('글 올리기 실패...')
  },[wrtieDone, wrtieLoading, wrtieError, count])

   
    useEffect(() => { // 수정!
      if(quillInstance?.current?.root) {
        searchSrc(quillInstance?.current?.root?.innerHTML).map((v, i) => { 
          if(v?.length > 1000) {
              const imgBase64 = v;
              const file = DataURIToBlob(imgBase64);
              const formData = new FormData();
              const nameMaking = `${Math.floor(Math.random() * 3000)}` + '_' + `${new Date().getTime()}`;
              formData.append('image', file, nameMaking);
              dispatch({
                type : UPLOAD_IMAGES_REQUEST,
                data : formData
            })
          }
        })
        if(ImagePaths) {
          searchSrc(quillInstance?.current?.root?.innerHTML).map((v, i) => {
            if(v?.length > 1000) {
              const innerHTML = Base64toServerImage(quillInstance?.current?.root?.innerHTML);
              quillInstance.current.root.innerHTML = innerHTML;
            }
          })
        }
      }
    },[data, quillInstance?.current?.root?.innerHTML, ImagePaths])


    useEffect(() => { // 수정!
      if(quillInstance?.current?.root) {
        if(data) {
          setTitle(data.title)
          setContent(data.content)
          setHashtagArr(data.Hashtags?.map(v => v.name)) 
          quillInstance.current.root.innerHTML = data.content;
        }
      }
    },[data, quillInstance?.current?.root])

   
    
    useEffect(() =>{
      if(title.lnegth > 200) {
        message.warn('제목의 길이가 너무 길어요..')
        setTitle(prev => {
          const returnTitle = prev.slice(0,19);
          return returnTitle;
        })
      }
    },[title])


    useEffect(() => { // 글 쓰면 초기화
      if(images !== ImagePaths) {
        ImagePaths.map((v,i) => {
          if(!images[i]) {
            quillInstance.current.root.innerHTML = quillInstance.current.root.innerHTML + `<img src="http://localhost:3055/${v}"/>`
          } 
        })
      }
      setImages(ImagePaths)
    },[ImagePaths])

    useEffect(() => { // 마운트 될 떄 초기화 
      setTitle('');
      setContent('');
      dispatch({
        type : LOAD_MYINFO_REQUEST
      })
        return () => {
          setTitle('');
          setContent('');
          dispatch({
            type : LOAD_MYINFO_REQUEST
          })
        }
    },[])

    useEffect(() => { // quill editor 생성
      quillInstance.current = new Quill(quillElement.current, {
        theme: 'snow',
        placeholder: '내용을 작성하세요...',
        modules: {
          toolbar: [
            [{ header: '1' }, { header: '2' }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['blockquote', 'code-block', 'link', 'image'],
          ],
        },
      });
      const quill = quillInstance.current;

      quill.on('text-change', (delta, oldDelta, source) => {
        if(source === 'user') {
         setContent(quill.root.innerHTML);
        }
      });
      const toolbar = quill.getModule('toolbar');
      toolbar.addHandler('image', onClickImageBtn)

      const clipboard = quill.getModule('clipboard');
      clipboard.addHandler
    }, []);

    const onChagneTitle = useCallback((e) => {
        setTitle(e.target.value)
    },[])
   
    const memoDiv = useMemo(() => {
      return <div ref={quillElement}></div>
    })
    
    const onClickWriteBtn = useCallback(() => {
      if(title.trim() === "") {
        return message.warn('제목을 작성 해주세요..')
      }
      if(content.replace(/(<([^>]+)>)/ig,"").trim() === ""){
        return message.warn('내용을 작성 해주세요..')
      }
      if(!data) {
        dispatch({
          type : WRTIE_REQUEST,
          data : {
            title : title,
            content : content,
            image : searchSrc(quillInstance?.current?.root?.innerHTML),
            hashtag : hashtagArr
          }
        })
      } else {
        dispatch({ // 수정
          type : WRTIE_REQUEST,
          data : {
            id : data.id,
            title : title,
            content : content,
            image : searchSrc(quillInstance?.current?.root?.innerHTML),
            edit : true,
            hashtag : hashtagArr
          }
        })
      }
      setCount(prev => prev + 1);
    },[title, content, ImagePaths, data, hashtagArr])
    
    const onClickImageBtn = useCallback(() => {
      imageRef.current.click()
  },[imageRef.current])  

  const onChangeImageInput = useCallback((e) => {
      const imageFormData = new FormData();
      [].forEach.call(e.target.files, (f) => {
          console.log(imageFormData)
          imageFormData.append('image', f)
      });
      dispatch({
          type : UPLOAD_IMAGES_REQUEST,
          data : imageFormData
      })
  },[])

  const hashtagRegister = useCallback(() => {
    setHashtagArr(prev => {
      const newArr = prev.concat(hashtag)
      return newArr
    })
    setHashtag('');
  },[hashtag])

  
  const cancelHash = useCallback((idx) => () => {
      setHashtagArr(prev => {
       const newArr = prev.filter((v, i) => i !== idx);
       return newArr
      })
  })


    return (
        <DivWrapper>
        <QuillWrapper>
            <Form encType="multipart/form-data">
            <TitleInput value={title} onChange={onChagneTitle} placeholder='효림이 바보'/>
            {memoDiv}
            <Input
            onPressEnter={hashtagRegister}
            value={hashtag}
            onChange={hashtagChange}
            suffix={<Button  onClick={hashtagRegister} type="primary">등록</Button>}
            style={{ width :'300px', marginTop : 10}}
            prefix={<div style={{ borderRight :'2px solid blue' , paddingRight : '10px',color : 'green', marginRight : '5px'}}>
              해쉬태그</div>}>
              </Input>
            <Button onClick={onClickWriteBtn} style={{ float : 'right', marginTop : 10 }} type="primary">올리기</Button>
            <input hidden type="file" onChange={onChangeImageInput} ref={imageRef}/>
              </Form>
            {hashtagArr?.map((v, i) => <Typography.Text code>{v}<MinusOutlined onClick={cancelHash(i)} style={{ marginLeft : 4, color : '#0c0101'}} /></Typography.Text>)}
        </QuillWrapper>
        </DivWrapper>
    )
}

export default memo(Editor)
