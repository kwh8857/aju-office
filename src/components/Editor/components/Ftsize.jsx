import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
const arr = [13, 15, 17, 19, 21, 23, 25];
function Ftsize() {
  const nowFt = useSelector((state) => state.test.editor.size);
  const [isOpen, setIsOpen] = useState(false);
  const __changeFt = useCallback((index) => {
    document.execCommand('fontSize', false, index);
    setIsOpen(false);
  }, []);
  const __changeOpen = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);
  return (
    <div className="ftsize">
      <button className="now-ft" onClick={__changeOpen}>
        {nowFt}pt
        <img src="/assets/editor/down.svg" alt="열기" />
      </button>
      {isOpen ? (
        <div className="ft-list">
          {arr.map((item, idx) => {
            return (
              <button
                key={idx}
                className="ft-card"
                style={
                  item === nowFt
                    ? { fontWeight: 'bold', color: '#3597ec' }
                    : undefined
                }
                onClick={() => {
                  __changeFt(idx + 1);
                }}
              >
                {item}pt
                {nowFt === item ? <div className="sky-circle" /> : undefined}
              </button>
            );
          })}
        </div>
      ) : undefined}
    </div>
  );
}

export default Ftsize;
