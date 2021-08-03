import React from "react";
import Loader from "react-loader-spinner";
import { useSelector } from "react-redux";
import styled from "styled-components";
const Wrapper = styled.div`
  position: fixed;
  z-index: 6000;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  .back-black {
    z-index: -1;
    position: absolute;
    top: 0;
    left: 0;
    background-color: black;
    opacity: 0.4;
    width: 100%;
    height: 100%;
  }
`;
function Loading() {
  const isLoading = useSelector((state) => state.config.isLoading);
  if (isLoading) {
    return (
      <Wrapper>
        <div className="back-black" />
        <Loader type="Oval" color="white" height={100} width={100} />
      </Wrapper>
    );
  } else {
    return <></>;
  }
}

export default Loading;
