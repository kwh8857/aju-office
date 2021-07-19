import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

function TemplateTitle({ data, idx, provided, setFocus, focusIdx, __delete }) {
  const contentRef = useRef(null);
  const dispatch = useDispatch();
  const status = useSelector((state) => state.test.editor);

  useEffect(() => {
    if (data && focusIdx !== idx) {
      contentRef.current.innerHTML = data;
    }
    return () => {};
  }, [data, idx, focusIdx]);

  return (
    <div
      id={`popo-${idx}`}
      className="template-title"
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <div className="dnd-icon">
        <img
          src="/assets/projects/dnd-icon.svg"
          alt="원하는 위치로 이동해보세요!"
        />
      </div>
      <div className="con-wrapper">
        <p
          id="text-line"
          contentEditable={true}
          ref={contentRef}
          suppressContentEditableWarning={true}
          onFocus={() => {
            setFocus(idx);
          }}
          onInput={(e) => {
            dispatch({
              type: '@layouts/CHANGE_TITLE',
              payload: contentRef.current.innerHTML,
              idx,
            });
          }}
          onSelect={(e) => {
            const select = window.getSelection();
            const style = window.getComputedStyle(select.focusNode.parentNode);
            const fontSize = parseInt(style.fontSize);
            const align = style.textAlign;
            const bold = document.queryCommandState('bold');
            const underline = document.queryCommandState('underline');
            const color = document.queryCommandValue('ForeColor');
            if (
              select.focusNode.localName === undefined &&
              fontSize !== status.size
            ) {
              dispatch({
                type: '@test/CHANGE_SIZE',
                payload: fontSize,
              });
            }
            if (underline !== status.underline) {
              dispatch({
                type: '@test/CHANGE_UNDER',
                payload: underline,
              });
            }
            if (bold !== status.bold) {
              dispatch({
                type: '@test/CHANGE_BOLD',
                payload: bold,
              });
            }
            if (align !== status.align && align !== 'start') {
              dispatch({
                type: '@test/CHANGE_ALIGN',
                payload: align,
              });
            }
            if (color !== status.color) {
              dispatch({
                type: '@test/CHANGE_COLOR',
                payload: color,
              });
            }
          }}
        ></p>
      </div>
    </div>
  );
}

export default TemplateTitle;
