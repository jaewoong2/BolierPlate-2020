import React, { useCallback, useMemo, useState, useEffect } from 'react'
import styled from 'styled-components'
import useSWR from 'swr'
import axios from 'axios';
import { Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { HASHTAG_SEARCH_REQUEST } from '../reducer/post';

const CenterDiv = styled.div`
    width : 90%;
    text-align : center;
`

const CenterdDiv = styled.div`
    width : 100%;
    display : flex;
    justify-content : center;
    align-items : flex-end;
`

const HashText = styled(Typography.Text)`
    margin-right : 5px;
    color : #7793acea;
    word-break: keep-all;
    cursor : pointer;
    &:hover {
        font-weight : bolder;
        transition : font-weight 0.1s ease-in-out;
    }
`

const fetcher = (url) => axios.get(url, { withCredentials: true })
    .then((result) => result.data);

const HashtagSearch = () => {
    const { data : HashTags, error } = useSWR(`http://localhost:3055/hashtag`, fetcher);

    return (
        <CenterdDiv>
        <CenterDiv>
        {HashTags?.map(hashtag => <HashtagText hashtag={hashtag}/>)}
        </CenterDiv>
        </CenterdDiv>
    )
}


const HashtagText = ({ hashtag }) => {
    const { tagName } = useSelector((state) => state.post)
    const [strongText, setStrongText] = useState('')
    const dispatch = useDispatch();

    const searchHashtag = useCallback((tag) => () => {
        tagName !== tag && dispatch({
           type : HASHTAG_SEARCH_REQUEST,
           data : {
               name : encodeURIComponent(tag)
           }
       })
   },[tagName])
   
   useEffect(() =>{
       setStrongText(tagName)
   },[tagName])

    const fontStyleMemo = useMemo(() => {
        if(hashtag?.Posts?.length * 1.15 + 10.5 > 100) {
            if(strongText === hashtag?.name) {
                return { 
                    color : 'black', 
                    fontSize : 100,
                }
            }
            return { 
                fontSize : 100, 
            }
        }
        if(hashtag?.Posts?.length * 1.15 + 10.5 < 100) {
            if(strongText === hashtag?.name) {
                return { 
                    color : 'black', 
                    fontSize : hashtag?.Posts?.length * 1.15 + 10.5,
                }
            }
            return { fontSize : hashtag?.Posts?.length * 1.15 + 10.5 }
        }
    },[hashtag, strongText])

    return (
<HashText style={fontStyleMemo} onClick={searchHashtag(hashtag?.name)}>{hashtag?.name}</HashText>
    )
}

export default HashtagSearch
