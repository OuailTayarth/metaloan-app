import React from "react";

const SingleClient = ({ src, text, infoTitle, infoJob }) => {
  return (
    <article className="person">
      <div className="person-img">
        <img src={src} alt={infoTitle} />
      </div>

      <p className="text">{text}</p>

      <div className="info">
        <h1>{infoTitle}</h1>
        <h5> {infoJob}</h5>
      </div>
    </article>
  );
};

export default SingleClient;
