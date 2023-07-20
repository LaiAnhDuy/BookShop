import React, {useEffect, useState} from 'react';
import {productData} from '../../static/data';
import {Link, useParams} from 'react-router-dom';
import ProductCar from '../Route/ProductCard/ProductCard';
import {useDispatch, useSelector} from 'react-redux';
import {getAllProductsShop} from '../../redux/actions/product';

const ShopProfileData = ({isOwner}) => {
	const dispatch = useDispatch();
	const {id} = useParams();

	const {products} = useSelector((state) => state.product);

	const [active, setActive] = useState(1);
	useEffect(() => {
		dispatch(getAllProductsShop(id));
	}, []);
	return (
		<div className="w-full">
			<div className=" flex items-center justify-between">
				<div className="flex items-center">
					<div className="p-5">
						<h3
							className={`${
								active == 1 ? 'text-red-500' : 'text-gray-500'
							} text-[16px] font-[500]  cursor-pointer`}
							onClick={() => setActive(1)}
						>
							Sản phẩm
						</h3>
					</div>
					<div className="p-5">
						<h3
							className={`${
								active == 2 ? 'text-red-500' : 'text-gray-500'
							} text-[16px] font-[500]  cursor-pointer`}
							onClick={() => setActive(2)}
						>
							Chạy sự kiện
						</h3>
					</div>
					<div className="p-5">
						<h3
							className={`${
								active == 3 ? 'text-red-500' : 'text-gray-500'
							} text-[16px] font-[500]  cursor-pointer`}
							onClick={() => setActive(3)}
						>
							Đánh giá
						</h3>
					</div>
				</div>
				<div>
					{isOwner && (
						<div>
							<Link to={'/dashboard'}>
								<button className="p-2 bg-gray-950 text-white text-[16px] rounded-md">
									Đến bảng điều khiển
								</button>
							</Link>
						</div>
					)}
				</div>
			</div>
			<br />
			{active === 1 && (
				<div className="grid grid-cols-1 first-letter gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-4 xl:gap-[20px] mb-12 border-0">
					{products &&
						products.map((i, index) => (
							<div key={index}>
								<ProductCar data={i} />
							</div>
						))}
				</div>
			)}
		</div>
	);
};

export default ShopProfileData;
