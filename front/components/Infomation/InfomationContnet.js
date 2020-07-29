import React, { useMemo, useCallback } from "react";
import useSWR from "swr";
import axios from "axios";
import styled from "styled-components";
import { Input, Avatar, Card, Col } from "antd";
import { useSelector, useDispatch } from "react-redux";
import Form from "antd/lib/form/Form";
import { EditOutlined } from "@ant-design/icons";
import { COVER_POST } from "../../reducer/post";
import InfomationUserPost from "./InfomationUserPost";


const StyledAvartar = styled(Avatar)`
    filter : drop-shadow(5px 5px 20px #1d1e1f6e);
    display : flex;
    justify-content : center;
    align-items : center;
    img {
      &:hover {
        width : 130%;
        transition : width 0.4s;
      }
      transition : width 0.4s;
    }
`

const StyleDiv = styled.div`
            display : flex;
            justify-content : center;
            align-items : flex-start;
            width : 100%;
            overflow : hidden;
            padding-bottom : 5vh;
            
`

const StyledDivForImage = styled.div`
  margin-top : 10px;
  display : flex;
  justify-content : center;
  width : 100%;
`


const fetcher = (url) => {
    return axios.get(url, {withCredentials : true}).then(res => res.data);
}

const InfomationContnet = () => {
    const { CoverUserId, CoverUpLoading } = useSelector(state => state.post)
    const { data, error } = useSWR(`http://localhost:3055/user/${CoverUserId}`, fetcher) 
    const dispatch = useDispatch();  


    const cardUseMemo = useMemo(() => {
        return {
          marginLeft : '10px',
          marginBottom :  '30px',
          width : '100%',
        }
    },[])

  return (
    <Col xs={24} md={24}> 
    <StyleDiv>
      <StyledDivForImage>
          {data?.Images &&
            <StyledAvartar
            size={250}
              src={`http://localhost:3055/${
                data?.Images && data?.Images[0]?.src
              }`}
            />
          }
      </StyledDivForImage>
      </StyleDiv>
      <Col>
      <Col style={cardUseMemo}>
        <Card.Meta 
          title={
            <div>
                {data?.nickname}
              </div>
          }
          description={data?.email}
        />
          <div style={{ marginTop: "10px" }}>
            {data?.Introduces && data?.Introduces[0]?.content}
          </div>
      </Col>
      <InfomationUserPost User={data}/>
    </Col>
    </Col> 
  );
};

export default InfomationContnet;
