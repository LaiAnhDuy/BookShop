import React, {useEffect, useState} from 'react';
import Header from '../components/Layout/Header';
import styles from '../styles/styles';
import ProfileSideBar from '../components/Profile/ProfileSideBar.jsx';
import ProfileContent from '../components/Profile/ProfileContent.jsx';
import {useSearchParams} from 'react-router-dom';

const ProfilePage = () => {
	const [searchParams] = useSearchParams();
	const type = searchParams.get('type');

	const [active, setActive] = useState(1);
	useEffect(() => {
		if (type) setActive(+type);
	}, [type]);
	const actives = new URLSearchParams();
	return (
		<div>
			<Header />
			<div className={`${styles.section} flex bg-[#f5f5f5] mt-[30px]  `}>
				<div className="w-[50px] 800px:w-[330px] ">
					<ProfileSideBar
						active={active}
						setActive={setActive}
					/>
				</div>
				<ProfileContent active={active} />
			</div>
		</div>
	);
};

export default ProfilePage;
