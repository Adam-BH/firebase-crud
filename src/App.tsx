import { useEffect, useState } from 'react';
import './App.css';

import { db } from './config/firebase';

import {
	addDoc,
	getDoc,
	getDocs,
	updateDoc,
	deleteDoc,
	query,
	where,
	collection,
	doc,
	onSnapshot,
} from 'firebase/firestore';

interface Blog {
	desc: string;
	writer: string;
	id: string;
}

function App() {
	const [input, setInput] = useState('');
	const createData = async () => {
		const profileCollec = collection(
			db,
			'profiles',
			'76IGfIgxD6L7mOiugBb3',
			'friends'
		);
		try {
			await addDoc(profileCollec, {
				username: input,
			});
			console.log('doc added');
		} catch (err) {
			console.error(err);
		}
	};

	const readData = async () => {
		// const docRef = doc(
		// 	db,
		// 	'profiles',
		// 	'76IGfIgxD6L7mOiugBb3',
		// 	'friend',
		// 	'Mixv3XGPaIWnKvu3ZzOH'
		// );
		// try {
		// 	const docm = await getDoc(docRef);
		// 	console.log(docm.data());
		// } catch (err) {
		// 	console.error(err);
		// }

		const myCollec = collection(
			db,
			'profiles',
			'76IGfIgxD6L7mOiugBb3',
			'friends'
		);
		const myQuerry = query(myCollec, where('username', '==', 'saif'));
		const data = await getDocs(myQuerry);
		data.docs.map((doc) => {
			console.log(doc.id);
			console.log(doc.data());
		});
	};

	const [inputQuantity, setInputQuantity] = useState(0);
	const [amount, setAmount] = useState(5);
	const updateData = async () => {
		const mrewelDoc = doc(db, 'shopItems', 'V8ZewEf1D5HzXDJE75ws');
		await updateDoc(mrewelDoc, {
			amount: amount - inputQuantity,
		});
		setAmount(amount - inputQuantity);
	};

	const deleteData = async () => {
		const mrewelDoc = doc(db, 'shopItems', 'V8ZewEf1D5HzXDJE75ws');
		await deleteDoc(mrewelDoc);
	};

	/// snapshot thing
	const [blogInput, setBlogInput] = useState('');
	const addBlog = async () => {
		const collec = collection(db, 'blogs');
		const newDoc = await addDoc(collec, {
			writer: 'adam',
			desc: blogInput,
		});
		console.log('added');
	};

	const [blogs, setBlogs] = useState<Blog[]>([]);
	const getBlogs = async () => {
		const collec = collection(db, 'blogs');

		const unsub = onSnapshot(collec, (snapshot) => {
			setBlogs(
				snapshot.docs.map((doc) => {
					return {
						id: doc.id,
						writer: doc.data().writer,
						desc: doc.data().desc,
					};
				})
			);
		});

		return () => unsub();
	};

	useEffect(() => {
		getBlogs();
	}, []);

	return (
		<div className="App">
			<h1>CRUD with firebase</h1>
			<hr></hr>

			<div>
				<h2>Create Data</h2>
				<input onChange={(e) => setInput(e.target.value)} type="text" />
				<button onClick={createData}>Submit</button>
			</div>

			<div>
				<h2>Read Data</h2>
				<button onClick={readData}>Read</button>
			</div>

			<div>
				<h2>Update Data</h2>
				<input
					type="number"
					onChange={(e) => setInputQuantity(Number(e.target.value))}
				/>
				<button onClick={updateData}>Buy</button>
			</div>

			<div>
				<h3>Delete Data</h3>
				<button onClick={deleteData}>Delete</button>
			</div>

			<div>
				<h2>Getting data using snapshot</h2>
				<textarea onChange={(e) => setBlogInput(e.target.value)} />
				<button onClick={addBlog}>Submit</button>

				{blogs.map((blog: Blog) => {
					return (
						<>
							<h3>{blog.writer}</h3>
							<p>{blog.desc}</p>
							<hr></hr>
						</>
					);
				})}
			</div>
		</div>
	);
}

export default App;
