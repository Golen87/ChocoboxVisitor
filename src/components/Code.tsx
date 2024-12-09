import { useEffect, useState, useCallback } from "react";

export function Code({
	connectToServer,
}: {
	connectToServer: (code: string, name: string) => void;
}) {
	const [username, setUsername] = useState("");

	// Send the code and username to the server
	function sendMessage(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const code: string = event.currentTarget.code.value.toUpperCase();
		const name: string = username.toUpperCase();
		localStorage.setItem("username", name);
		connectToServer(code, name);
		// event.currentTarget.reset();
	}

	// Load previous username from local storage
	useEffect(() => {
		const username = localStorage.getItem("username");
		if (username) setUsername(username);
	}, []);

	// Auto focus the code input
	const setCodeInputRef = useCallback((inputElement: HTMLInputElement) => {
		if (inputElement) {
			inputElement.focus();
		}
	}, []);

	return (
		<div className="bg-gray-800 p-8 rounded-md">
			<form onSubmit={sendMessage} className="flex flex-col">
				<h1 className="text-gray-500 text-2xl">Room code</h1>
				<input
					type="text"
					name="code"
					ref={setCodeInputRef}
					className="uppercase mt-2 mb-4 bg-gray-50 text-gray-900 text-xl rounded-lg p-2.5"
					maxLength={4}
					inputMode="text"
					enterKeyHint="go"
					autoCapitalize="characters"
					autoComplete="one-time-code"
					required
				/>
				<h1 className="text-gray-500 text-2xl">Name</h1>
				<input
					type="text"
					name="username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					className="uppercase mt-2 mb-4 bg-gray-50 text-gray-900 text-xl rounded-lg p-2.5"
					maxLength={12}
					inputMode="text"
					enterKeyHint="go"
					autoCapitalize="characters"
					autoComplete="off"
					required
				/>
				<button
					type="submit"
					className="text-white bg-rose-700 hover:bg-rose-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
				>
					Play
				</button>
			</form>
		</div>
	);
}
