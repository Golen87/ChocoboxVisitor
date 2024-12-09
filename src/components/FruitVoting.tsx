import { useState } from "react";
import imageApple from "../assets/apple.png";
import imageBanana from "../assets/banana.png";
import imagePear from "../assets/pear.png";
import imageBlueberry from "../assets/blueberry.png";

export function Voting({ onSubmit }: { onSubmit: (option: string) => void }) {
	const [selected, setSelected] = useState<string | null>(null);
	const options = [
		{
			key: "red",
			name: "Apple",
			color: "bg-red-600 active:bg-red-700",
			image: imageApple,
		},
		{
			key: "yellow",
			name: "Banana",
			color: "bg-yellow-500 active:bg-yellow-600",
			image: imageBanana,
		},
		{
			key: "green",
			name: "Broccoli",
			color: "bg-green-600 active:bg-green-700",
			image: imagePear,
		},
		{
			key: "blue",
			name: "Blueberries",
			color: "bg-blue-700 active:bg-blue-800",
			image: imageBlueberry,
		},
	];

	function submit(selected: string) {
		onSubmit(selected);
	}

	return (
		<div className="bg-gray-800 p-8 rounded-md grid gap-12">
			{/* <h2 className="text-center text-white text-2xl font-medium">
				Pick your favorite
			</h2> */}

			<div className="grid grid-cols-2 gap-x-8 gap-y-4 max-w-fit m-auto">
				{options.map((option: any) => (
					<div
						key={option.key}
						className="flex flex-col gap-2 text-white text-sm text-center font-medium p-0"
					>
						<div
							className={`outline outline-2 outline-offset-4 rounded-lg p-4 aspect-square
								${option.color}
								${option.key == selected ? "outline-white" : "outline-transparent opacity-75"}`}
							onClick={() => {
								setSelected(option.key);
								submit(option.key);
							}}
						>
							<img src={option.image} className="m-auto w-32"></img>
						</div>
						<span className="text-lg capitalize">{option.key}</span>
					</div>
				))}
				{/* <button
					type="button"
					className={`${
						selected
							? "bg-sky-700 active:bg-sky-800 text-white outline-white"
							: "bg-gray-500 opacity-50 outline-transparent"
					} col-span-2 mt-8 w-full rounded-lg px-16 py-2.5 text-2xl font-medium`}
					disabled={selected == null}
					onClick={submit}
				>
					Submit
				</button> */}
			</div>
		</div>
	);
}
