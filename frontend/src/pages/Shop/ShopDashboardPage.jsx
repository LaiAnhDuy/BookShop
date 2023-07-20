import React from 'react';
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader.jsx';
import DashboardSidebar from '../../components/Shop/Layout/DashboardSideBar.jsx';
import DashboardHero from '../../components/Shop/DashboardHero.jsx';

const ShopDashboardPage = () => {
	return (
		<div>
			<DashboardHeader />
			<div className="flex justify-between w-full">
				<div className="w-[80px] 800px:w-[330px]">
					<DashboardSidebar active={1} />
				</div>
				<div className="w-full">
					<DashboardHero />
				</div>
			</div>
		</div>
	);
};

export default ShopDashboardPage;
