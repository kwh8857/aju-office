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
import TemplateContent from "./Template/TemplateContent";
resetServerContext();

function Screen({ temKey, Fstore, Fstorage }) {
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
      if (event.key === "Backspace" && template.length > 1 && foucsIdx > -1) {
        const arr = template.slice();
        let nowTemplate = arr[foucsIdx];
        if (nowTemplate.type !== "TITLE") {
          setFoucsIdx(-1);

          if (nowTemplate.type === "IMAGE") {
            const { resize, url } = nowTemplate.content;
            Fstorage.refFromURL(resize).delete();
            Fstorage.refFromURL(url).delete();
          }
          if (nowTemplate.type === "SUMMARY") {
            nowTemplate.content.images.forEach(({ resize, img }) => {
              Fstorage.refFromURL(resize).delete();
              Fstorage.refFromURL(img).delete();
            });
          }
          arr.splice(foucsIdx, 1);
          Fstore.collection("editor").doc(temKey).update({ template: arr });
          dispatch({
            type: "@layouts/CHANGE_EDITOR",
            payload: arr,
          });
        } else {
          arr.splice(foucsIdx, 1);
          if (
            nowTemplate.type === "TITLE" &&
            foucsIdx !== 0 &&
            nowTemplate.content.length === 0
          ) {
            dispatch({
              type: "@layouts/CHANGE_EDITOR",
              payload: arr,
            });
          }
          setFoucsIdx(-1);
        }
      }
    }
    document.addEventListener("keydown", deleteTem);
    return () => {
      document.removeEventListener("keydown", deleteTem);
    };
  }, [foucsIdx, template, dispatch, temKey, Fstore, Fstorage]);
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
                            focusIdx={foucsIdx}
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
                            temKey={temKey}
                          />
                        );
                      } else if (type === "CONTENT") {
                        return (
                          <TemplateContent
                            key={idx}
                            data={content}
                            setFocus={setFoucsIdx}
                            provided={provided}
                            idx={idx}
                            template={template}
                          />
                        );
                      }
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

export default React.memo(Screen);
