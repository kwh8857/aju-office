import React, { useCallback, useEffect, useState } from "react";
import Header from "../Header/Header";
import styled from "styled-components";
import { Animation } from "../styles/Animation";
import firebaseApp from "../config/firebaseApp";
import { formatDate } from "../lib/factory";
import { useDispatch } from "react-redux";
import Loading from "../Editor/components/Loading";
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
    & > .left {
      & > .title {
        font-size: 16px;
        font-weight: bold;
      }
      & > .time {
        margin-top: 3px;
        font-size: 13px;
        font-weight: 500;
        color: #898989;
      }
    }
    & > .right {
      display: flex;
      align-items: center;
      column-gap: 16px;
      & > .name {
        font-size: 13px;
        font-weight: 500;
        color: #898989;
      }
      & > button {
        position: relative;
        padding: 6px 11px;
        background-color: #434343;
        border-radius: 6px;
        font-size: 15px;
        font-weight: bold;
        color: white;
        display: flex;
        align-items: center;
        column-gap: 4px;
        cursor: pointer;
        & > img {
          width: 24px;
        }
        & > label {
          width: 100%;
          height: 100%;
          position: absolute;
          cursor: pointer;
        }
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
`;
const Body = styled.div`
  width: 992px;
  height: 100%;
  margin: 0 auto;
  padding-top: 117px;
  box-sizing: border-box;
`;
const Fstorage = firebaseApp.storage();
const Fstore = firebaseApp.firestore();
function Pdf() {
  const dispatch = useDispatch();
  const [data, setdata] = useState([]);
  const GetPdf = useCallback(() => {
    let arr = [];
    Fstore.collection("pdf")
      .get()
      .then((result) => {
        if (result) {
          result.forEach((item) => {
            const value = item.data();
            console.log(value);
            arr.push(Object.assign(value, { title: item.id }));
          });
          setdata(arr);
        }
      });
  }, []);

  const Upload = useCallback(
    (file, id) => {
      dispatch({
        type: "@config/isLoading",
        payload: true,
      });
      var reader = new FileReader();
      reader.onload = function (e) {
        Fstorage.ref(`pdf/${id}/${file.name}`)
          .put(file)
          .then((result) => {
            result.ref
              .getDownloadURL()
              .then((downloadUrl) => {
                Fstore.collection("pdf")
                  .doc(id)
                  .update({
                    url: downloadUrl,
                    timestamp: Date.now(),
                    filename: file.name,
                  })
                  .then(() => {
                    GetPdf();
                    dispatch({
                      type: "@config/isLoading",
                      payload: false,
                    });
                  });
              })
              .catch((err) => {
                dispatch({
                  type: "@config/isLoading",
                  payload: false,
                });
              });
          })
          .catch((err) => {
            dispatch({
              type: "@config/isLoading",
              payload: false,
            });
          });
      };
      reader.readAsDataURL(file);
    },
    [GetPdf]
  );

  useEffect(() => {
    GetPdf();
    return () => {};
  }, [GetPdf]);

  return (
    <div>
      <Header />
      <Animation>
        <Body>
          <Top>
            <div className="title">공지사항 관리</div>
            <div className="right"></div>
          </Top>
          <List>
            {data.map(({ title, filename, timestamp }, idx) => {
              return (
                <div className="card" key={idx}>
                  <div className="left">
                    <div className="title">{title}</div>
                    <div className="time">
                      수정일 : {formatDate(timestamp, "-")}
                    </div>
                  </div>
                  <div className="right">
                    <div className="name">{filename}</div>
                    <button>
                      파일 업로드
                      <img src="/assets/pdf/download.svg" alt="" />
                      <label>
                        <input
                          type="file"
                          style={{ display: "none" }}
                          multiple={false}
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              Upload(file, title);
                            }
                          }}
                        />
                      </label>
                    </button>
                  </div>
                </div>
              );
            })}
          </List>
        </Body>
      </Animation>
      <Loading />
    </div>
  );
}

export default Pdf;
