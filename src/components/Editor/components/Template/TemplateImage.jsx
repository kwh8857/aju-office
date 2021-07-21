import React from "react";
import TemplateEmty from "./TemplateEmty";

function TemplateImage({
  data: { resize, url },
  provided,
  setFocus,
  focusIdx,
  idx,
  template,
}) {
  return (
    <>
      {idx === 0 ? <TemplateEmty idx={idx} /> : undefined}
      <div
        className={`template-img ${focusIdx === idx ? "active-blue" : ""}`}
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        onClick={() => {
          setFocus(idx);
        }}
      >
        <img src={url} alt="이미지" />
      </div>
      {!template[idx + 1] || template[idx + 1].type !== "TITLE" ? (
        <TemplateEmty idx={idx + 1} />
      ) : undefined}
    </>
  );
}

export default TemplateImage;
