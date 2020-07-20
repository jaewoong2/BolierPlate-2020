import React, { useState, useRef, useEffect, useCallback, memo, useMemo } from 'react'
import styled from 'styled-components';
import { Button, Form, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { WRTIE_REQUEST, UPLOAD_IMAGES_REQUEST } from '../../reducer/post';
import { LOAD_MYINFO_REQUEST } from '../../reducer/user';
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


const Editor = () => {

  const { wrtieLoading, wrtieDone, ImagePaths } = useSelector((state) => state.post)
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState(ImagePaths)

  const dispatch = useDispatch();
    const Quill = typeof window === 'object' ? require('quill') : () => false;
  
    const imageRef = useRef();
    const quillElement = useRef(null); // Quill을 적용할 DivElement를 설정
    const quillInstance = useRef(null); // Quill 인스턴스를 설정
  
    useEffect(() => { // 글 쓰면 초기화
      if(!wrtieLoading && wrtieDone) { 
        setTitle('');
        setContent('');
        quillInstance.current.root.innerHTML = '';
      }
    },[wrtieLoading, wrtieDone])

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
          // 더 많은 옵션
          // https://quilljs.com/docs/modules/toolbar/ 참고
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
         console.log(quill.root.innerHTML)
        }
      });
      const toolbar = quill.getModule('toolbar');
      toolbar.addHandler('image', onClickImageBtn)
    }, []);

    const onChagneTitle = useCallback((e) => {
        setTitle(e.target.value)
    },[])

   
    const memoDiv = useMemo(() => {
      return <div ref={quillElement}></div>
    })
    
    const onClickWriteBtn = useCallback(() => {
      dispatch({
        type : WRTIE_REQUEST,
        data : {
          title : title,
          content : content,
          image : ImagePaths
        }
      })
    },[title, content, ImagePaths])
    
    const onClickImageBtn = useCallback(() => {
      imageRef.current.click()
  },[imageRef.current])  

  const onChangeImageInput = useCallback((e) => {
      const imageFormData = new FormData();
      [].forEach.call(e.target.files, (f) => {
          imageFormData.append('image', f)
      });
      dispatch({
          type : UPLOAD_IMAGES_REQUEST,
          data : imageFormData
      })
  },[])

  
    return (
        <DivWrapper>
        <QuillWrapper>
            <Form encType="multipart/form-data">
            <TitleInput value={title} onChange={onChagneTitle} placeholder='효림이 바보'/>
            {memoDiv}
            <Button onClick={onClickWriteBtn} style={{ float : 'right', marginTop : 10 }} type="primary">올리기</Button>
              <input hidden type="file" onChange={onChangeImageInput} ref={imageRef}/>
              </Form>
        </QuillWrapper>
        </DivWrapper>
    )
}

export default memo(Editor)
