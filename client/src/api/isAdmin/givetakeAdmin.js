import axios from 'axios';

export default function givetakeAdmin(user) {
	const test = async () => {
		if (user.isAdmin === false) {
			await axios.post('/api/allUsers/makeAdmin', {
				_id: user._id,
			});
		} else {
			await axios.post('/api/allUsers/deleteAdmin', {
				_id: user._id,
			});
		}
	};
	return test();
}
