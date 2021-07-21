import React, { useState, useCallback } from "react";
import VideoCard from "./VideoCard";
import { useDispatch, useSelector } from "react-redux";

function Video({ __close, template, temKey }) {
  const dispatch = useDispatch();
  const List = useSelector((state) => state.database.videolist);

  const [selectList, setSelectList] = useState([]);
  const __deleteList = useCallback(
    (idx) => {
      const arr = List.slice();
      arr.splice(idx, 1);
      dispatch({
        type: "@layouts/INIT_VIDEO",
        payload: arr,
      });
    },
    [List, dispatch]
  );
  const __updateTemplate = useCallback(() => {
    let arr = template.slice();
    selectList.forEach((item) => {
      arr.push({
        type: "VIDEO",
        content: item,
        id: `video-${
          new Date().getTime() - Math.floor(Math.random() * (100 - 1 + 1)) + 1
        }`,
      });
    });
    dispatch({
      type: "@layouts/CHANGE_EDITOR",
      payload: arr,
    });
    __close();
  }, [selectList, template, __close, dispatch]);
  const __selectVideo = useCallback(
    (content) => {
      const arr = selectList.slice();
      const number = arr.indexOf(content);
      if (number < 0) {
        arr.push(content);
      } else {
        arr.splice(number, 1);
      }
      setSelectList(arr);
    },
    [selectList]
  );
  const __updateUpload = useCallback(
    (idx, upload, name, thumbnail) => {
      dispatch({
        type: "@layouts/UPDATE_VIDEO",
        idx,
        payload: {
          upload,
          name,
          thumbnail,
        },
      });
    },
    [dispatch]
  );
  const __updateList = useCallback(
    (idx, url, name, thumbnail) => {
      dispatch({
        type: "@layouts/UPDATE_VIDEO",
        payload: {
          url,
          name,
          thumbnail,
        },
        idx,
      });
    },
    [dispatch]
  );
  const __uploadVideo = useCallback(
    (e) => {
      const arr = List.slice();
      let fileList = Object.values(e.target.files);
      fileList.forEach((item) => {
        arr.push(item);
      });
      dispatch({
        type: "@layouts/INIT_VIDEO",
        payload: arr,
      });
    },
    [List, dispatch]
  );
  return (
    <div className="popup-wrapper video">
      <img
        src="/assets/editor/cancel.svg"
        alt=""
        className="cancel"
        onClick={__close}
      />
      <div className="popup-title">동영상 업로드</div>
      <label className="list-wrapper">
        <img
          src="/assets/editor/video-file.svg"
          alt="비디오 업로드"
          className="video-icon"
        />
        <div className="video-file-title">파일을 선택 또는 드래그해주세요</div>
        <input
          type="file"
          style={{ opacity: 0 }}
          multiple={true}
          accept="video/*"
          onChange={__uploadVideo}
        />
      </label>
      <div className="video-card-wrapper">
        {List.map((item, idx) => {
          return (
            <VideoCard
              key={idx}
              data={item}
              __upload={__updateUpload}
              __delete={__deleteList}
              __update={__updateList}
              __select={__selectVideo}
              selectList={selectList}
              idx={idx}
              temKey={temKey}
            />
          );
        })}
      </div>
      <div
        className="link-btn"
        style={selectList.length > 0 ? undefined : { backgroundColor: "grey" }}
        onClick={() => {
          if (selectList.length > 0) {
            __updateTemplate();
          }
        }}
      >
        등록하기
      </div>
    </div>
  );
}

export default Video;
