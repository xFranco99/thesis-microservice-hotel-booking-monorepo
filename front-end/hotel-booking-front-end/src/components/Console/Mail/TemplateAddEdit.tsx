import axios from "axios";
import { useState } from "react";

interface Props {
  _templateObj?: TemplateComplete;
  _isNew: boolean;
  onClose: (close: boolean) => void;
}

function TemplateAddEdit({ _templateObj, _isNew = false, onClose }: Props) {
  const apiBaseUrl = import.meta.env.VITE_MAIL_BASE_URL;

  const _template_id = _templateObj?.id || "";
  const _description = _templateObj?.description || "";
  const _template_name = _templateObj?.template_name || "";
  const _template = _templateObj?.template || "";

  const [description, setDescription] = useState(_description);
  const [templateName, setTemplateName] = useState(_template_name);
  const [template, setTemplate] = useState(_template);

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [newService, setNewService] = useState<boolean>(_isNew);

  const handleOpen = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setDescription(_description);
    setTemplateName(_template_name);
    setTemplate(_template);
    setOpenModal(false);
    onClose(true);
  };

  const handleSave = async () => {
    if (!description || !templateName || !template) {
      alert("Please complete all fields before submit");
      return;
    }

    const url = `${apiBaseUrl}/api/v1/mail/save-template`;

    const body: TemplateInput = {
      description: description,
      template_name: templateName,
      template: template,
    };

    try {
      await axios.post(url, body);
    } catch (error) {
      alert("Seems there are an issue, please retry later");
    } finally {
      handleCloseModal();
    }
  };

  const handleUpdate = async () => {
    if (!_template_id) {
      alert("Seems there are an issue with service_id, please retry later");
      handleCloseModal();
      return;
    }

    const url = `${apiBaseUrl}/api/v1/mail/update-mail-template/${_template_id}`;

    const body: TemplatePatchInput = {};

    if (description || description !== "") {
      body.description = description;
    }
    if (templateName || templateName !== "") {
      body.template_name = templateName;
    }
    if (template || template !== "") {
      body.template = template;
    }

    try {
      await axios.patch(url, body);
    } catch (error) {
      alert("Seems there are an issue, please retry later");
    } finally {
      handleCloseModal();
    }
  };

  return (
    <div>
      {_isNew ? (
        <button
          className="btn btn-outline-dark rounded-pill"
          onClick={handleOpen}
        >
          Add
        </button>
      ) : (
        <button
          className="btn btn-outline-primary rounded-pill"
          onClick={handleOpen}
        >
          Edit
        </button>
      )}

      {openModal && (
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
                  Template
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body text-center">
                <div className="mt-3">
                  <h3>Template Name</h3>
                </div>
                <div className="mt-3">
                  <input
                    className="form-control"
                    value={templateName || ""}
                    onChange={(e) => {
                      setTemplateName(e.target.value);
                    }}
                  />
                </div>
                <div className="mt-3">
                  <h3>Template Description</h3>
                </div>
                <div className="mt-3">
                  <input
                    className="form-control"
                    value={description || ""}
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                  />
                </div>
                <div className="mt-3">
                  <h3>Template</h3>
                </div>
                <div className="mt-3">
                  <textarea
                    className="form-control"
                    aria-label="With textarea"
                    value={template || ""}
                    onChange={(e) => {
                      setTemplate(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="modal-footer justify-content-between">
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={_isNew ? handleSave : handleUpdate}
                >
                  {_isNew ? "Save" : "Update"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TemplateAddEdit;
