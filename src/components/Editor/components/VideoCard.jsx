import React, { useEffect, useCallback, useState } from "react";
import firebaseApp from "../../../config/firebaseApp";
const Fstorage = firebaseApp.storage();
function VideoCard({
  data,
  __delete,
  idx,
  __update,
  __select,
  selectList,
  __upload,
}) {
  const [video, setVideo] = useState(undefined);
  const [upload, setupload] = useState(undefined);
  const [uploadstate, setUploadstate] = useState(undefined);
  const [thumbnail, setthumbnail] = useState(undefined);
  const [percent, setpercent] = useState(0);
  const __deleteVideo = useCallback(() => {
    if (video) {
      Fstorage.refFromURL(thumbnail)
        .delete()
        .then(() => {
          Fstorage.refFromURL(video)
            .delete()
            .then(() => {
              __delete(idx);
            });
        });
    } else {
      if (uploadstate) {
        uploadstate.task.cancel();
        setupload(undefined);
        __delete(idx);
      } else {
        __delete(idx);
      }
    }
  }, [video, __delete, idx, uploadstate, thumbnail]);
  const __uploadVideo = useCallback(
    (thumbnail) => {
      const update = Fstorage.ref(`editor/video/${data.name}/video`).put(data);
      __upload(idx, update, data.name, thumbnail);
    },
    [data, __upload, idx]
  );
  const __withdrawThumbnail = useCallback(() => {
    return new Promise((resolve, reject) => {
      var url = URL.createObjectURL(data);
      var video = document.createElement("video");
      var canvas = document.createElement("canvas");

      video.addEventListener("loadeddata", function () {
        video.pause();
        snapImage();
      });
      function snapImage() {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas
          .getContext("2d")
          .drawImage(video, 0, 0, canvas.width, canvas.height);
        var image = canvas.toDataURL();
        const base = image.split(",")[1];
        Fstorage.ref(`editor/video/${data.name}/thumbnail`)
          .putString(base, "base64")
          .then((result) => {
            result.ref.getDownloadURL().then((getDownloadURL) => {
              resolve(getDownloadURL);
            });
          });
      }
      video.preload = "metadata";
      video.src = url;
      // Load video in Safari / IE11
      video.muted = true;
      video.playsInline = true;
      video.play();
    });
  }, [data]);
  useEffect(() => {
    if (percent === 100 && video === undefined && upload) {
      upload.then((snapshot) => {
        snapshot.ref.getDownloadURL().then((result) => {
          __update(idx, result, data.name, thumbnail);
        });
      });
    }
    return () => {};
  }, [percent, upload, idx, data.name, thumbnail, __update, video]);
  useEffect(() => {
    console.log("데이터 감지");
    if (upload) {
      upload.on("state_changed", (snapshot) => {
        setUploadstate(snapshot);
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setpercent(progress);
      });
    }
    return () => {};
  }, [upload]);
  useEffect(() => {
    //데이터가 file인경우 type이 존재

    if (data.type) {
      console.log("업로드");
      //썸네일 추출후에 비디오 업로드 시작
      __withdrawThumbnail().then((result) => {
        __uploadVideo(result);
      });
    } else if (data.url) {
      setVideo(data.url);
      setthumbnail(data.thumbnail);
      setpercent(100);
    }
    return () => {
      setVideo(undefined);
      setthumbnail(undefined);
    };
  }, [__uploadVideo, data, __withdrawThumbnail]);
  useEffect(() => {
    if (data.upload) {
      setupload(data.upload);
      setthumbnail(data.thumbnail);
    }
    return () => {};
  }, [data]);
  return (
    <div className="video-card">
      <div className="thumbnail-wrapper">
        {thumbnail ? (
          <img src={thumbnail} alt="썸네일" className="video-url" />
        ) : undefined}
      </div>
      <div className="card-progress">
        <div className="video-title">{data.name}</div>
        <div className="percent">{parseInt(percent)}%</div>
        <div className="progress-wrapper">
          <div
            className="progress-bar"
            style={{ transform: `translateX(${-100 + percent}%)` }}
          />
        </div>
      </div>
      <div
        className="check_circle"
        style={{
          backgroundColor:
            selectList.indexOf(video) > -1 ? "#3597ec" : undefined,
        }}
        onClick={() => {
          if (video) {
            __select(video);
          }
        }}
      ></div>
      <img
        src="/assets/editor/video-cancel.svg"
        alt=""
        className="video-cancel"
        onClick={__deleteVideo}
      />
    </div>
  );
}

export default VideoCard;
