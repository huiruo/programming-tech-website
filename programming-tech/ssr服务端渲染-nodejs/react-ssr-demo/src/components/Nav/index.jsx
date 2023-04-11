import React from 'react';

import { Link} from 'react-router-dom';

export default function Nav(){
  return <div>
    <Link to="/">主页</Link>
    <Link to="/user">用户</Link>
    <Link to="/footer">底部</Link>
  </div>
}