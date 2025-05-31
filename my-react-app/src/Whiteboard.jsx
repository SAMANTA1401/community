import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import io from 'socket.io-client';

const socket = io('http://localhost:8000'); // Your backend URL

const Whiteboard = () => {
  const [lines, setLines] = useState([]);
  const isDrawing = useRef(false);

  useEffect(() => {
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
  }, []);

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    const newLine = { points: [pos.x, pos.y] };
    setLines([...lines, newLine]);
    socket.emit('draw', newLine);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);
    const newLines = lines.slice(0, -1).concat(lastLine);
    setLines(newLines);
    socket.emit('draw', lastLine);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleClear = () => {
    setLines([]);
    socket.emit('clear');
  };

  return (
    <div>
      <button onClick={handleClear}>Clear Board</button>
      <div style={{ border: '1px solid #ccc', marginTop: 10 }}>
        <Stage
          width={800}
          height={400}
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
    </div>
  );
};

export default Whiteboard;
