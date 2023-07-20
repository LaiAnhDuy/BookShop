import React, {useState, useEffect} from 'react';

function Countdown({targetDate}) {
	const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());

	useEffect(() => {
		const interval = setInterval(() => {
			setTimeRemaining(calculateTimeRemaining(interval));
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	}, []);

	function calculateTimeRemaining(interval) {
		const now = new Date().getTime();
		const distance = new Date(targetDate).getTime() - now;
		if (distance < 0) {
			if (interval) clearInterval(interval);
			return null;
		}

		const days = Math.floor(distance / (1000 * 60 * 60 * 24));
		const hours = Math.floor(
			(distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
		);
		const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((distance % (1000 * 60)) / 1000);

		return {
			days,
			hours,
			minutes,
			seconds,
		};
	}

	return (
		<div>
			{timeRemaining ? (
				<div>
					{`${timeRemaining.days}day ${timeRemaining.hours}hours ${timeRemaining.minutes}minutes ${timeRemaining.seconds}seconds`}
				</div>
			) : (
				'Time Expirce'
			)}
		</div>
	);
}

export default Countdown;
