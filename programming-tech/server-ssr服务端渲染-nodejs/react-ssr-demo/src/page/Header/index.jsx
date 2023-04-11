import React from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  function handleGoOut() {
    navigate("/footer");
  }
  return (
    <div>
      <h2>头部组件</h2>
      <button onClick={() => handleGoOut()}>点击跳转到底部组件</button>
    </div>
  );
}
