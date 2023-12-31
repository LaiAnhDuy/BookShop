import React from 'react';
import DashboardSideBar from '../../components/Shop/Layout/DashboardSideBar';
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader';
import CreateEvent from '../../components/Shop/CreateEvent.jsx';

const ShopCreateEvents = () => {
	return (
		<div>
			<DashboardHeader />
			<div className="flex justify-between w-full">
				<div className="w-[80px] 800px:w-[330px]">
					<DashboardSideBar active={6} />
				</div>
				<div className="w-full justify-center items-center flex">
					<CreateEvent />
				</div>
			</div>
		</div>
	);
};

export default ShopCreateEvents;
