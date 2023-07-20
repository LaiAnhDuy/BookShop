import React from 'react';
import {Link} from 'react-router-dom';
import {FiPackage, FiShoppingBag} from 'react-icons/fi';
import {useSelector} from 'react-redux';
import {backend_url} from '../../../server';

const DashboardHeader = () => {
	const {seller} = useSelector((state) => state.seller);
	console.log(seller);
	return (
		<div>
			<div className="border  flex justify-between items-center w-full px-4 h-[80px] bg-white shadow-md">
				<div>
					<Link>
					<img
							src="https://shopo.quomodothemes.website/assets/images/logo.svg"
							alt=""
						/>
					</Link>
				</div>

				<div className="flex items-center mr-4">
					<Link
						to="/dashboard-products"
						className="800px:block hidden"
					>
						<FiShoppingBag
							color="#555"
							size={30}
							className="mx-5 cursor-pointer"
						/>
					</Link>
					<Link
						to="/dashboard-orders"
						className="800px:block hidden"
					>
						<FiPackage
							color="#555"
							size={30}
							className="mx-5 cursor-pointer"
						/>
					</Link>

					<Link to={`/shop/${seller._id}`}>
						<img
							src={`${backend_url}${seller.avatar}`}
							alt=""
							className="w-[50px] h-[50px] rounded-full object-cover"
						/>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default DashboardHeader;
