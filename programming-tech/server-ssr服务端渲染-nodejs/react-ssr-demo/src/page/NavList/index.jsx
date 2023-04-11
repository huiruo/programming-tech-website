import React, { startTransition } from "react";
import { useNavigate } from "react-router-dom";

export default function NavList() {
  const navigate = useNavigate();
  function handleHistory(url) {
    startTransition(() => {
      navigate(url);
    });
  }
  return (
    <ul>
      <li onClick={() => handleHistory("/")}>主页</li>
      <li onClick={() => handleHistory("/footer")}>底部</li>
      <li onClick={() => handleHistory("/user")}>用户页</li>
    </ul>
  );
}
