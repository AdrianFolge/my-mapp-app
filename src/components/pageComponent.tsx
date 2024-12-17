"use client"

import React, { useState, useRef } from "react";

export const PageComponent = () => {
  const centerX = 200; // X-coordinate of the center
  const centerY = 200; // Y-coordinate of the center
  const rectWidth = 150; // Width of the rectangle
  const rectHeight = 100; // Height of the rectangle

  const [rotationAngle, setRotationAngle] = useState(0); // Angle of rotation
  const containerRef = useRef(null);

  const handleMouseDown = (e) => {
    e.preventDefault();

    const rect = containerRef.current.getBoundingClientRect();
    const initialMouseX = e.clientX - rect.left;
    const initialMouseY = e.clientY - rect.top;
    const initialDx = initialMouseX - centerX;
    const initialDy = initialMouseY - centerY;
    let initialAngle = Math.atan2(initialDy, initialDx);

    const onMouseMove = (moveEvent) => {
      const mouseX = moveEvent.clientX - rect.left;
      const mouseY = moveEvent.clientY - rect.top;

      const dx = mouseX - centerX;
      const dy = mouseY - centerY;
      const angle = Math.atan2(dy, dx);
      const angleDegrees = ((angle - initialAngle) * 180) / Math.PI;

      setRotationAngle((prevAngle) => prevAngle + angleDegrees);
      initialAngle = angle; // Update initialAngle to prevent accumulation
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "400px",
        height: "400px",
        border: "1px solid black",
        margin: "20px auto",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: `${rectWidth}px`,
          height: `${rectHeight}px`,
          transform: `rotate(${rotationAngle}deg)`,
          transformOrigin: "center",
          left: `${centerX - rectWidth / 2}px`,
          top: `${centerY - rectHeight / 2}px`,
          border: "1px solid blue",
        }}
      >
        <div
          onMouseDown={handleMouseDown}
          style={{
            position: "absolute",
            width: "50px",
            height: "20px",
            backgroundColor: "lightgray",
            border: "1px solid black",
            textAlign: "center",
            cursor: "grab",
            right: "-25px", // Positioned on top right of rectangle
            top: "-10px",
            transform: `rotate(-${rotationAngle}deg)`, // Keep the text aligned
          }}
        >
          {Math.round(rotationAngle)}°
        </div>
      </div>
    </div>
  );
};

export default PageComponent;
