import React from 'react';
import TemplateEmty from './TemplateEmty';

function TemplateLink({ data: { title, url }, idx, provided, type, template }) {
  return (
    <>
      {idx === 0 ? <TemplateEmty idx={idx} /> : undefined}
      <a
        className="link-template"
        target="_blank"
        rel="noopener noreferrer"
        href={url}
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        <img
          src={`/assets/editor/${type === 'LINK' ? 'blue-link' : 'down'}.svg`}
          alt="링크"
          className={`${type === 'LINK' ? 'link' : 'file'}-asset`}
        />
        <div className="link-title">{title}</div>
        {type === 'LINK' ? (
          <img
            className="link-play"
            src="/assets/editor/blue-play.svg"
            alt="play"
          />
        ) : undefined}
      </a>
      {!template[idx + 1] || template[idx + 1].type !== 'TITLE' ? (
        <TemplateEmty idx={idx + 1} />
      ) : undefined}
    </>
  );
}

export default TemplateLink;
