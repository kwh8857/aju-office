import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Wrapper = styled.div`
  width: 100%;
  position: fixed;
  top: 0;
  height: 64px;
  border-bottom: solid 1px #dbdbdb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 75px;
  padding-right: 115px;
  box-sizing: border-box;
  background-color: white;
  z-index: 1000;
  .right {
    display: grid;
    grid-template-columns: repeat(2, 77px);
    column-gap: 56px;
    a {
      font-size: 14px;
      font-weight: bold;
      white-space: nowrap;
    }
  }
  img {
    width: 102px;
    cursor: pointer;
  }
`;
function Header() {
  return (
    <Wrapper>
      <Link to="/main">
        <img src="/assets/logo.svg" alt="Aju" />
      </Link>
      <div className="right">
        <Link to="/main">공사실적관리</Link>
        <Link to="/notice">공지사항관리</Link>
      </div>
    </Wrapper>
  );
}

export default Header;
