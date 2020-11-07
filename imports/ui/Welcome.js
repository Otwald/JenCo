import React, { useState, useEffect } from "react";
import Parser from "html-react-parser";
import ReactQuill from "react-quill";

const welcome = (props) => {
  const [land_page, setLandPage] = useState("");

  useEffect(() => {
    if (props.event) {
      if (props.event.land_page !== "") {
        setLandPage(props.event.land_page);
      }
    }
  }, [props.event]);

  return (
    <div className="row welcome">
      <div className="col-sm">
        {land_page !== ""
          ? Parser(land_page, { trim: true })
          : // <ReactQuill value={land_page} readOnly={true} theme={"bubble"} />
            "Loading..."}
        Ein Fisch
      </div>
    </div>
  );
};

export default welcome;
