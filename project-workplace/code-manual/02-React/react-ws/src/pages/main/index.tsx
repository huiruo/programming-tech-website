import React from 'react';
import { useNavigate } from 'react-router-dom';
import { routesConfig } from '../../routes';

/**
 * main
 */
export function Main(props: any) {

  const navigate = useNavigate();

  const onToPage = (path: string) => {
    navigate(`/${path}`);
  }

  return (
    <div>
      {routesConfig.map((item) => {
        return (
          <div key={item.path}>
            <button onClick={() => onToPage(item.path)}>{item.title}</button>
          </div>
        )
      })}
    </div>
  );
}