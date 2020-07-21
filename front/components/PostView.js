import { useDispatch, useSelector } from 'react-redux'
import { LOAD_MYINFO_REQUEST } from '../reducer/user';
import { LOAD_MYPOST_REQUEST } from '../reducer/post';
import React, { useEffect } from 'react'
import styled from 'styled-components';
import { Avatar } from 'antd';

const CenterdDiv = styled.div`
    width : 100%;
    height : 100%;
    display : flex;
    justify-content : center;
`

const PostViewerBlock = styled.div`
  margin-top: 2rem;
  border : 0.5px solid #4e4c2e2d;
  width : 80%;
  &:hover {
    -moz-box-shadow: 0 15px 10px #777;
  box-shadow: 0 15px 10px #777;
      transition : all 0.1s ease-in;
  }
`;
const PostHead = styled.div`
  border-bottom: 1px solid #434343;
  padding-bottom: 3rem;
  margin-bottom: 3rem;
  h1 {
    font-size: 3rem;
    line-height: 1.5;
    margin: 0;
  }
`;
const SubInfo = styled.div`
  margin-top: 1rem;
  color: #434343;

  /* span 사이에 가운뎃점 문자 보여 주기 */
  span + span:before {
    color: #434343;
    padding-left: 0.25rem;
    padding-right: 0.25rem;
    content: '\\B7'; /* 가운뎃점 문자 */
  }
`;

const Tags = styled.div`
  margin-top: 0.5rem;
  .tag {
    display: inline-block;
    color: #434343;
    text-decoration: none;
    margin-right: 0.5rem;
    &:hover {
      color: #434343;
    }
  }
`;
const PostContent = styled.div`
  font-size: 1.3125rem;
  color: #434343;
  overflow : auto;
  
  img {
      width :100%;
  }
`;

const PostView = () => {
    const dispatch = useDispatch();
    const { myPost } = useSelector(state => state.post)
    const { loginInfo } = useSelector((state) => state.user)

    useEffect(() => {
        dispatch({
            type : LOAD_MYINFO_REQUEST
        })
        dispatch({
            type : LOAD_MYPOST_REQUEST
        })
    },[])



    return (
        <div>
            {myPost?.map(v => {
                return (
                    <CenterdDiv>
                    <PostViewerBlock>
                    <PostHead>
                      <h1>{v.title}</h1>
                      <SubInfo>
                        <span>
                        <Avatar style={{ marginLeft : '5px', marginRight: '5px'}} size={32} src={`http://localhost:3055/${v.User?.Images[0]?.src}`}></Avatar>
                        <b>{v?.User?.nickname}</b>
                        </span>
                        <span>{new Date().toLocaleDateString()}</span>
                      </SubInfo>
                      <Tags>
                        <div className="tag">#태그1</div>
                        <div className="tag">#태그2</div>
                        <div className="tag">#태그3</div>
                      </Tags>
                    </PostHead>
                    <PostContent
                      dangerouslySetInnerHTML={{ __html: v.content }}
                    />
                  </PostViewerBlock>
                  </CenterdDiv>
                )
            })}
        </div>
    )
}

export default PostView
