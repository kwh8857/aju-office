import React, { useCallback } from "react";
import Header from "../Header/Header";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import Card from "../Main/components/Card";

const dummy = [
  {
    title: "화성그랜드파크",
    sub: "",
    timestamp: Date.now(),
  },
  {
    title: "화성그랜드파크",
    sub: "",
    timestamp: Date.now(),
  },
  {
    title: "화성그랜드파크",
    sub: "",
    timestamp: Date.now(),
  },
  {
    title: "화성그랜드파크",
    sub: "",
    timestamp: Date.now(),
  },
];
const List = styled.div`
  width: 100%;
  height: 100%;
  margin-top: 33px;
  display: grid;
  grid-template-columns: 100%;
  row-gap: 17px;
  .card {
    overflow: hidden;
    position: relative;
    height: 73px;
    width: 100%;
    border: solid 1px #dbdbdb;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 14px 24px;
    .left {
      .title {
        font-size: 16px;
        font-weight: bold;
      }
      .time {
        font-size: 13px;
        font-weight: 500;
        color: #898989;
        margin-top: 2px;
      }
    }
    .right {
      display: grid;
      grid-template-columns: repeat(2, 88px);
      column-gap: 14px;
      & > div {
        width: 100%;
        height: 37px;
        font-size: 15px;
        font-weight: bold;
        color: white;
        border-radius: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }
      .fix {
        background-color: #434343;
      }
      .remove {
        background-color: #a50006;
      }
    }
    .delete-wrapper {
      transition: right 0.2s ease-in-out;
      border-radius: 10px;
      padding-left: 15px;
      box-sizing: border-box;
      align-items: center;
      position: absolute;
      right: 0;
      display: flex;
      width: 348.4px;
      height: 73px;
      background-color: #a50006;
      .white-cancel {
        cursor: pointer;
        margin-right: 11.5px;
        width: 12px;
      }
      .delete-title {
        font-size: 13px;
        font-weight: 500;
        color: white;
      }
      .delete-btn {
        cursor: pointer;
        margin-left: 32px;
        color: #a50006;
        border-radius: 14px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 13px;
        font-weight: bold;
        width: 72px;
        height: 27px;
        background-color: white;
      }
    }
  }
`;
const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  .title {
    font-size: 30px;
    font-weight: bold;
  }
  .right {
    transform: translateY(10px);
    display: flex;

    .input-wrapper {
      width: 215px;
      height: 44px;
      border: solid 1px #dbdbdb;
      border-radius: 5px;
      display: flex;
      overflow: hidden;
      padding-left: 13px;
      padding-right: 16px;
      box-sizing: border-box;
      img {
        width: 21px;
        cursor: pointer;
      }
      input {
        margin-right: 10px;
        width: 100%;
        height: 100%;
        font-size: 16px;
        font-weight: 500;
      }
      input::placeholder {
        font-size: 16px;
        font-weight: 500;
        color: #a8a8a8;
      }
    }
    .btn {
      width: 153px;
      height: 44px;
      background-color: #e0e0e0;
      border-radius: 6px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 15px;
      font-size: 16px;
      font-weight: bold;
      color: #434343;
      cursor: pointer;
    }
  }
`;
const Body = styled.div`
  width: 992px;
  height: 100%;
  margin: 0 auto;
  padding-top: 117px;
  box-sizing: border-box;
`;
function Notice() {
  const history = useHistory();
  const __navMake = useCallback(() => {
    history.push("/editor");
  }, [history]);
  return (
    <div>
      <Header />
      <Body>
        <Top>
          <div className="title">공지사항 관리</div>
          <div className="right">
            <div className="input-wrapper">
              <input type="text" placeholder="프로젝트명 검색" />
              <img src="/assets/grey-search.svg" alt="검색" />
            </div>
            <div className="btn" onClick={__navMake}>
              공지사항 추가
            </div>
          </div>
        </Top>
        <List>
          {dummy.map(({ title, timestamp }, idx) => {
            return (
              <Card key={idx} title={title} timestamp={timestamp} index={idx} />
            );
          })}
        </List>
      </Body>
    </div>
  );
}

export default Notice;
