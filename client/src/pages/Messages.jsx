import { useEffect, useState, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import AppContext from '../context/appContext';
import axios from 'axios';
import MessageUsers from '../components/messanger/MessageUsers';
import ChatContainer from '../components/messanger/ChatContainer';
import socketIO from 'socket.io-client';

function Messages() {
	const { id } = useParams();
	const socket = socketIO.connect('https://tennis-pal.herokuapp.com');
	console.log(socket);

	const [contacts, setContacts] = useState([]);
	const [currentChat, setCurrentChat] = useState();

	const { user } = useContext(AppContext);

	useEffect(() => {
		axios.post('/api/users/getUserById', { id }).then(({ data }) => {
			setCurrentChat(data);
		});
	}, [id]);

	useEffect(() => {
		if (user) {
			socket.emit('add-user', user._id);
		}
	}, [user]);

	useEffect(() => {
		axios
			.post(`/api/users/getAllContactedUsers`, {
				user: user._id,
			})
			.then(({ data }) => {
				const contacted = data.usersContacted;
				const uniqueContact = Array.from(
					contacted
						.reduce(
							(prev, currentUser) => prev.set(currentUser._id, currentUser),
							new Map(),
						)
						.values(),
				);
				setContacts(uniqueContact);
			});
	}, []);

	const mostRecentChat = current => {
		let find = contacts.find(contact => contact._id === current);
		const test = contacts.indexOf(find);
		contacts.splice(test, 1);
		contacts.unshift(currentChat);
	};

	return (
		<div className='page-containers'>
			<div className='messages-container'>
				<MessageUsers allContacts={contacts} />
				<ChatContainer
					currentChat={currentChat}
					currentUser={user}
					socket={socket}
					mostRecentChat={mostRecentChat}
				/>
			</div>
		</div>
	);
}

export default Messages;
