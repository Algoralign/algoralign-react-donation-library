import React, { FC, ReactNode } from "react";
import "./button.css";
interface Props {
  children: ReactNode | ReactNode[];
}

const Button: FC<Props> = ({ children }) => {
  return <button className="donation-button">{children}</button>;
};

export default Button;
