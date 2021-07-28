import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 1024px;
  margin-bottom: 27.5px;
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title {
      font-size: 30px;
      font-weight: bold;
    }
    .btn {
      width: 148px;
      height: 50px;
      cursor: pointer;
      border-radius: 5px;
      color: white;
      font-size: 19px;
      font-weight: bold;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .ti {
    font-size: 19px;
    font-weight: bold;
    margin-top: 30px;
    margin-bottom: 9px;
  }
  input {
    width: 100%;
    height: 50px;
    border: solid 1px #dbdbdb;
    border-radius: 5px;
    font-size: 17px;
    box-sizing: border-box;
    padding: 12px 17px;
  }
  textarea {
    width: 100%;
    height: 80px;
    border: solid 1px #dbdbdb;
    border-radius: 5px;
    font-size: 17px;
    box-sizing: border-box;
    padding: 12px 17px;
  }
`;

function TitleSection({ category, dispatch, info: { title, sub } }) {
  const history = useHistory();
  return (
    <Wrapper>
      <div className="top">
        <div className="title">
          {category === "portfolio" ? "공사실적" : "공지사항"}추가
        </div>
        <div
          className="btn"
          style={{
            backgroundColor:
              category === "notice"
                ? title
                  ? "#a50006"
                  : "#7c7c7c"
                : title && sub
                ? "#a50006"
                : "#7c7c7c",
          }}
          onClick={() => {
            if (category !== "notice" && title && sub) {
              history.goBack();
            }
            if (category === "notice" && title) {
              history.goBack();
            }
          }}
        >
          등록
        </div>
      </div>

      <div className="ti">게시글 제목</div>
      <input
        value={title ? title : ""}
        type="text"
        maxLength={60}
        placeholder="게시글 제목을 입력해주세요"
        onChange={(e) => {
          if (e.target.value) {
            dispatch({
              type: "TITLE",
              title: e.target.value,
            });
          } else {
            dispatch({
              type: "TITLE",
              title: undefined,
            });
          }
        }}
      />

      {category !== "notice" ? (
        <>
          <div className="ti">개요</div>
          <textarea
            type="text"
            maxLength={120}
            value={sub ? sub : ""}
            placeholder="개요는 최대 2줄까지 입력해주세요"
            onChange={(e) => {
              const line = e.target.value.split(/\n/g);
              line.splice(2);
              let test = line.join();
              let result = test.replace(/,/g, "\n");
              if (result) {
                dispatch({
                  type: "SUB",
                  sub: result,
                });
              } else {
                dispatch({
                  type: "SUB",
                  sub: undefined,
                });
              }
            }}
          />
        </>
      ) : undefined}
    </Wrapper>
  );
}

export default TitleSection;
