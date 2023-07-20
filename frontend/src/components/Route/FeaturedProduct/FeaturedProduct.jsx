import React from 'react';
import styles from '../../../styles/styles';
import {productData} from '../../../static/data';
import ProductCard from '../ProductCard/ProductCard';
import {useSelector} from 'react-redux';

const FeaturedProduct = () => {
	const {allProducts} = useSelector((state) => state.product);

	const allProductsData = allProducts ? [...allProducts] : [];

	let sortedData =
		allProductsData &&
		allProductsData.sort((a, b) => {
			return (b.ratings || 0) - (a.ratings || 0);
		});
	sortedData = sortedData.slice(0, 10);

	return (
		<div>
			<div className={styles.section}>
				<div className={`${styles.heading} pt-[30px]`}>
					<h1>Featured Books</h1>
				</div>
				<div className=" pb-[25px] grid grid-cols-1 gap-[15px] md:grid-cols-2 md:gap-[10px] lg:grid-cols-4 lg:gap-[20px] xl:grid-cols-5 xl:gap-[25px]">
					{sortedData &&
						sortedData.map((i, index) => (
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

export default FeaturedProduct;
