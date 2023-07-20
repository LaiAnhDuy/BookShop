import React, {useEffect, useState} from 'react';
import {productData} from '../../static/data';
import styles from '../../styles/styles';
import ProductCard from '../Route/ProductCard/ProductCard';
import {useSelector} from 'react-redux';

const SuggestedProduct = ({data}) => {
	const [productData, setProductData] = useState(null);
	const {products} = useSelector((state) => state.product);
	// console.log(products);
	useEffect(() => {
		const d =
			products &&
			products.filter((i) => i._id !== data._id && i.category == data.category);
		setProductData(d);
	}, [data, products]);
	// console.log(productData);

	return (
		<div className="pt-5">
			<div className={styles.section}>
				<div className={`${styles.heading} border-b-2`}>
					<h1> Related Product</h1>
				</div>
				<div className="pt-[25px]  pb-[25px] grid grid-cols-1 gap-[15px] md:grid-cols-2 md:gap-[10px] lg:grid-cols-4 lg:gap-[20px] xl:grid-cols-5 xl:gap-[25px]">
					{productData &&
						productData.map((i, index) => (
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

export default SuggestedProduct;
