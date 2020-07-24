import React, { useCallback } from 'react'
import styled from 'styled-components'
import useSWR from 'swr'
import axios from 'axios';
import { Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { HASHTAG_SEARCH_REQUEST } from '../reducer/post';

const CenterDiv = styled.div`
    width : 80%;
    text-align : center;
`

const CenterdDiv = styled.div`
    width : 100%;
    display : flex;
    justify-content : center;
`
const HashText = styled(Typography.Text)`
    margin-right : 3px;
    font-size : 12px;
    color : #0f2438;
    word-break: keep-all;
`

const fetcher = (url) => axios.get(url, { withCredentials: true })
    .then((result) => result.data);

const HashtagSearch = () => {
    const { data, error } = useSWR(`http://localhost:3055/hashtag`, fetcher);
    const { myPost } = useSelector((state) => state.post)
    const dispatch = useDispatch();

    const searchHashtag = useCallback((tag) => () => {
        dispatch({
            type : HASHTAG_SEARCH_REQUEST,
            data : {
                name : encodeURIComponent(tag)
            }
        })
    })

    return (
        <CenterdDiv>
        <CenterDiv>
            {data?.map(v => {
                 return <HashText onClick={searchHashtag(v?.name)} keyboard>{v?.name}</HashText>
                })}
        </CenterDiv>
        </CenterdDiv>
    )
}

export default HashtagSearch
