import React, { useRef, useCallback, useEffect, useState } from "react";
import TemplateEmty from "./TemplateEmty";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Resizer from "react-image-file-resizer";
import firebaseApp from "../../../config/firebaseApp";
const Fstorage = firebaseApp.storage();
const Wrapper = styled.div`
  width: 100%;
  position: relative;
  z-index: 10;
  & > .top {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 10px;
    .main {
      border: solid 1px #dbdbdb;
      width: 503px;
      height: 312px;
      background-color: #f7f7f7;
      display: flex;
      align-items: center;
      justify-content: center;
      label {
        position: relative;
        display: flex;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        & > .list-img {
          width: 50px;
        }
        & > input {
          display: none;
        }
        .true-image {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
        }
      }
      .sub {
        margin-top: 11px;
        font-size: 14px;
        font-weight: normal;
        color: #bfbfbf;
        text-align: center;
        line-height: 1.57;
      }
    }
    p {
      font-family: "Noto Sans KR", sans-serif !important;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: text;
      height: auto;
      white-space: pre-wrap;
      word-wrap: break-word;
      font-size: 17px;
    }
    textarea::placeholder {
      color: #bfbfbf;
      font-size: 17px;
    }
  }
`;
const ControlBox = styled.div`
  position: absolute;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`;

function Summary({
  data: { text, img },
  provided,
  template,
  idx,
  setFocus,
  id,
  focusIdx,
  temKey,
}) {
  const status = useSelector((state) => state.test.editor);
  const dispatch = useDispatch();
  const contentRef = useRef(null);
  const __imageUpload = useCallback(
    (data64, name) => {
      return new Promise((resolve, reject) => {
        const data = data64.split(",")[1];
        Fstorage.ref(`editor/${temKey}/${id}/${name}`)
          .putString(data, "base64")
          .then((result) => {
            result.ref.getDownloadURL().then((downloadUrl) => {
              resolve(downloadUrl);
            });
          });
      });
    },
    [id, temKey]
  );
  const __fileReader = useCallback((file) => {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.onload = function (e) {
        const imageUrl = e.target.result;
        Resizer.imageFileResizer(
          file,
          5,
          5,
          "PNG",
          100,
          0,
          (uri) => {
            resolve({ url: imageUrl, resize: uri });
          },
          "base64"
        );
      };
      reader.readAsDataURL(file);
    });
  }, []);
  const __updateImage = useCallback(
    (type, file) => {
      __fileReader(file).then((res) => {
        Promise.all([
          __imageUpload(res.resize, `${type}-resize`).then((res) => {
            return res;
          }),
          __imageUpload(res.url, type).then((res) => {
            return res;
          }),
        ]).then((result) => {
          dispatch({
            type: "@layouts/CHANGE_SUMMARY_IMAGE",
            idx,
            payload: {
              img: result[1],
              resize: result[0],
            },
            index: type === "main" ? 0 : type,
          });
        });
      });
    },
    [__fileReader, __imageUpload, dispatch, idx]
  );
  useEffect(() => {
    contentRef.current.innerHTML = text;
    return () => {};
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      {idx === 0 ? <TemplateEmty idx={idx} /> : undefined}
      <div
        className={`template-video ${focusIdx === idx ? "focus" : ""}`}
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        <ControlBox
          onClick={() => {
            setFocus(idx);
          }}
        />
        <div className="dnd-icon">
          <img
            src="/assets/projects/dnd-icon.svg"
            alt="원하는 위치로 이동해보세요!"
          />
        </div>
        <Wrapper>
          <div className="top">
            <div className="main">
              <label>
                {img ? (
                  <img className="true-image" src={img.img} alt="" />
                ) : undefined}
                <img
                  className="list-img"
                  src="/assets/editor/grey-plus.png"
                  alt="추가"
                />
                <input
                  type="file"
                  accept="image/x-png,image/gif,image/jpeg"
                  onChange={(e) => {
                    setFocus(undefined);
                    if (e.target.files) {
                      __updateImage(0, e.target.files[0]);
                    }
                  }}
                />
                <div className="sub">
                  사진을 업로드해주세요 <br /> jpeg, png, gif
                </div>
              </label>
            </div>
            <p
              placeholder="내용을 입력해주세요"
              contentEditable={true}
              ref={contentRef}
              suppressContentEditableWarning={true}
              onKeyDown={(e) => {
                if (contentRef.current.offsetHeight > 492 && e.keyCode !== 8) {
                  const test = contentRef.current.childNodes;
                  test[test.length - 1].remove();
                }
              }}
              onInput={(e) => {
                dispatch({
                  type: "@layouts/CHANGE_SUMMARY",
                  payload: contentRef.current.innerHTML,
                  idx,
                });
              }}
              onSelect={(e) => {
                const select = window.getSelection();
                const style = window.getComputedStyle(
                  select.focusNode.parentNode
                );
                const fontSize = parseInt(style.fontSize);
                const align = style.textAlign;
                const bold = document.queryCommandState("bold");
                const underline = document.queryCommandState("underline");
                const color = document.queryCommandValue("ForeColor");
                if (
                  select.focusNode.localName === undefined &&
                  fontSize !== status.size
                ) {
                  dispatch({
                    type: "@test/CHANGE_SIZE",
                    payload: fontSize,
                  });
                }
                if (underline !== status.underline) {
                  dispatch({
                    type: "@test/CHANGE_UNDER",
                    payload: underline,
                  });
                }
                if (bold !== status.bold) {
                  dispatch({
                    type: "@test/CHANGE_BOLD",
                    payload: bold,
                  });
                }
                if (align !== status.align && align !== "start") {
                  dispatch({
                    type: "@test/CHANGE_ALIGN",
                    payload: align,
                  });
                }
                if (color !== status.color) {
                  dispatch({
                    type: "@test/CHANGE_COLOR",
                    payload: color,
                  });
                }
              }}
            ></p>
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
