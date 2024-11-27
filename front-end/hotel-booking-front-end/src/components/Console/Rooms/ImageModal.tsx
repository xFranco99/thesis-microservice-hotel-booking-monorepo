import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useLocation } from "react-router-dom";

interface Props {
  photo?: PhotoBaseOut;
  _isNew: boolean;
  onClose: (close: boolean) => void;
}

function ImageModal({ photo, _isNew, onClose }: Props) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const roomId = searchParams.get("room_id");

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [newImageUrl, setNewImageUrl] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(_isNew);

  const handleOpenModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
    setNewImageUrl(null);
    onClose(true);
  };

  const handleSave = async () => {
    const apiBaseUrl = import.meta.env.VITE_HOTEL_SERVICE_BASE_URL;
    if (!newImageUrl) {
      alert("Please insert a new url or close");
      return;
    }
    const url = `${apiBaseUrl}/api/v1/photos/edit-photos/${photo?.photo_id}?new_photo_url=${newImageUrl}`;

    try {
      await axios.patch(url);
    } catch (error) {
      alert("Seems there are an issue, please retry later");
    } finally {
      handleCloseModal();
    }
  };

  const handleCreate = async () => {
    const apiBaseUrl = import.meta.env.VITE_HOTEL_SERVICE_BASE_URL;
    if (!newImageUrl) {
      alert("Please insert a new url or close");
      return;
    }
    const url = `${apiBaseUrl}/api/v1/photos/associate-photos`;

    const body = {
      room_id: roomId,
      photos: [newImageUrl]
    }

    try {
      await axios.post(url, body);
    } catch (error) {
      alert("Seems there are an issue, please retry later");
    } finally {
      handleCloseModal();
    }
  };

  const handleDelete = async () => {
    const apiBaseUrl = import.meta.env.VITE_HOTEL_SERVICE_BASE_URL;

    if (!photo?.photo_id) {
      alert("invalid photo id");
      return;
    }

    const url = `${apiBaseUrl}/api/v1/photos/delete-single-photo/${photo?.photo_id}`;

    try {
      await axios.delete(url);
    } catch (error) {
      alert("Seems there are an issue, please retry later");
    } finally {
      handleCloseModal();
    }
  };

  const image = (
    <img
      key={photo?.photo_id}
      src={photo?.photo_url || import.meta.env.VITE_IMAGE_NOT_FOUND}
      alt={`Room photo ${photo?.photo_id}`}
      className="img-thumbnail"
      style={{ cursor: "pointer", maxWidth: "150px", maxHeight: "100px" }}
      onClick={() =>
        handleOpenModal(
          photo?.photo_url || import.meta.env.VITE_IMAGE_NOT_FOUND
        )
      }
    />
  );

  const addImage = (
    <img
      key="Add photo - 1"
      src="https://cdn-icons-png.flaticon.com/512/4601/4601618.png"
      alt="Add photo - 1"
      style={{ cursor: "pointer", maxWidth: "150px", maxHeight: "100px" }}
      onClick={() => {
        setIsNew(true);
        handleOpenModal(
          photo?.photo_url || import.meta.env.VITE_IMAGE_NOT_FOUND
        );
      }}
    />
  );

  return (
    <div>
      <div className="d-flex gap-2">{isNew ? addImage : image}</div>

      {selectedImage && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="imageModalLabel"
          aria-hidden="true"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="imageModalLabel">
                  Image Details
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body text-center">
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="img-fluid"
                  style={{ maxWidth: "100%" }}
                />
                <div className="mt-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="New image URL"
                    value={newImageUrl || ""}
                    onChange={(e) => {
                      setNewImageUrl(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="modal-footer justify-content-between">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={isNew ? handleCreate : handleSave}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageModal;
