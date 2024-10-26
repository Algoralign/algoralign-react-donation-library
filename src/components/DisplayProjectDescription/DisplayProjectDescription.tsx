import React, { FC, ReactNode, useState, useRef, useEffect } from "react";

import "./displayProjectDescription.css";
interface Props {
  description: string;
}

const DisplayProjectDescription: FC<Props> = ({ description }) => {
  const [isExpandProjectDescription, setIsExpandProjectDescription] =
    useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      // Reset the textarea's height to allow it to shrink and expand
      textareaRef.current.style.height = "auto";

      // Set the textarea's height to its scrollHeight
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [description, isExpandProjectDescription]);

  if (description.length > 500) {
    return (
      <>
        {!isExpandProjectDescription && (
          <div className="description-preview">
            {description.slice(0, 500)}...{" "}
            <span
              onClick={() => setIsExpandProjectDescription(true)}
              className="expand-text"
            >
              See Full Description
            </span>
          </div>
        )}
        {isExpandProjectDescription && (
          <div className="description-expanded">
            <textarea
              ref={textareaRef}
              className="description-textarea"
              value={description}
              readOnly
            />
            <div
              onClick={() => setIsExpandProjectDescription(false)}
              className="collapse-text"
            >
              Collapse Description
            </div>
          </div>
        )}
      </>
    );
  } else {
    return (
      <div className="description-container">
        <textarea
          ref={textareaRef}
          className="description-textarea"
          value={description}
          readOnly
        />
      </div>
    );
  }
};

export default DisplayProjectDescription;
