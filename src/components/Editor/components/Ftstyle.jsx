import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

const color = [
  '#ff5c5c',
  '#ffb100',
  '#ffeb00',
  '#00db6e',
  '#16cbc4',
  '#3597ec',
  '#7435ec',
  '#ff65be',
  '#000000',
  '#adadad',
  '#ffffff',
];
function Ftstyle() {
  const [isOpen, setIsOpen] = useState(false);
  const nowState = useSelector((state) => state.test.editor);
  const __bold = useCallback(() => {
    const val = document.execCommand('bold');
    console.log(val);
  }, []);
  const __line = useCallback(() => {
    document.execCommand('underline');
  }, []);
  const __color = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);
  const __changeColor = useCallback((color) => {
    console.log(window.getSelection());
    document.execCommand('foreColor', false, color);
    setIsOpen(false);
  }, []);

  const dummy = [
    { img: 'bold', type: 'BOLD', callback: __bold },
    { img: 'line', type: 'LINE', callback: __line },
    { img: 'color', type: 'COLOR', callback: __color },
  ];
  return (
    <div className="ftstyle-wrapper">
      {dummy.map(({ img, type, callback }, idx) => {
        return (
          <React.Fragment key={idx}>
            <button
              className="style-btn"
              onClick={callback}
              style={{
                backgroundColor:
                  (type === 'BOLD' && nowState.bold) ||
                  (type === 'LINE' && nowState.underline)
                    ? '#3597ec'
                    : undefined,
              }}
            >
              <img src={`/assets/editor/${img}.svg`} alt="이미지" />
              {type === 'COLOR' ? (
                <div
                  style={{
                    backgroundColor: nowState.color ? nowState.color : 'black',
                  }}
                  className="color-box"
                />
              ) : undefined}
            </button>
            {type === 'COLOR' ? (
              <div
                className="color-wrapper"
                style={{ opacity: isOpen ? 1 : 0 }}
              >
                {isOpen
                  ? color.map((item, idx) => {
                      return (
                        <button
                          onClick={() => {
                            __changeColor(item);
                          }}
                          className="color-box"
                          key={idx}
                          style={{
                            backgroundColor: item,
                            border:
                              item === '#ffffff' ? 'solid 1px #dbdbdb' : 0,
                          }}
                        />
                      );
                    })
                  : undefined}
              </div>
            ) : undefined}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default Ftstyle;
