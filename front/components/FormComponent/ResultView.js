import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components';
import { Typography } from 'antd';
import Link from 'next/link';

const StyledDiv = styled.div`
    position : sticky;
    display : flex;
    align-items : flex-end;

    .container  {
        width : 100%;
        padding-right : 10px;
    }

    .title {
        font-size : 15px;
        padding-left : 4px;
        padding-bottom : 5px;
        display : flex;
        justify-content : space-between;

        &:hover {
           background-color : #807d7d9c;
           transition : background-color 0.2s;
           cursor : pointer;
        }
        transition : background-color 0.2s;

        .tag {
            font-size : 12px;
            word-break: keep-all;
        }

        span {
            font-style : italic;
        }
    }


    

`

const ResultView = () => {
    const { search, searchName } = useSelector(state => state.post);

    return (
        <StyledDiv>
            <div className="container">
            {search?.map((post, index) => (
                <Link href={`/page/${post.id}`}>
                <div className="title">
                    <b><span>{index + 1}. </span>{post?.title}</b>
                    <div className="tag">
                {post?.Hashtags?.map(tag => <Typography.Text keyboard>{tag.name}</Typography.Text>)}
                    </div>
                </div>
                </Link>
                ))}
            </div>
        </StyledDiv>
    )
}

export default ResultView
