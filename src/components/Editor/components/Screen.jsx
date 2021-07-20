import React, { useCallback, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Droppable,
  DragDropContext,
  Draggable,
  resetServerContext,
} from "react-beautiful-dnd";
import TemplateImage from "./Template/TemplateImage";
import TemplateEmty from "./Template/TemplateEmty";
import TemplateTitle from "./Template/TemplateTitle";
// import TemplateLink from "./Template/TemplateLink";
import TemplateVideo from "./Template/TemplateVideo";
// import TemplateYoutube from "./Template/TemplateYoutube";
import Summary from "./Template/Summary";
resetServerContext();

function Screen() {
  const dispatch = useDispatch();
  const template = useSelector((state) => state.database.editor);
  const [foucsIdx, setFoucsIdx] = useState(0);
  const handleOnDragEnd = useCallback(
    (result) => {
      setFoucsIdx(-1);
      if (!result.destination) return;
      const currentTags = [...template];
      const beforeDragItemIndex = result.source.index;
      const afterDragItemIndex = result.destination.index;
      const removeTag = currentTags.splice(beforeDragItemIndex, 1);

      currentTags.splice(afterDragItemIndex, 0, removeTag[0]);

      dispatch({
        type: "@layouts/CHANGE_EDITOR",
        payload: currentTags,
      });
    },
    [template, dispatch]
  );
  const __deleteTemplate = useCallback(
    (idx) => {
      if (template.length > 1) {
        setFoucsIdx(-1);
        const arr = template.slice();
        arr.splice(idx, 1);
        dispatch({
          type: "@layouts/CHANGE_EDITOR",
          payload: arr,
        });
      }
    },
    [template, dispatch]
  );
  useEffect(() => {
    function deleteTem(event) {
      if (event.key === "Backspace" && foucsIdx !== 0) {
        const arr = template.slice();
        let nowTemplate = arr[foucsIdx];
        if (nowTemplate.type !== "TITLE" && nowTemplate.type !== "SUMMARY") {
          setFoucsIdx(-1);

          if (
            nowTemplate.type === "IMAGE" ||
            nowTemplate.type === "VIDEO" ||
            nowTemplate.type === "FILE"
          ) {
            dispatch({
              type: "@layouts/INIT_DELETELIST",
              payload:
                nowTemplate.type === "IMAGE" || nowTemplate.type === "VIDEO"
                  ? nowTemplate.content
                  : nowTemplate.content.url,
            });
          }

          arr.splice(foucsIdx, 1);
          dispatch({
            type: "@layouts/CHANGE_EDITOR",
            payload: arr,
          });
        } else if (foucsIdx !== 0 && nowTemplate.content.length === 0) {
          setFoucsIdx(-1);
          arr.splice(foucsIdx, 1);
          dispatch({
            type: "@layouts/CHANGE_EDITOR",
            payload: arr,
          });
        }
      }
    }
    document.addEventListener("keydown", deleteTem);
    return () => {
      document.removeEventListener("keydown", deleteTem);
    };
  }, [foucsIdx, template, dispatch]);
  useEffect(() => {
    dispatch({
      type: "@layouts/RESET",
    });
    return () => {};
  }, []);
  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="tags" direction="vertical">
        {(provided) => (
          <div
            className="editor-screen"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {template.length > 0 ? (
              template.map(({ type, content, id }, idx) => {
                return (
                  <Draggable key={id} draggableId={id} index={idx}>
                    {(provided) => {
                      if (type === "IMAGE") {
                        return (
                          <TemplateImage
                            data={content}
                            key={idx}
                            idx={idx}
                            provided={provided}
                            setFocus={setFoucsIdx}
                            template={template}
                            focusIdx={foucsIdx}
                          />
                        );
                      } else if (type === "TITLE") {
                        return (
                          <TemplateTitle
                            key={idx}
                            data={content}
                            provided={provided}
                            idx={idx}
                            setFocus={setFoucsIdx}
                            focusIdx={foucsIdx}
                            __delete={__deleteTemplate}
                          />
                        );
                      }
                      //  else if (type === 'LINK' || type === 'FILE') {
                      //   return (
                      //     <TemplateLink
                      //       key={idx}
                      //       data={content}
                      //       provided={provided}
                      //       idx={idx}
                      //       type={type}
                      //       template={template}
                      //     />
                      //   );
                      // }
                      else if (type === "VIDEO") {
                        return (
                          <TemplateVideo
                            key={idx}
                            data={content}
                            setFocus={setFoucsIdx}
                            provided={provided}
                            idx={idx}
                            template={template}
                          />
                        );
                      } else if (type === "SUMMARY") {
                        return (
                          <Summary
                            key={idx}
                            data={content}
                            setFocus={setFoucsIdx}
                            provided={provided}
                            idx={idx}
                            template={template}
                            focusIdx={foucsIdx}
                            id={id}
                          />
                        );
                      }
                      // else if (type === 'YOUTUBE') {
                      //   return (
                      //     <TemplateYoutube
                      //       key={idx}
                      //       data={content}
                      //       setFocus={setFoucsIdx}
                      //       provided={provided}
                      //       idx={idx}
                      //       template={template}
                      //     />
                      //   );
                      // }
                    }}
                  </Draggable>
                );
              })
            ) : (
              <TemplateEmty />
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default Screen;
