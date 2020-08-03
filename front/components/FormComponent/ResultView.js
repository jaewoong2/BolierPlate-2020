import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components';

const StyledDiv = styled.div`
    position : sticky;
    display : flex;
    align-items : flex-end;

`

const ResultView = () => {
    const { search, searchName } = useSelector(state => state.post);

    return (
        <StyledDiv>
            <div>
            {search?.map(post => (
                <div>
                    <b>{post?.title}</b>
                </div>
                ))}
            </div>
        </StyledDiv>
    )
}

export default ResultView
