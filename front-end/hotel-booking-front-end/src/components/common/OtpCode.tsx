import React, { useState, useRef, ChangeEvent, KeyboardEvent } from "react";

interface OTPInputProps {
  length?: number;
  onChange?: (otp: string) => void;
}

const OtpCode: React.FC<OTPInputProps> = ({ length = 6, onChange }) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number): void => {
    const { value } = e.target;
    
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value.toUpperCase();
      setOtp(newOtp);

      if (onChange) {
        onChange(newOtp.join(''));
      }

      if (value && index < length - 1 && inputs.current[index + 1]) {
        inputs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number): void => {
    const currentValue = otp[index];
    
    if (e.key === 'Backspace') {
      e.preventDefault();
      
      const newOtp = [...otp];
      
      if (currentValue !== '') {
        newOtp[index] = '';
        setOtp(newOtp);
        if (onChange) {
          onChange(newOtp.join(''));
        }
      } else if (index > 0) {
        newOtp[index - 1] = '';
        setOtp(newOtp);
        if (onChange) {
          onChange(newOtp.join(''));
        }
        inputs.current[index - 1]?.focus();
      }
    }

    if (e.key === 'Delete') {
      e.preventDefault();
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      if (onChange) {
        onChange(newOtp.join(''));
      }
    }

    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputs.current[index - 1]?.focus();
    }

    if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault();
      inputs.current[index + 1]?.focus();
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').toUpperCase();
    if (!pasteData) return;

    const newOtp = [...otp];
    let curIndex = index;

    for (let i = 0; i < pasteData.length && curIndex < length; i++) {
      newOtp[curIndex] = pasteData[i];
      curIndex++;
    }

    setOtp(newOtp);
    if (onChange) {
      onChange(newOtp.join(''));
    }

    const nextIndex = Math.min(index + pasteData.length, length - 1);
    inputs.current[nextIndex]?.focus();
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      {Array(length)
        .fill('')
        .map((_, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={otp[index]}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onFocus={handleFocus}
            onPaste={(e) => handlePaste(e, index)}
            ref={(el) => (inputs.current[index] = el)}
            style={{
              width: '40px',
              height: '40px',
              margin: '0 5px',
              textAlign: 'center',
              fontSize: '18px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              textTransform: 'uppercase'
            }}
          />
        ))}
    </div>
  );
};

export default OtpCode;