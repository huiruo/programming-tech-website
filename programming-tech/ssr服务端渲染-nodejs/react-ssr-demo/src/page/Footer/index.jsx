import React from "react";

export default function Footer(props) {
  return <div>

    <button onClick={() => alert('this is Text')}>
      {props.text}AA
    </button>
  </div>;
}
