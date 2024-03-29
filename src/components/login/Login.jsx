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
            alert("등록된 관리자가 아닙니다 접근에 주의하세요");
          }
        })
        .catch((err) => {
          if (err.code === "auth/user-not-found") {
            alert("존재하지않는 유저이거나 잘못된 이메일입니다");
          } else if (err.code === "auth/wrong-password") {
            alert("비밀번호가 맞지않습니다");
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
            <div className="title">아주종합건설 관리자페이지입니다</div>
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="아이디를 입력해주세요"
                ref={IdRef}
              />
              <input
                type="password"
                placeholder="비밀번호를 입력해주세요"
                ref={PasswordRef}
              />
            </div>
            <div className="btn" onClick={__login}>
              관리자 로그인하기
            </div>
          </div>
        </div>
      </Body>
    </Wrapper>
  );
}

export default Login;
