import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { css } from "styled-components";

const Wrapper = styled.div`
  width: 1032px;
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
    margin-bottom: 8px;
  }
  .grid-wrapper {
    margin-top: 30px;
    display: grid;
    grid-template-columns: 544px 231px 231px;
    column-gap: 13px;
    & > .right-wrapper {
      position: relative;
      & > .btn-wrapper {
        z-index: 2000;
        position: absolute;
        height: fit-content;
        display: grid;
        font-family: "";
        overflow: hidden;
        transition: height 0.3s ease-in-out;
        cursor: pointer;
        background-color: white;
        width: 100%;
        border-radius: 5px;
        border: solid 1px #dbdbdb !important;
        font-size: 17px;

        & > .now {
          font-size: 17px;
          cursor: pointer;
          width: 100%;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 17px;
          box-sizing: border-box;
          & > img {
            width: 13.2px;
          }
        }
        & > .select {
          cursor: pointer;
          padding: 0 17px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          font-size: 17px;
          height: 45px;
          border-top: solid 1px #dbdbdb !important ;
        }
      }
    }
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
  ${(props) => {
    return css`
      .grid-wrapper {
        & > .right-wrapper {
          & > .kind {
            height: ${props.isKind ? "142px" : "50px"};

            & > .now {
              color: ${props.kind ? "black" : "#bfbfbf"};
            }
          }
          & > .year {
            height: ${props.isYear
              ? `${props.yearlength * 45 + 50}px`
              : "50px"};
            & > .now {
              color: ${props.year ? "black" : "#bfbfbf"};
            }
          }
        }
      }
    `;
  }}
`;

function TitleSection({
  category,
  dispatch,
  info: { title, sub, year, kind },
}) {
  const history = useHistory();
  const [isKind, setIsKind] = useState(false);
  const [isYear, setIsYear] = useState(false);
  const [yearArray, setYearArray] = useState([]);
  useEffect(() => {
    const now = new Date().getFullYear();
    let yeararr = [];
    let thisyear = 2018;
    while (thisyear <= now) {
      yeararr.push(thisyear === 2018 ? `~${thisyear}` : thisyear);
      thisyear++;
    }
    setYearArray(yeararr);
    return () => {};
  }, []);

  return (
    <Wrapper
      isKind={isKind}
      kind={kind}
      isYear={isYear}
      year={year}
      yearlength={yearArray.length}
    >
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
                : title && sub && kind && year
                ? "#a50006"
                : "#7c7c7c",
          }}
          onClick={() => {
            if (category !== "notice" && title && sub && kind && year) {
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

      <div className="grid-wrapper">
        <div className="title-wrapper">
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
        </div>
        <div className="right-wrapper">
          <div className="ti">유형</div>
          <div
            className="btn-wrapper kind"
            onClick={() => {
              setIsKind(!isKind);
            }}
          >
            <button className="now">
              {kind ? kind : "유형 선택"}
              <img src="/assets/editor/grey-down.svg" alt="" />
            </button>
            {kindarr.map((item, idx) => {
              return (
                <button
                  className="select"
                  key={idx}
                  onClick={() => {
                    dispatch({
                      type: "KIND",
                      kind: item,
                    });
                    setIsKind(false);
                  }}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>
        <div className="right-wrapper">
          <div className="ti">공사연도</div>
          <div
            className="btn-wrapper year"
            onClick={() => {
              setIsYear(!isYear);
            }}
          >
            <button className="now">
              {year ? year : "연도 선택"}{" "}
              <img src="/assets/editor/grey-down.svg" alt="" />
            </button>
            {yearArray.map((item, idx) => {
              return (
                <button
                  key={idx}
                  className="select"
                  onClick={() => {
                    dispatch({
                      type: "YEAR",
                      year: item,
                    });
                    setIsYear(false);
                  }}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      </div>

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

const kindarr = ["시공 현장", "3D 작업"];
