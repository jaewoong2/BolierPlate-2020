import { useDispatch, useSelector } from 'react-redux'
import { LOAD_MYINFO_REQUEST } from '../reducer/user';
import { LOAD_MYPOST_REQUEST } from '../reducer/post';
import React, { useEffect } from 'react'
import styled from 'styled-components';
import { Avatar } from 'antd';
import Link from 'next/link';
import moment from 'moment';
import 'moment/locale/ko'
import { EditTwoTone } from '@ant-design/icons';
moment.locale('ko')

const CenterdDiv = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`;

const PostViewerBlock = styled.div`
  margin-top: 2rem;
  border: 0.5px solid #86835793;
  box-shadow : 0 5px 10px #777;
  border-radius : 15px 30px;
  width: 80%;
  &:hover {
    border : 1.5px solid #869bc2;
    transition: all 0.1s ease-in;
  }
`;

const PostHead = styled.div`
  padding-bottom: 1.5rem;
  h1 {
    cursor : pointer;
    font-size: 5vw;
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
    content: "\\B7"; /* 가운뎃점 문자 */
  }
`;

const Tags = styled.div`
  margin-left : 1rem;
  margin-top: 0.5rem;
  .tag {
    display: inline-block;
    color: blue;
    text-decoration: none;
    margin-right: 0.5rem;
    &:hover {
      color: #fad2df;
      cursor : pointer;
    }
  }
`;
const PostContent = styled.div`
  margin-left : 10px;
  font-size: 1.1125rem;
  color: #434343;
  overflow: auto;
  img {
    width: 100%;
  }
`;

const DivWrapper = styled.div`
    display : flex;
    justify-content : space-between;
    align-items : center;
    
    span {
    }
`

const PostCard = () => {
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
      {myPost?.map((v) => (
<CenterdDiv>
        <PostViewerBlock>
          <PostHead>
              <DivWrapper>
            <Link href={`/page/${v.id}`}><a><h1>{v.title}</h1></a></Link>
            <SubInfo>
            <span>
              <Avatar
                style={{ marginLeft: "5px", marginRight: "5px", overflow : 'hidden' }}
                size={32}
                src={`http://localhost:3055/${v.User?.Images[0]?.src}`}
              ></Avatar>
              <b>{v.User?.nickname}</b>
            </span>
              <span>{moment(v.createdAt).format('YYYY.MM.DD')}</span>
              <span style={{ marginRight : '4px'}}><EditTwoTone/></span>
            </SubInfo>
            </DivWrapper>
            <Tags>
              <div className="tag">#태그1</div>
              <div className="tag">#태그2</div>
              <div className="tag">#태그3</div>
            </Tags>
          </PostHead>
          <PostContent dangerouslySetInnerHTML={{ __html: v.content.length > 30 ? v.content.slice(0,30) +' ....' : v.content }} />
        </PostViewerBlock>
      </CenterdDiv>
      ))}
    </div>
  );
};

export default PostCard;
