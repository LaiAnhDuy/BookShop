import React from 'react';
import styles from '../../styles/styles';
import EventCard from './EventCard.jsx';
import {useSelector} from 'react-redux';
// import event from '../../../../backend/model/event';

const Events = () => {
	const {allEvents} = useSelector((state) => state.events);
	return (
		<div>
			<div className={`${styles.section} mb-5`}>
				<div className={styles.heading}>
					<h1>Popular Event</h1>
				</div>
				<div className="w-full ">
					{allEvents?.length > 0 ? (
						<EventCard data={allEvents[0]} />
					) : (
						'No Events Available'
					)}
				</div>
			</div>
		</div>
	);
};

export default Events;
