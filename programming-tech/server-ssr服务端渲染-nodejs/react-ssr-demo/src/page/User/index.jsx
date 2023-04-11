import React from "react";
import {getUser} from '../../service/index';
import { wrapPromise } from "../../utils";
const getUsers = getUser({us: '124455', ps: 'sds'});
const wrapUser = wrapPromise(getUsers);
export default function User() {
  const result = wrapUser.read();
  return <div>用户组件: {result.message?'true': 'false'}{result.userName}</div>;
}
