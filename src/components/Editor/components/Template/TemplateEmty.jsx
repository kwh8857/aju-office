import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function TemplateEmty({ idx }) {
  const dispatch = useDispatch();
  const Template = useSelector((state) => state.database.editor);
  const __titleInit = useCallback(() => {
    const arr = Template.slice();
    if (idx || idx === 0) {
      arr.splice(idx, 0, {
        type: 'TITLE',
        content: '',
        id: `title-${
          new Date().getTime() - Math.floor(Math.random() * (100 - 1 + 1)) + 1
        }`,
      });
    } else {
      arr.push({
        type: 'TITLE',
        content: '',
        id: `title-${
          new Date().getTime() - Math.floor(Math.random() * (100 - 1 + 1)) + 1
        }`,
      });
    }
    dispatch({
      type: '@layouts/CHANGE_EDITOR',
      payload: arr,
    });
  }, [Template, dispatch, idx]);
  return <div className="template-emty" onClick={__titleInit}></div>;
}

export default TemplateEmty;
