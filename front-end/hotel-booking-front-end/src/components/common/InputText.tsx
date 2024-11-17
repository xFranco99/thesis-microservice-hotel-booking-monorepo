import { Fragment } from "react/jsx-runtime";

interface Props {
  className?: string;
  id?: string;
  ariaDescribedby?: string;
  placeholder?: string;
}

function InputText({ className = 'form-control', id, ariaDescribedby, placeholder }: Props) {
  return (
    <Fragment>
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
