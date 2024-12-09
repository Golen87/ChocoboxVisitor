export function Typing({ onSubmit }: { onSubmit: (text: string) => void }) {
	function sendMessage(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		onSubmit(event.currentTarget.message.value);
		event.currentTarget.reset();
	}

	return (
		<div className="bg-gray-800 p-8 rounded-md grid grid-cols-1 gap-8">
			{/* Input */}
			<div className="col-span-1">
				<div className="grid grid-cols-3 gap-4">
					{/* <button
						type="button"
						className="text-white bg-rose-700 hover:bg-rose-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
						onClick={() => {}}
					>
						Button
					</button> */}

					<div className="col-span-2">
						<form onSubmit={sendMessage}>
							<div className="flex">
								<input
									type="text"
									name="message"
									className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg rounded-r-none focus:border-blue-500 block w-full p-2.5"
									placeholder="Type here..."
									required
								/>
								<button
									type="submit"
									className="text-gray-500 bg-gray-300 hover:bg-gray-200 font-medium rounded-lg rounded-l-none sm:w-auto px-3.5"
								>
									►
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
