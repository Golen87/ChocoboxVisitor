import { useState } from "react";

export function Mashup({
	options,
	onSubmit,
}: {
	options: {
		images: { id: string; base64: string }[];
		texts: { id: string; text: string }[];
	};
	onSubmit: (imageId: string, textId: string) => void;
}) {
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	const [selectedTextIndex, setSelectedTextIndex] = useState(0);

	function submit() {
		const imageId = options.images[selectedImageIndex].id;
		const textId = options.texts[selectedTextIndex].id;
		onSubmit(imageId, textId);
	}

	function prevImage() {
		setSelectedImageIndex((prevIndex) =>
			prevIndex > 0 ? prevIndex - 1 : options.images.length - 1
		);
	}

	function nextImage() {
		setSelectedImageIndex((prevIndex) =>
			prevIndex < options.images.length - 1 ? prevIndex + 1 : 0
		);
	}

	function prevText() {
		setSelectedTextIndex((prevIndex) =>
			prevIndex > 0 ? prevIndex - 1 : options.texts.length - 1
		);
	}

	function nextText() {
		setSelectedTextIndex((prevIndex) =>
			prevIndex < options.texts.length - 1 ? prevIndex + 1 : 0
		);
	}

	return (
		<div className="bg-gray-800 p-8 rounded-md grid gap-12">
			<h2 className="text-center text-white text-2xl font-medium">
				Design your card
			</h2>

			<div className="grid grid-cols-2 gap-x-8 gap-y-4 max-w-fit m-auto">
				<div className="flex items-center">
					<button onClick={prevImage}>{"<"}</button>
					<img
						src={options.images[selectedImageIndex].base64}
						alt="Selected"
						className="mx-4"
					/>
					<button onClick={nextImage}>{">"}</button>
				</div>
				<div className="flex items-center">
					<button onClick={prevText}>{"<"}</button>
					<p className="mx-4 text-white">
						{options.texts[selectedTextIndex].text}
					</p>
					<button onClick={nextText}>{">"}</button>
				</div>
			</div>

			<button
				onClick={submit}
				className="bg-blue-500 text-white p-2 rounded-md mt-4"
			>
				Submit
			</button>
		</div>
	);
}
