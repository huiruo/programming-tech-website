import Index from '../pages/index/index';
// import NotFound from '../pages/notFound'
import { HashRouter, useRoutes } from 'react-router-dom';
import { ReduxPage } from '../pages/redux';

// interface IRoute {
// 	path: string,
// 	element: React.ReactNode,
// 	children: any
// }

const routesConfig = [
	{
		path: '/',
		element: <Index />,
	},
	{
		path: '/redux',
		element: <ReduxPage />,
	},
];


const RoutesContainer = () => {
	const GetRoutes = () => {
		const routes = useRoutes(routesConfig);
		return routes
	}

	return (
		<HashRouter>
			<GetRoutes />
		</HashRouter>
	);

};

export default RoutesContainer;