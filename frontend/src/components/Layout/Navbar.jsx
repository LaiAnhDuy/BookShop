import React from 'react';
import {Link} from 'react-router-dom';
import {navItems} from '../../static/data';
import styles from '../../styles/styles';
// import {navItems} from '../../../src/static/data';

const Navbar = ({active}) => {
	// console.log(navItems);
	return (
		<div className={`block 800px:${styles.noramlFlex} `}>
			{navItems.map((i, index) => (
				<div className="mb-3 800px:mb-0">
					<Link
						to={i.url}
						className={`${
							active === index + 1 ? 'text-[#17dd1f]' : 'text-black 800px:text-[#fff]'
						}   font-[500] px-6 cursor-pointer}`}
					>
						{i.title}
					</Link>
				</div>
			))}
		</div>
	);
};

export default Navbar;
