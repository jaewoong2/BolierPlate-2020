import React, { useEffect } from 'react'
import Editor from '../components/Edit/Editor'
import MyLayout from '../components/MyLayout'
import { useSelector } from 'react-redux'
import Router, { useRouter } from 'next/router'
import useSWR  from 'swr';
import axios from 'axios';

const fetcher = (url) => axios.get(url, { withCredentials: true })
    .then((result) => result.data);

const write = () => {
    const { wrtieLoading, wrtieDone } = useSelector(state => state.post);
    const router = useRouter();
    const { data, error } = useSWR(`http://localhost:3055/post/${router.query.PostId}`, fetcher);

    useEffect(() => {
        !wrtieLoading && wrtieDone && Router.replace('/')
    },[wrtieDone, wrtieLoading])

    return (
        <MyLayout>
            {router.query.PostId ? <Editor data={data}/> :<Editor /> }
            {/* 수정으로 들어왔으면 쿼리 PostId가 있다 */}
        </MyLayout>
    )
}

export default write
