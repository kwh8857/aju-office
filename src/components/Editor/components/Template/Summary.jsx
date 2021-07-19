import React from "react";
import TemplateEmty from "./TemplateEmty";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  height: 550px;
  display: flex;
  border-bottom: solid 1px #dbdbdb;
  .main {
    margin-right: 35px;
    width: 503px;
    height: 490px;
    background-color: #f7f7f7;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    .sub {
      margin-top: 11px;
      font-size: 14px;
      font-weight: normal;
      color: #bfbfbf;
      text-align: center;
      line-height: 1.57;
    }
    img {
      width: 73px;
    }
  }
  .content {
    textarea {
      width: 454px;
      height: 322px;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    textarea::placeholder {
      color: #bfbfbf;
      font-size: 17px;
    }
  }
`;
function Summary({ data, provided, template, idx, setFocus }) {
  return (
    <>
      {idx === 0 ? <TemplateEmty idx={idx} /> : undefined}
      <div
        className="template-video"
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        onClick={() => {
          setFocus(idx);
        }}
      >
        <div className="dnd-icon">
          <img
            src="/assets/projects/dnd-icon.svg"
            alt="원하는 위치로 이동해보세요!"
          />
        </div>
        <Wrapper>
          <div className="main">
            <img src="/assets/editor/grey-plus.png" alt="추가" />
            <div className="sub">
              사진을 업로드해주세요 <br /> jpeg, png, gif
            </div>
          </div>
          <div className="content">
            <textarea
              placeholder="내용을 입력해주세요"
              cols="37"
              rows="5"
              wrap="hard"
              maxlength="500"
              onChange={(e) => {
                var str = e.target.value;

                var str_arr = str.split("\n" || 37); // 줄바꿈 기준으로 나눔
                console.log(str_arr);
                var row = str_arr.length; // row = 줄 수
                console.log(row);
              }}
            ></textarea>
            <div className="list"></div>
          </div>
        </Wrapper>
      </div>
      {!template[idx + 1] || template[idx + 1].type !== "TITLE" ? (
        <TemplateEmty idx={idx + 1} />
      ) : undefined}
    </>
  );
}

export default Summary;
