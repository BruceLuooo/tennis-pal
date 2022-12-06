import axios from 'axios';

export default function deleteUser(user) {
	const test = async () => {
		await axios.post('/api/allUsers/deleteUser', {
			_id: user,
		});
	};
	return test();
}
