import React, { useCallback, useState, useEffect } from 'react'
import InputCustom from './InputCustom'
import UseInput from '../../Hooks/UseInput'
import styled from 'styled-components'
import useSWR from 'swr'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux'
import { SEARCH_POSTS_REQUEST } from '../../reducer/post'
import ResultView from './ResultView'
const StyleDivForWrapper = styled.div`
    display : flex;
    width : 100%;
    justify-content : center;
    align-items : center;
    background-color : #ffffff00;
    position : fixed;
    bottom : 5vh;

    .wrapper {
        margin-top : 0;
    }

    .btn {
        background-color : #066ef7d7;
        padding : 5px;
        padding-left : 9px;
        padding-right : 9px;
        color : white;
        font-size : 14px;
        border : 0;
        border-radius : 3px 3px 3px 3px;
        outline : 0;
        &:hover {
            background-color : #3986ebd7;
            cursor : pointer;
            transition : background-color 0.4s;
        }
    }

    .resultWrapper{
        width : 78%; 
        margin-left : 55px; 
        background-color : white;
        border-radius : 0 8px 0 0;
        border-left : 7px solid #3986ebd7;
        box-shadow : 4px 3px 7px #777, -3px -3px 7px #777;
    }
`

const StyledSelect = styled.select`
    background-color : inherit;
    border : 0;

    &:focus {
        border : 0;
        outline : 0;
    }    
    
    option {
        background-color : inherit;
    }
`

const SearchForm = () => {    
    const { searchName } = useSelector(state => state.post);
    const dispatch = useDispatch();
    const [search, setSearch, onChangeSearch] = UseInput(undefined);
    const [select, setSelect, onChangeSelect] = UseInput('제목');

    useEffect(() => {
        select &&
        search && dispatch({
            type : SEARCH_POSTS_REQUEST,
            data : {
                serchName : encodeURIComponent(select),
                search : encodeURIComponent(search)
            }
        })
        !search && dispatch({
            type : SEARCH_POSTS_REQUEST,
            data : { searchName : null, search : null }
        })
    },[search, select])

    useEffect(() => {
        searchName === "" && setSearch(undefined)
    },[searchName])

    



    return (
        <>
        <StyleDivForWrapper>
        <div>
        <div className="resultWrapper">
        <ResultView/>
        </div>
        <InputCustom
            icon={<StyledSelect  value={select} onChange={onChangeSelect}>
                <option value="제목">제목</option>
                <option value="내용">내용</option>
                </StyledSelect>}
            value={search}
            onChange={onChangeSearch}
            placeholder={`${select}검색...`}
            suffix={<div  className="btn">검색</div>}
            />
        </div>
        </StyleDivForWrapper>
        </>
    )
}

export default SearchForm
