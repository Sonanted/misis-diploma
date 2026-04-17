import { NavLink } from 'react-router';

const Header = () => {
	return (
		<div>
			<NavLink to="/">Dashboard</NavLink>
			<NavLink to="/operations">Operations</NavLink>
			<NavLink to="/payments">Payments</NavLink>
			<NavLink to="/profile">Profile</NavLink>
		</div>
	);
};

export default Header;
