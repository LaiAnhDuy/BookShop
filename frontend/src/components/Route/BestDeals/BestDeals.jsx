import React, {useState, useEffect} from 'react';
import {productData} from '../../../static/data';
import styles from '../../../styles/styles.js';
import ProductCard from '../ProductCard/ProductCard.jsx';
import {useDispatch, useSelector} from 'react-redux';
import {getAllProducts} from '../../../redux/actions/product';

const BestDeals = () => {
	const dispatch = useDispatch();
	const [data, setData] = useState([]);
	const {allProducts} = useSelector((state) => state.product);

	useEffect(() => {
		const allProductsData = allProducts ? [...allProducts] : [];

		let sortedData =
			allProductsData &&
			allProductsData.sort((a, b) => {
				return b.sold_out - a.sold_out;
			});
		const firstFive =
			sortedData && sortedData && sortedData.length > 0 && sortedData.slice(0, 10);
		setData(firstFive);
	}, [allProducts]);

	return (
		<div>
			<div className={styles.section}>
				<div className={`${styles.heading} pt-[40px]`}>
					<h1> Popular Books</h1>
				</div>
				<div className="  pb-[25px] grid grid-cols-1 gap-[15px] md:grid-cols-2 md:gap-[10px] lg:grid-cols-4 lg:gap-[20px] xl:grid-cols-5 xl:gap-[25px]">
					{data &&
						data.map((i, index) => (
							<ProductCard
								data={i}
								key={index}
							/>
						))}
				</div>
			</div>
		</div>
	);
};

export default BestDeals;
