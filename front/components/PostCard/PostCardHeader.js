import React, { useCallback } from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import { message } from 'antd'
import { EyeOutlined, HeartTwoTone } from '@ant-design/icons'

const DivWrapper = styled.div`
display : flex;
justify-content : space-between;

.veiw {
display : flex;
align-items : center;
font-size : 15px;

.viewnumber {
  margin-left : 2px;
  margin-right : 7px;
}
}

span {
  color : #686767;
  font-style : italic;
}

.title {
  &:hover {
    color : #526a7e;
    font-weight : bolder;
  }
}

a{
  display : flex;
}

.like {
display : flex;
justify-content : flex-end;

.heart {    
    display : flex;
    align-items : center;
    font-size : 15px;
    margin : 0;
    padding : 0;
    margin-right : 4px;
    font-size : 16px;
    cursor : pointer;
}    

span {
    margin : 0;
    padding : 0;
    margin-right : 10px;
    font-size : 18px;
    font-style : italic;
}
}

`


const PostCardHeader = ({ postData, loginInfo, Liker, index }) => {


        
const onClickLike = useCallback(() => {
    if(!loginInfo.id) {
      return message.warn('로그인 후 이용 가능합니다')
    } else {
      !Liker && dispatch({
        type : LIKE_POST_REQUEST,
        id : postData.id
      });
      Liker && dispatch({
        type : UNLIKE_POST_REQUEST,
        id : postData.id
      })
    }
  },[Liker, postData, loginInfo]);
  
    
    return (
        <DivWrapper>
            <Link href={`/page/${postData?.id}`}>
              <a><h1 className="title">
                <span className="number">{index + 1} .</span>{postData?.title}
                </h1></a></Link>
                <div className="veiw">
                <EyeOutlined/><span className="viewnumber" >{postData?.Views?.length}</span>
                <div className="like">
                <HeartTwoTone twoToneColor={Liker ? 'red' : 'gray'} onClick={onClickLike} className="heart" />
                <span>
                  {postData?.Likers?.length}
                  </span>
                </div>
                  </div>
        </DivWrapper>
    )
}

export default PostCardHeader



