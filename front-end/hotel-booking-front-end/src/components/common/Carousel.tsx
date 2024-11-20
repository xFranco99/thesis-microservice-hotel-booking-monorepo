import { Fragment } from "react/jsx-runtime";
import React, { useState } from "react";
import "../common/common.css";

interface Props {
  images?: string[];
}

function Carousel({ images = [import.meta.env.VITE_IMAGE_NOT_FOUND] }: Props) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [startIndex, setStartIndex] = useState(0);

  const THUMBNAIL_COUNT = 3; // Number of thumbnails to show at once

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleScrollUp = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  const handleScrollDown = () => {
    if (startIndex + THUMBNAIL_COUNT < images.length) {
      setStartIndex(startIndex + 1);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center mt-4">
      <div
        className="d-flex flex-column position-relative"
        style={{ width: "120px", height: "370px" }}
      >
        {startIndex > 0 && (
          <button
            className="btn position-absolute top-0 start-50 translate-middle-x"
            style={{ zIndex: 2 }}
            onClick={handleScrollUp}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="#FFFFFF"
              stroke="black"
              className="bi bi-caret-up-fill"
              viewBox="0 0 16 16"
            >
              <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
            </svg>
          </button>
        )}

        <div
          className="overflow-hidden border rounded bg-dark"
          style={{ height: "100%" }}
        >
          <div
            className="d-flex flex-column"
            style={{
              transform: `translateY(-${startIndex * 100}px)`,
              transition: "transform 0.3s ease",
            }}
          >
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className={`img-fluid border-bottom ${
                  index === selectedImageIndex ? "border-3 border-primary" : ""
                }`}
                style={{
                  cursor: "pointer",
                  height: "115px",
                  objectFit: "cover",
                }}
                onClick={() => handleThumbnailClick(index)}
              />
            ))}
          </div>
        </div>

        {startIndex + THUMBNAIL_COUNT < images.length && (
          <button
            className="btn position-absolute bottom-0 start-50 translate-middle-x"
            style={{ zIndex: 2 }}
            onClick={handleScrollDown}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="#FFFFFF"
              stroke="black"
              className="bi bi-caret-down-fill"
              viewBox="0 0 16 16"
            >
              <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
            </svg>
          </button>
        )}
      </div>

      <div
        className="ms-4 border rounded bg-dark d-flex align-items-center justify-content-center"
        style={{ width: "700px", height: "370px" }}
      >
        <img
          src={images[selectedImageIndex]}
          alt={`Selected ${selectedImageIndex + 1}`}
          className="img-fluid"
          style={{ maxHeight: "100%", maxWidth: "100%" }}
        />
      </div>
    </div>
  );
}

export default Carousel;
