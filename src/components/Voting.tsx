import { useState } from "react";
import cn from "classnames";

export function Voting({
	options,
	onSubmit,
}: {
	options: string[];
	onSubmit: (vote: string) => void;
}) {
	const [selected, setSelected] = useState<string | null>(null);

	function submit() {
		if (selected) {
			onSubmit(selected);
		}
	}

	return (
		<div className="bg-gray-800 p-8 rounded-md flex flex-col gap-8">
			<h2 className="text-center text-white text-2xl font-medium">
				Pick your favorite
			</h2>

			<div className="flex flex-col gap-4">
				{options.map((option: string) => (
					<div
						key={option}
						className={cn("voteButton", option == selected ? "vote2" : "vote3")}
						onClick={() => setSelected(option)}
					>
						{option}
					</div>
				))}
			</div>

			<button
				type="button"
				className="submit"
				disabled={selected == null}
				onClick={submit}
			>
				Submit
			</button>
		</div>
	);
}
