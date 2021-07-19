import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import firebaseApp from "../../../config/firebaseApp";

const dummy = [
  { img: "summary", type: "SUMMARY" },
  { img: "temp", type: "IMAGE" },
  { img: "video", type: "VIDEO" },
  // { img: "youtube", type: "YOUTUBE" },
  // { img: "link", type: "LINK" },
  // { img: "file", type: "FILE" },
];

const Fstorage = firebaseApp.storage();

function Insert({ setIsUp }) {
  const dispatch = useDispatch();
  const template = useSelector((state) => state.database.editor);

  const __imageUpload = useCallback((data64, name) => {
    return new Promise((resolve, reject) => {
      const data = data64.split(",")[1];
      Fstorage.ref(`editor/${name}`)
        .putString(data, "base64")
        .then((result) => {
          result.ref.getDownloadURL().then((downloadUrl) => {
            resolve(downloadUrl);
          });
        });
    });
  }, []);
  const __fileReader = useCallback((file) => {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.onload = function (e) {
        const imageUrl = e.target.result;
        resolve({ url: imageUrl, name: file.name });
      };
      reader.readAsDataURL(file);
    });
  }, []);
  const __imageUpdate = useCallback(
    (e) => {
      let fileList = Object.values(e.target.files);
      const base64 = Promise.all(
        fileList.map((item) => {
          const da = __fileReader(item).then((result) => {
            return result;
          });
          return da;
        })
      );
      base64.then((result) => {
        Promise.all(
          result.map(({ url, name }) => {
            const po = __imageUpload(url, name).then((result) => {
              return {
                type: "IMAGE",
                content: result,
                id: `image-${
                  new Date().getTime() -
                  Math.floor(Math.random() * (100 - 1 + 1)) +
                  1
                }`,
              };
            });
            return po;
          })
        ).then((result) => {
          const arr = template.slice();
          dispatch({
            type: "@layouts/CHANGE_EDITOR",
            payload: [...arr, ...result],
          });
        });
      });
    },
    [__imageUpload, __fileReader, template, dispatch]
  );
  return (
    <div className="insert-wrapper">
      {dummy.map(({ img, type }, idx) => {
        return (
          <label
            className="test-img"
            key={idx}
            onClick={() => {
              if (type !== "IMAGE" && type !== "SUMMARY") {
                setIsUp({
                  status: true,
                  type: type,
                });
              } else if (type === "SUMMARY") {
                let arr = template.slice();
                arr.push({
                  type: "SUMMARY",
                  content: {
                    text: "",
                    images: [],
                  },
                  id: `summary-${
                    new Date().getTime() -
                    Math.floor(Math.random() * (100 - 1 + 1)) +
                    1
                  }`,
                });
                dispatch({
                  type: "@layouts/CHANGE_EDITOR",
                  payload: arr,
                });
              }
            }}
          >
            {type === "IMAGE" ? (
              <input
                type="file"
                style={{ opacity: 0 }}
                multiple={true}
                accept="image/x-png,image/gif,image/jpeg"
                onChange={__imageUpdate}
              />
            ) : undefined}
            <img src={`/assets/editor/${img}.svg`} alt={`${img}`} />
          </label>
        );
      })}
    </div>
  );
}

export default Insert;