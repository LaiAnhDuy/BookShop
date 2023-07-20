import React from 'react';

import styles from '../../styles/styles';
import ShopInfo from '../../components/Shop/ShopInfo.jsx';
import ShopProfileData from '../../components/Shop/ShopProfileData.jsx';

const ShopHomePage = () => {
	return (
		<div className={styles.section}>
			<div className=" w-full flex py-10 justify-between">
				<div className="w-[25%] bg-white rounded-sm shadow-sm overflow-scroll h-[90vh] sticky top-10 left-0 z-10">
					<ShopInfo isOwner={true} />
				</div>
				<div className="w-[72%]">
					<ShopProfileData isOwner={true} />
				</div>
			</div>
		</div>
	);
};

export default ShopHomePage;
