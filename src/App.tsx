import { BrowserRouter } from 'react-router';

import AppRouter from './AppRouter';
import Header from './components/Header/Header';

const App = () => {
	return (
		<BrowserRouter>
			<Header></Header>
			<AppRouter></AppRouter>
		</BrowserRouter>
	);
};

export default App;
// test
