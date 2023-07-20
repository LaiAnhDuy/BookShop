import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useSearchParams} from 'react-router-dom';
import Header from '../components/Layout/Header';
// import Loader from "../components/Layout/Loader";
import ProductCard from '../components/Route/ProductCard/ProductCard';
import styles from '../styles/styles';
// import {productData} from '../static/data';
import Footer from '../components/Layout/Footer';
import Loader from '../components/Layout/Loader';

const BestSellingPage = () => {
	const [data, setData] = useState([]);
	const {allProducts, isLoading} = useSelector((state) => state.product);

	useEffect(() => {
		let productData = allProducts ? [...allProducts] : [];
		const d = productData.sort((a, b) => b.sold_out - a.sold_out).slice(0, 30);
		setData(d);
	}, [allProducts]);
	// console.log('productPage');
	return (
		<div>
			{isLoading ? (
				<Loader />
			) : (
				<div>
					<Header activeHeading={2} />
					<br />
					<br />
					<div className={`${styles.section}`}>
						<div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
							{data &&
								data.map((i, index) => (
									<ProductCard
										data={i}
										key={index}
									/>
								))}
						</div>
						{data && data.length === 0 ? (
							<h1 className="text-center w-full pb-[100px] text-[20px]">
								No products Found!
							</h1>
						) : null}
					</div>
					<Footer />
				</div>
			)}
		</div>
	);
};

export default BestSellingPage;
