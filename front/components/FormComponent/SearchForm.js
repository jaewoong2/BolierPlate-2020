import React from 'react'
import InputCustom from './InputCustom'
import UseInput from '../../Hooks/UseInput'
import styled from 'styled-components'

const StyleDivForWrapper = styled.div`
    display : flex;
    width : 100%;
    justify-content : center;
    align-items : center;
    background-color : #ffffff00;
    position : fixed;
    bottom : 5vh;

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
    const [search, setSearch, onChangeSearch] = UseInput(undefined);
    const [select, setSelect, onChangeSelect] = UseInput('제목');

    return (
        <StyleDivForWrapper>
        <InputCustom
            icon={<StyledSelect  value={select} onChange={onChangeSelect}>
                <option value="제목">제목</option>
                <option value="내용">내용</option>
                </StyledSelect>}
            name="search"
            value={search}
            onChange={onChangeSearch}
            placeholder={`${select}검색...`}
            suffix={<div className="btn">검색</div>}
        />
        </StyleDivForWrapper>
    )
}

export default SearchForm
