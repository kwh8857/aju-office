import React, { useCallback, useRef } from "react";
import styled from "styled-components";
import firebaseApp from "../config/firebaseApp";
import { useDispatch } from "react-redux";

const Wrapper = styled.div`
  background-color: #f7f7f7;
  width: 100%;
  height: 100%;
`;
const Header = styled.div`
  width: 100%;
  border-bottom: solid 1px #dbdbdb;
  height: 64px;
  display: flex;
  align-items: center;
  padding-left: 75px;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  img {
    width: 101.9px;
  }
`;
const Body = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .box {
    border-radius: 20px;
    width: 454px;
    height: 421px;
    background-color: white;
    overflow: hidden;
    .top {
      background-color: #4a4949;
      height: 104px;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 145.5px;
      }
    }
    .bottom {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 32px;
      box-sizing: border-box;
      .title {
        font-size: 20px;
        font-weight: bold;
      }
      .input-wrapper {
        display: grid;
        grid-template-columns: 321px;
        row-gap: 13px;
        margin-top: 27px;
        margin-bottom: 23px;
        input {
          width: 100%;
          height: 44px;
          border: solid 1px #dbdbdb;
          border-radius: 6px;
          padding-left: 13px;
          font-size: 15px;
          box-sizing: border-box;
        }
        input:-webkit-autofill::first-line {
          font-size: 15px;
        }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          transition: background-color 5000s ease-in-out 0s;
        }
        input::placeholder {
          font-size: 15px;
          color: #a8a8a8;
          font-weight: 500;
        }
      }
      .btn {
        width: 321px;
        height: 52px;
        border-radius: 6px;
        background-color: #a50006;
        display: flex;
        color: white;
        align-items: center;
        font-size: 15px;
        font-weight: bold;
        cursor: pointer;
        justify-content: center;
      }
    }
  }
`;
const Fauth = firebaseApp.auth();
function Login() {
  const dispatch = useDispatch();
  const IdRef = useRef(null);
  const PasswordRef = useRef(null);
  const __login = useCallback(() => {
    Fauth.setPersistence(firebaseApp.auth.Auth.Persistence.SESSION).then(() => {
      return Fauth.signInWithEmailAndPassword(
        `${IdRef.current.value}@ajoo.com`,
        PasswordRef.current.value
      )
        .then((result) => {
          const {
            user: { uid },
          } = result;
          if (uid === "wQHhbrR0eVgM0lx0wkNiGcv2dvL2") {
            dispatch({
              type: "@config/isLogin",
              payload: true,
            });
          } else {
            alert("????????? ???????????? ???????????? ????????? ???????????????");
          }
        })
        .catch((err) => {
          if (err.code === "auth/user-not-found") {
            alert("?????????????????? ??????????????? ????????? ??????????????????");
          } else if (err.code === "auth/wrong-password") {
            alert("??????????????? ??????????????????");
          }
        });
    });
  }, [IdRef, PasswordRef, dispatch]);
  return (
    <Wrapper>
      <Header>
        <img src="/assets/logo.svg" alt="Aju" />
      </Header>
      <Body>
        <div className="box">
          <div className="top">
            <img src="/assets/logo-white.svg" alt="Aju" />
          </div>
          <div className="bottom">
            <div className="title">?????????????????? ???????????????????????????</div>
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="???????????? ??????????????????"
                ref={IdRef}
              />
              <input
                type="password"
                placeholder="??????????????? ??????????????????"
                ref={PasswordRef}
              />
            </div>
            <div className="btn" onClick={__login}>
              ????????? ???????????????
            </div>
          </div>
        </div>
      </Body>
    </Wrapper>
  );
}

export default Login;
