import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {backend_url} from '../../server.js';
import styles from '../../styles/styles.js';
import axios from '../../redux/actions/axiosConfig.js';
import {useParams} from 'react-router-dom';
import {getAllProductsShop} from '../../redux/actions/product.js';
import {Link} from 'react-router-dom';

const ShopInfo = ({isOwner}) => {
	const dispatch = useDispatch();
	// const {data} = useSelector((state) => state.data);
	const {id} = useParams();
	const {products} = useSelector((state) => state.product);

	const [data, setData] = useState({});

	useEffect(() => {
		dispatch(getAllProductsShop(id));
		axios
			.get(`/shop/get-shop-info/${id}`)
			.then((response) => {
				setData(response.data.shop);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	const handleLogout = async () => {
		await axios.get('/shop/logout');
		window.location.reload();
	};
	console.log(data);
	return (
		<div className=" w-full">
			<div className=" w-full flex justify-center pt-5">
				<img
					src={backend_url + data?.avatar}
					alt=""
					className="w-[150px] h-[150px] rounded-full object-cover"
				/>
			</div>
			<h3 className="text-center text-[20px] pt-2 font-[600]">{data.name}</h3>
			<p className="text-[16px] text-[#000000a6] p-[10px] flex justify-center">
				{data.description}
			</p>
			<div className="p-3">
				<h3 className="font-[600]">Address</h3>
				<h4 className="text-[#000000a6]">{data.address}</h4>
			</div>
			<div className="p-3">
				<h3 className="font-[600]">Phone Number</h3>
				<h4 className="text-[#000000a6]">{data.phoneNumber}</h4>
			</div>
			<div className="p-3">
				<h3 className="font-[600]">Total Products</h3>
				<h4 className="text-[#000000a6]">10</h4>
			</div>
			<div className="p-3">
				<h3 className="font-[600]">Shop Rattings</h3>
				<h4 className="text-[#000000a6]">4.5</h4>
			</div>
			<div className="p-3">
				<h3 className="font-[600]">Joined On</h3>
				<h4 className="text-[#000000a6]">{data.createdAt?.slice(0, 10)}</h4>
			</div>
			{isOwner && (
				<div>
					<div className="py-3 px-4">
						<Link to={'/dashboard'}>
							<button className="bg-gray-950 w-full h-[45px]  rounded-md text-white">
								Edit Shop
							</button>
						</Link>
					</div>
					<div className="py-3 px-4">
						<button
							className="bg-gray-950 w-full h-[45px]  rounded-md text-white"
							onClick={handleLogout}
						>
							Logout
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default ShopInfo;
