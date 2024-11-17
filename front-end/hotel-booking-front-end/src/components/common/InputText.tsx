import { Fragment } from "react/jsx-runtime";

interface Props {
  className?: string;
  id?: string;
  ariaDescribedby?: string;
  placeholder?: string;
  label?: string
  forGroup?: string
}

function InputText({ className = 'form-control', id, ariaDescribedby, placeholder, label, forGroup }: Props) {
  return (
    <Fragment>
      <label className="" htmlFor={forGroup}>{label}</label>
      <input
        type="text"
        className={className}
        id={id}
        aria-describedby={ariaDescribedby}
        placeholder={placeholder}
      />
    </Fragment>
  );
}

export default InputText;
