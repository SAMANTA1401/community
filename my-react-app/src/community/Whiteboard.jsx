import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import io from 'socket.io-client';

// const socket = io('http://localhost:8000');
const GROUP_ID = 'physics';

const Whiteboard = ({ groupId }) => {
  const [lines, setLines] = useState([]);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const isDrawing = useRef(false);
 

  useEffect(() => {
    if (showWhiteboard) {
      socket.emit('join_group', { group_id: groupId });
      console.log("grpid", groupId)

      socket.on('draw', (data) => {
        setLines(prev => [...prev, data]);
      });

      socket.on('clear', () => {
        setLines([]);
      });

      return () => {
        socket.off('draw');
        socket.off('clear');
      };
    }
  }, [showWhiteboard]);

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    const newLine = { points: [pos.x, pos.y] };
    setLines([...lines, newLine]);
    socket.emit('draw', { group_id: groupId, line: newLine });
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const lastLine = lines[lines.length - 1];
    if (!lastLine) return;
    lastLine.points = lastLine.points.concat([point.x, point.y]);
    const newLines = lines.slice(0, -1).concat(lastLine);
    setLines(newLines);
    socket.emit('draw', { group_id: groupId, line: lastLine });
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleClear = () => {
    setLines([]);
    socket.emit('clear', { group_id: groupId });
  };

  return (
    <div>
      {!showWhiteboard ? (
        <button onClick={() => setShowWhiteboard(true)}>Open Whiteboard</button>
      ) : (
        <>
          <button onClick={handleClear}>Clear Board</button>
          <div
            style={{
              border: '1px solid #ccc',
              marginTop: 10,
              width: '650px',
              height: '450px', // Visible area
              overflow: 'auto', // Scroll enabled
            }}
          >
            <Stage
              width={600}
              height={3500} // Big height for long content
              onMouseDown={handleMouseDown}
              onMousemove={handleMouseMove}
              onMouseup={handleMouseUp}
              style={{ background: '#fff' }}
            >
              <Layer>
                {lines.map((line, i) => (
                  <Line
                    key={i}
                    points={line.points}
                    stroke="black"
                    strokeWidth={2}
                    tension={0.5}
                    lineCap="round"
                    globalCompositeOperation="source-over"
                  />
                ))}
              </Layer>
            </Stage>
          </div>
        </>
      )}
    </div>
  );
};

export default Whiteboard;
