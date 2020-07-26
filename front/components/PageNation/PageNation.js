import React, { useCallback, useState, useEffect } from 'react'
import styled from 'styled-components'
import { CaretLeftOutlined, CaretRightOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { LOAD_POSTS_REQUEST } from '../../reducer/post'
import useSWR from 'swr'
import Axios from 'axios'

const StyledDivForPage = styled.div`
    text-align : center;
    position : fixed;
    right : 10vw;
    top : 50vh;
    font-size : 15px;

`

const StyledDivForPageSamll = styled.div`
    text-align : center;
    position : fixed;
    left : 1vw;
    bottom : 7vh;
    font-size : 15px;

`


const StyledCaretLeftOutlinedForPage = styled(CaretLeftOutlined)`
    color : #ffffb5;
    font-size : 17px;
`

const StyledCaretRightOutlinedForPage = styled(CaretRightOutlined)`
    color : #ffffb5;
    font-size : 17px;
`

const StyledCaretUpOutlinedForPage = styled(CaretUpOutlined)`
    color : #ffffb5;
    font-size : 17px;
`

const StyledCaretDownOutlinedForPage = styled(CaretDownOutlined)`
    color : #ffffb5;
    font-size : 17px;
`

const fetcher = (url) => Axios.get(url, { withCredentials : true }).then(res => res.data);

const PageNation = ({resSmall}) => {
    const {data, error} = useSWR('http://localhost:3055/posts/pagenation', fetcher);
    const dispatch = useDispatch();
    const { PostsData, loadPostsLoading, loadPostsDone } = useSelector(state => state.post);
    const router = useRouter();
    const [number, setNumber] = useState(0);
    if(router.pathname.slice(1)) {
        return false
    }        

    useEffect(() => {
        dispatch({
            type : LOAD_POSTS_REQUEST,
        })
    },[])
    

    const onClickNextPage = useCallback(() => {
        if(number < data?.length) {
        setNumber(prev => {
                if(prev + 5 > data?.length){
                    return prev
                } 
                data && !loadPostsLoading && dispatch({
                     type : LOAD_POSTS_REQUEST,
                     lastId : data[prev + 5]?.id
                 })
                return prev + 5
            })
        } 
    },[PostsData, number, data])

   
    const onClickPreviousPage = useCallback(() => {
        number > 0 && setNumber(prev => {
            data && !loadPostsLoading && data[number] && dispatch({
                type : LOAD_POSTS_REQUEST,
                lastId : data[prev - 5]?.id
            })       
            return prev - 5
        })
    },[PostsData, number, data])


    if(resSmall) {
        return (
            <StyledDivForPageSamll>
            <StyledCaretLeftOutlinedForPage onClick={onClickPreviousPage}/>
            {data?.map((v, i) => PostsData[PostsData.length - 1].id === v.id && Math.ceil((i) / 5))} ==
            {data?.map((v,i) =>  Math.floor(i / 5) === Math.floor((i+1) / 5) ? false : Math.floor(i / 5) + 1 ).filter(v => v !== false)}
            <StyledCaretRightOutlinedForPage onClick={onClickNextPage}/>
        </StyledDivForPageSamll>
        )
    }

    return (
        <StyledDivForPage>
            <StyledCaretUpOutlinedForPage onClick={onClickPreviousPage}/>
            <br/>
            {data?.map((v,i) =>  Math.floor(i / 10) === Math.floor((i+1) / 10) ? false : Math.floor(i / 10) + 1 ).filter(v => v !== false)}
            <br/>
            <StyledCaretDownOutlinedForPage onClick={onClickNextPage}/>
        </StyledDivForPage>
    )
}

export default PageNation
