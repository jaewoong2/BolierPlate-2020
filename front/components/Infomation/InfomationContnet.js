import React, { useMemo } from "react";
import useSWR from "swr";
import axios from "axios";
import styled from "styled-components";
import { Input, Avatar, Card } from "antd";
import { useSelector } from "react-redux";
import Form from "antd/lib/form/Form";
import { EditOutlined } from "@ant-design/icons";


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
    const { CoverUserId } = useSelector(state => state.post)
    const { data, error } = useSWR(`http://localhost:3055/user/${CoverUserId}`, fetcher) 
    
    const cardUseMemo = useMemo(() => {
        return {
            border : 0,
            borderTop : '2px dashed #54a1e96e', 
            height : '80%',
            marginTop : '35px',
            width  : '60vw',
            marginLeft : '0',
        }
    },[])

  return (
    <div>
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
      <div>
      <Card style={cardUseMemo}>
        <Card.Meta
          title={
            <div name="dbl">
                {data?.nickname}
              </div>
          }
          description={data?.email}
        />
          <div style={{ marginTop: "10px" }}>
            {data?.Introduces && data?.Introduces[0]?.content}
            <EditOutlined
              style={{ color: "#30ace96e" }}
            />
          </div>
      </Card>
    </div>
    </div>
  );
};

export default InfomationContnet;
