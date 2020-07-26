import React, { useCallback, useState, useEffect } from "react";
import styled from "styled-components";
import {
  CaretLeftOutlined,
  CaretRightOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { LOAD_POSTS_REQUEST, HASHTAG_SEARCH_REQUEST } from "../../reducer/post";
import useSWR from "swr";
import Axios from "axios";
import { Typography } from "antd";

const StyledDivForPage = styled.div`
  text-align: center;
  position: fixed;
  right: 10vw;
  top: 50vh;
  font-size: 15px;
`;

const StyledDivForPageSamll = styled.div`
  text-align: center;
  position: fixed;
  left: 1vw;
  bottom: 7vh;
  font-size: 15px;
`;

const StyledCaretLeftOutlinedForPage = styled(CaretLeftOutlined)`
  color: #ffffb5;
  font-size: 17px;
`;

const StyledCaretRightOutlinedForPage = styled(CaretRightOutlined)`
  color: #ffffb5;
  font-size: 17px;
`;

const StyledCaretUpOutlinedForPage = styled(CaretUpOutlined)`
  color: #ffffb5;
  font-size: 17px;
`;

const StyledCaretDownOutlinedForPage = styled(CaretDownOutlined)`
  color: #ffffb5;
  font-size: 17px;
`;

const fetcher = (url) =>
  Axios.get(url, { withCredentials: true }).then((res) => res.data);

const PageNation = ({ resSmall }) => {
  const { data, error } = useSWR(
    "http://localhost:3055/posts/pagenation",
    fetcher
  );

  const dispatch = useDispatch();
  const {
    PostsData,
    loadPostsLoading,
    loadPostsDone,
    tagName,
    hashtagSearchLoading,
  } = useSelector((state) => state.post);

  const router = useRouter();

  const [tagData, setTagData] = useState([]);
  const [number, setNumber] = useState(0);
  const [tag, setTag] = useState("");

  if (router.pathname.slice(1)) {
    return false;
  }

  useEffect(() => {
    dispatch({
      type: LOAD_POSTS_REQUEST,
    });
  }, []);

  useEffect(() => {
    number === undefined &&
      setNumber(
        tagName
          ? parseInt(tagData?.map(
            (v, i) =>
              PostsData[PostsData.length - 1]?.id === v?.id &&
              Math.ceil(i / 5)
          ).filter(v => v !== false), 10)
          : parseInt(data?.map(
            (v, i) =>
              PostsData[PostsData.length - 1]?.id === v?.id &&
              Math.ceil(i / 5)
          ).filter(v => v !== false), 10)
      );
      console.log(number)
  }, [number, PostsData, data, tagData]);

  useEffect(() => {
    if (tagName !== tag) {
      setTagData((prev) => {
        const tags = data
          ?.map((post) =>
            (post?.Hashtags?.map((tags) =>
              tags?.name === tagName ? true : false
            ).filter((v) => v !== false)).length > 0
              ? post
              : false
          )
          ?.filter((v) => v !== false);
        if (prev !== tags) {
          setNumber(0);
          setTag(tagName);
          return tags;
        }
      });
    }
  }, [data, tagData, tagName, tag]);

  const onClickNextPage = useCallback(() => {
    if (5 * (number + 1) - 1  < data?.length) {
      setNumber((prev) => {
        if (5 * (prev + 1) - 1 > data?.length) {
          return prev;
        }
        if (tagData?.length !== 0 && 5 * (prev + 1) - 1 > tagData?.length) {
          return prev;
        }
        if (tagName && tagData && !hashtagSearchLoading) {
          dispatch({
            type: HASHTAG_SEARCH_REQUEST,
            data: { name: encodeURIComponent(tagName) },
            lastId: tagData[5 * (prev + 1) - 1]?.id,
          });
          return prev + 1;
        } else {
          if (data && !loadPostsLoading) {
            dispatch({
              type: LOAD_POSTS_REQUEST,
              lastId: data[5 * (prev + 1) - 1]?.id,
            });

            return prev + 1;
          }
        }
      });
    }
  }, [PostsData, number, data, tagName, tagData]);

  const onClickPreviousPage = useCallback(() => {
    if (tagName) {
      number > 0 &&
        setNumber((prev) => {
          if (tagData && tagData[number] && !hashtagSearchLoading) {
            dispatch({
              type: HASHTAG_SEARCH_REQUEST,
              data: { name: encodeURIComponent(tagName) },
              lastId:
                5 * (prev - 1) - 1 > 0 && tagData[5 * (prev - 1) - 1 > 0]?.id,
            });
            return prev - 1;
          }
        });
    } else {
      number > 0 &&
        setNumber((prev) => {
          if (data && !loadPostsLoading && data[number]) {
            dispatch({
              type: LOAD_POSTS_REQUEST,
              lastId: 5 * (prev - 1) - 1 > 0 && data[5 * (prev - 1) - 1]?.id,
            });
            return prev - 1;
          }
        });
    }
  }, [PostsData, number, data, tagName, tagData]);

  if (resSmall) {
    return (
      <StyledDivForPageSamll draggable="false">
        <StyledCaretLeftOutlinedForPage onClick={onClickPreviousPage} />
        <Typography.Text draggable="false" strong>
          {number + 1}
        </Typography.Text>
        <StyledCaretRightOutlinedForPage onClick={onClickNextPage} />
      </StyledDivForPageSamll>
    );
  }

  return (
    <StyledDivForPage draggable="false">
      <StyledCaretUpOutlinedForPage onClick={onClickPreviousPage} />
      <br />
      <Typography.Text draggable="false" strong>
        {number + 1}
      </Typography.Text>
      <br />
      <StyledCaretDownOutlinedForPage onClick={onClickNextPage} />
    </StyledDivForPage>
  );
};

export default PageNation;
