import React, { useCallback } from 'react';
import Link from './Link';
import UploadFile from './UploadFile';
import { useSelector } from 'react-redux';
import Video from './Video';
import Youtube from './Youtube';

function Popup({ isUp: { status, type }, setIsUp }) {
  const template = useSelector((state) => state.database.editor);
  const __close = useCallback(() => {
    setIsUp({
      status: false,
      type: '',
    });
  }, [setIsUp]);
  return status ? (
    <div className="popup-pack">
      <div className="back-black" />
      <div
        className="popup-main"
        style={type === 'VIDEO' ? { width: '663px' } : undefined}
      >
        {type === 'LINK' ? (
          <Link __close={__close} template={template} />
        ) : type === 'FILE' ? (
          <UploadFile __close={__close} template={template} />
        ) : type === 'VIDEO' ? (
          <Video __close={__close} template={template} />
        ) : (
          <Youtube __close={__close} template={template} />
        )}
      </div>
    </div>
  ) : (
    <div />
  );
}

export default Popup;
