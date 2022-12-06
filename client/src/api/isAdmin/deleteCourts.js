import axios from 'axios';

export default function deleteCourts(courtName) {
	const test = async () => {
		await axios.post('/api/allCourts/deleteCourt', {
			name: courtName,
		});
	};
	return test();
}
