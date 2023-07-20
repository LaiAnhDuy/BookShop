import React from 'react';
import Header from '../components/Layout/Header';
import EventCard from '../components/Events/EventCard';
import {useSelector} from 'react-redux';
import styles from '../styles/styles';
import Loader from '../components/Layout/Loader';

const EventsPage = () => {
	const {allEvents, isLoading} = useSelector((state) => state.events);
	console.log(allEvents);

	return (
		<div>
			{isLoading ? (
				<Loader />
			) : (
				<div>
					<Header activeHeading={4} />
					<br />
					<br />
					<div className={`${styles.section} flex flex-col gap-3`}>
						{allEvents &&
							allEvents.length > 0 &&
							allEvents?.map((event, index) => {
								// console.log(event);
								return (
									<EventCard
										data={event}
										active={true}
										key={index}
									/>
								);
							})}
					</div>
				</div>
			)}
		</div>
	);
};

export default EventsPage;
