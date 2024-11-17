import { Fragment } from "react/jsx-runtime";
import React, { useState } from "react";
import "../common/common.css";

function Carousel() {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [startIndex, setStartIndex] = useState(0);

  const images = [
    "https://cf.bstatic.com/xdata/images/hotel/max1024x768/605712691.jpg?k=bc971490f6a561adab9898893f176636b24f1db1ef75d578bd5b24f95ba09619&o=",
    "https://cf.bstatic.com/xdata/images/hotel/max500/605712577.jpg?k=64e13431e9729a670e3612a442939ccc0f34a1185eb041b1fbfaeba95b51cf59&o=",
    "https://cf.bstatic.com/xdata/images/hotel/max500/605712668.jpg?k=31096d24536324d4328d93b895615bd5bde56d17bfebbf95f9b1413721c03852&o=",
    "https://cf.bstatic.com/xdata/images/hotel/max300/605712610.jpg?k=44b2486558ae07dc59e3fbd451065f4f63e14e7694e0bae0589930e4df2cdd19&o=",
    "https://cf.bstatic.com/xdata/images/hotel/max300/601095432.jpg?k=cb41d7b234512f86df5ae8a5a57480b9107c123b4f1db3f802c6083713884323&o=",
    "https://cf.bstatic.com/xdata/images/hotel/max300/605712628.jpg?k=61a7a34bd9ee984b1344697f7339140eb48e5c8e4a2dbb61f838f7e7e9215f70&o=",
  ];

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
