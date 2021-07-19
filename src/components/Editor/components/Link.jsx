import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

function Link({ __close, template }) {
  const dispatch = useDispatch();
  const [Title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [isNext, setisNext] = useState(false);
  const __initLink = useCallback(() => {
    let arr = template.slice();
    arr.push({
      type: 'LINK',
      content: {
        title: Title,
        url: link,
      },
      id: `link-${
        new Date().getTime() - Math.floor(Math.random() * (100 - 1 + 1)) + 1
      }`,
    });
    dispatch({
      type: '@layouts/CHANGE_EDITOR',
      payload: arr,
    });
    __close();
  }, [Title, link, __close, template, dispatch]);

  useEffect(() => {
    let regex = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!]))?/;
    if (Title && regex.test(link)) {
      setisNext(true);
    } else {
      setisNext(false);
    }
    return () => {};
  }, [Title, link]);
  return (
    <div className="popup-wrapper">
      <img
        src="/assets/editor/cancel.svg"
        alt=""
        className="cancel"
        onClick={__close}
      />
      <div className="popup-title">링크 등록</div>
      <div className="content-wrapper">
        <div className="content-title">링크 제목</div>
        <input
          type="text"
          className="content-input"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <div className="content-title second">링크 주소</div>
        <input
          type="text"
          className="content-input"
          onChange={(e) => {
            setLink(e.target.value);
          }}
        />
      </div>
      <div
        className="link-btn"
        style={{
          backgroundColor: isNext ? undefined : 'grey',
        }}
        onClick={() => {
          if (isNext) {
            __initLink();
          }
        }}
      >
        등록하기
      </div>
    </div>
  );
}

export default Link;
