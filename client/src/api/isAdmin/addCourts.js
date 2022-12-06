import axios from 'axios';

export default function addCourts(newCourt) {
	const test = async () => {
		await axios.post('/api/allCourts/addNewCourt', newCourt);
	};

	return test();
}
