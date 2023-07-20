import React from 'react';
import {Link} from 'react-router-dom';
import styles from '../../styles/styles';
import CountDown from './CountDown.jsx';
import {backend_url} from '../../server';

const EventCard = ({active, data}) => {
	console.log(data);
	return (
		<div
			className={`w-full bg-white rounded pl-3  ${active ? '' : 'mb-12'} lg:flex `}
		>
			<div className="w-full lg:w-[30%] m-auto">
				<img
					src={backend_url + data?.images[0]}
					alt=""
				/>
			</div>
			<div className="w-full p-3 lg:w-[70%] flex flex-col justify-center">
				<h2 className={`${styles.productTitle}`}>Iphone xs max</h2>
				<p>{data.description}</p>
				<div className="flex py-2 justify-between">
					<div className="flex">
						<h5 className="font-[500] text-[18px] text-[#d55b45] pr-3 line-through">
							{data.originalPrice ? data.originalPrice + '$' : null}
						</h5>
						<h5 className="font-bold text-[20px] text-[#333] font-Roboto">
							{data.discountPrice + '$'}
						</h5>
					</div>
					<span className="pr-3 font-[400] text-[17px] text-[#44a55e]">
						120 sold
					</span>
				</div>
				{new Date(data.start_date).getTime() > new Date().getTime() ? (
					<div>
						<span>'The event will start in'</span>
						<CountDown targetDate={data.start_date}></CountDown>
					</div>
				) : null}
				<CountDown targetDate={data.Finish_Date} />
				<br />
				<div className="flex items-center">
					<Link to={`/product`}>
						<div className={`${styles.button} text-[#fff]`}>See Details</div>
					</Link>
					<div
						className={`${styles.button} text-[#fff] ml-5`}
						// onClick={() => addToCartHandler(data)}
					>
						Add to cart
					</div>
				</div>
			</div>
		</div>
	);
};

export default EventCard;
