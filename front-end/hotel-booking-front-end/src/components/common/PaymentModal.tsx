import React, { Fragment, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface Prop {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (cardDetails: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  }) => void;
  isSuccess?: boolean;
}

function PaymentModal({ isOpen, onClose, onSubmit, isSuccess = false }: Prop) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ cardNumber, expiryDate, cvv });
  };

  if (!isOpen) return null;

  return (
    <div className="modal fade show" style={{ display: "block" }} tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Credit Card Payment</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {isSuccess ? (
              <Fragment>
                <h1>Well Done!</h1>
                <p>You have correctly boked this hotel :)</p>
                <p>check your emali to get yor reservation</p>
              </Fragment>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="cardName" className="form-label">
                    Cardholder Name
                  </label>
                </div>
                <div className="mb-3">
                  <label htmlFor="cardNumber" className="form-label">
                    Card Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="cardNumber"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    pattern="[0-9]{16}"
                    maxLength={16}
                    required
                  />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="expiryDate" className="form-label">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="expiryDate"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      placeholder="MM/YY"
                      pattern="(0[1-9]|1[0-2])\/[0-9]{2}"
                      maxLength={5}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="cvv" className="form-label">
                      CVV
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="cvv"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="123"
                      pattern="[0-9]{3}"
                      maxLength={3}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Pay Now
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentModal;
