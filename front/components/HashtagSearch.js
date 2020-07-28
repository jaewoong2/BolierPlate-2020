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
    const { data, error } = useSWR(`http://localhost:3055/hashtag`, fetcher);
    const { PostsData, tagName,  } = useSelector((state) => state.post)
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

    return (
        <CenterdDiv>
        <CenterDiv>
        {data?.map(v => {
     return (<HashText  style={{fontSize : (v?.Posts?.length * 1.25 + 10.5) > 100 ? 100 : (v?.Posts?.length * 1.25 + 10.5), color : strongText === v?.name && 'black'}} onClick={searchHashtag(v?.name)}>{v?.name}</HashText>)
            })}
        </CenterDiv>
        </CenterdDiv>
    )
}

export default HashtagSearch
