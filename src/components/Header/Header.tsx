import { NavLink } from 'react-router';

const Header = () => {
	return (
		<nav aria-label="Main navigation">
			<NavLink to="/" end>
				Dashboard
			</NavLink>
			<NavLink to="/operations" end>
				Operations
			</NavLink>
			<NavLink to="/payments" end>
				Payments
			</NavLink>
			<NavLink to="/profile" end>
				Profile
			</NavLink>
		</nav>
	);
};

export default Header;
