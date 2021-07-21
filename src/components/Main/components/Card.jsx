import React, { useState } from "react";
import { formatDate } from "../../lib/factory";

function Card({ index, title, timestamp }) {
  const [isDelete, setIsDelete] = useState(false);
  return (
    <div className="card">
      <div className="left">
        <div className="title">{title}</div>
        <div className="time">{formatDate(timestamp, ".")}</div>
      </div>
      <div className="right">
        <div className="fix">수정하기</div>
        <div
          className="remove"
          onClick={() => {
            setIsDelete(true);
          }}
        >
          삭제하기
        </div>
      </div>
      <div className="delete-wrapper" style={{ right: isDelete ? 0 : -500 }}>
        <img
          src="/assets/editor/white-cancel.svg"
          alt="취소"
          className="white-cancel"
          onClick={() => {
            setIsDelete(false);
          }}
        />
        <div className="delete-title">해당 프로젝트를 삭제하시겠습니까?</div>
        <div className="delete-btn">삭제</div>
      </div>
    </div>
  );
}

export default Card;
