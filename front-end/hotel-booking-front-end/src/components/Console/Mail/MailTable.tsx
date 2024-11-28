import axios from "axios";
import { useEffect, useState } from "react";
import TemplateAddEdit from "./TemplateAddEdit";

function MailTable() {
  const [mails, setMails] = useState<TemplateComplete[]>([]);
  const [searchMail, setSearchMail] = useState("");
  const [trigger, setTrigger] = useState(false);

  async function fetchMails() {
    const apiBaseUrl = import.meta.env.VITE_MAIL_BASE_URL;
    const url = apiBaseUrl + "/api/v1/mail/get-all-mail-template";

    try {
      const response = await axios.get(url);

      console.log(response.data);

      if (response.data) {
        setMails(response.data);
      }
    } catch (e) {
      alert("Seems there are an issue, please retry later");
    }
  }

  async function deleteMails(template_id: number) {
    const apiBaseUrl = import.meta.env.VITE_MAIL_BASE_URL;

    if (!template_id) {
      alert("Seems there are an issue with template_id, please retry later");
      return;
    }

    const url = `${apiBaseUrl}/api/v1/mail/delete-mail-template/${template_id}`;

    try {
      await axios.delete(url);
      setTrigger(!trigger);
    } catch (e) {
      alert("Seems there are an issue, please retry later");
    }
  }

  useEffect(() => {
    fetchMails();
  }, [trigger]);

  const filterServices = () => {
    return mails.filter((mail) =>
      mail.template_name?.toLowerCase().includes(searchMail.toLowerCase())
    );
  };

  return (
    <div
      style={{
        maxHeight: "70vh",
        overflow: "auto",
        border: "1px solid black",
        borderRadius: "7px",
        boxShadow: "5px 10px",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "10px",
          padding: "10px",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <input
          type="text"
          placeholder="Service Name"
          value={searchMail}
          onChange={(e) => setSearchMail(e.target.value)}
          style={{
            padding: "5px",
            borderRadius: "4px",
            border: "1.5px solid black",
          }}
        />
        <button
          className="btn btn-outline-dark rounded-pill"
          onClick={() => setSearchMail("")}
        >
          Clean
        </button>
      </div>
      <table
        className="table table-group-divider"
        style={{
          width: "100%",
          height: "100%",
          margin: 0,
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th scope="col">template_id</th>
            <th scope="col">template_name</th>
            <th scope="col">template_description</th>
            <th scope="col">template</th>
            <th scope="col">insert_date</th>
            <th scope="col">update_date</th>
            <th scope="col">
              <TemplateAddEdit
                _isNew={true}
                onClose={() => {
                  setTrigger(!trigger);
                }}
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {filterServices().map((template: TemplateComplete) => (
            <tr key={template.id}>
              <th scope="row">{template?.id}</th>
              <td>{template?.template_name}</td>
              <td>{template?.description}</td>
              <td>{template?.template}</td>
              <td>{template?.insert_date}</td>
              <td>{template?.update_date}</td>
              <td>
                <div className="d-flex justify-content-center gap-2">
                  <TemplateAddEdit
                    _isNew={false}
                    _templateObj={template}
                    onClose={() => {
                      setTrigger(!trigger);
                    }}
                  />
                  <button
                    className="btn btn-outline-danger rounded-pill"
                    onClick={() => deleteMails(template.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MailTable;
