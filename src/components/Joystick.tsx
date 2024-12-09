import { useRef, useEffect } from "react";
import imageArrows from "../assets/arrows.svg";

export function Joystick({
	onSubmit,
}: {
	onSubmit: (x: number, y: number) => void;
}) {
	const wrapperRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (canvasRef.current == null) throw new Error("Could not get context");
		const canvas = canvasRef.current;
		const context = canvas.getContext("2d");
		if (context == null) throw new Error("Could not get context");

		var arrows = new Image();
		arrows.src = imageArrows;
		arrows.onload = () => {
			context.drawImage(arrows, 0, 0);
		};

		let isTouch = false;
		let width: number;
		let height: number;
		let radius: number;
		let xOrig: number;
		let yOrig: number;

		const resize = () => {
			const wrapperWidth = wrapperRef.current!.clientWidth;

			// width = 448 - 128;
			width = wrapperWidth - 64;
			radius = width / 4.2;
			height = width;
			context.canvas.width = width;
			context.canvas.height = height;
			drawBackground();
			drawJoystick(width / 2, height / 2);
		};

		const drawBackground = () => {
			xOrig = width / 2;
			yOrig = height / 2;

			context.beginPath();
			context.arc(xOrig, yOrig, radius + 20, 0, Math.PI * 2, true);
			context.fillStyle = "#374151";
			context.fill();
		};

		const drawJoystick = (x: number, y: number) => {
			context.beginPath();
			context.arc(x, y, radius, 0, Math.PI * 2, true);
			context.fillStyle = "#F08080";
			context.fill();
			context.strokeStyle = "#F6ABAB";
			context.lineWidth = 8;
			context.stroke();

			context.drawImage(arrows, x - width / 2, y - height / 2);
		};

		let coord = { x: 0, y: 0 };
		let hold = false;

		// const easing = (t: number) => {
		// 	return -(Math.cos(Math.PI * t) - 1) / 2;
		// };

		const getPosition = (
			event: MouseEvent | TouchEvent,
			ease: boolean = false
		) => {
			if ("clientX" in event) {
				coord.x = event.clientX;
				coord.y = event.clientY;
			} else if ("touches" in event) {
				coord.x = event.touches[0].clientX;
				coord.y = event.touches[0].clientY;
			}

			coord.x -= canvas.offsetLeft;
			coord.y -= canvas.offsetTop;

			if (ease) {
				// Deliberately slow down movement
				coord.x = (coord.x - width / 2) / 2 + width / 2;
				coord.y = (coord.y - height / 2) / 2 + height / 2;

				// let myAngle = Math.atan2(coord.y - yOrig, coord.x - xOrig);
				// let myRadius = Math.sqrt(
				// 	Math.pow(coord.x - xOrig, 2) + Math.pow(coord.y - yOrig, 2)
				// );
				// coord.x = myRadius * Math.cos(myAngle) + xOrig;
				// coord.y = myRadius * Math.sin(myAngle) + yOrig;
			}
		};

		const insideCircle = () => {
			let current_radius = Math.sqrt(
				Math.pow(coord.x - xOrig, 2) + Math.pow(coord.y - yOrig, 2)
			);
			return current_radius <= radius;
		};

		const startDrawing = (event: MouseEvent | TouchEvent) => {
			getPosition(event, true);
			if (insideCircle()) {
				hold = true;
				context.clearRect(0, 0, canvas.width, canvas.height);
				drawBackground();
				drawJoystick(coord.x, coord.y);
				drawAll(event);
			}
		};

		const stopDrawing = () => {
			hold = false;
			context.clearRect(0, 0, canvas.width, canvas.height);
			drawBackground();
			drawJoystick(width / 2, height / 2);

			notifyPosition(0, 0);
		};

		const drawAll = (event: MouseEvent | TouchEvent) => {
			if (hold) {
				getPosition(event, true);

				context.clearRect(0, 0, canvas.width, canvas.height);
				drawBackground();
				let x, y;
				let angle = Math.atan2(coord.y - yOrig, coord.x - xOrig);

				if (insideCircle()) {
					drawJoystick(coord.x, coord.y);
					x = coord.x;
					y = coord.y;
				} else {
					x = radius * Math.cos(angle) + xOrig;
					y = radius * Math.sin(angle) + yOrig;
					drawJoystick(x, y);
				}

				let xRelative = (x - xOrig) / radius;
				let yRelative = (y - yOrig) / radius;

				xRelative = Math.round(xRelative * 1000) / 1000;
				yRelative = Math.round(yRelative * 1000) / 1000;

				notifyPosition(xRelative, yRelative);
			}
		};

		let lastX = 0;
		let lastY = 0;
		const notifyPosition = (x: number, y: number) => {
			let distMoved = Math.sqrt(
				Math.pow(x - lastX, 2) + Math.pow(y - lastY, 2)
			);
			let needsUpdate = (x == 0 && y == 0) || distMoved > 0.1;
			if (needsUpdate) {
				lastX = x;
				lastY = y;
				onSubmit(x, y);
			}
		};

		context.beginPath();
		context.arc(50, 50, 50, 0, 2 * Math.PI);
		context.fill();

		resize();

		document.addEventListener("mousedown", (event) => {
			if (!isTouch) {
				startDrawing(event);
			}
		});
		document.addEventListener("mouseup", () => {
			if (!isTouch) {
				stopDrawing();
			}
		});
		document.addEventListener("mousemove", (event) => {
			if (!isTouch) {
				drawAll(event);
			}
		});

		canvas.addEventListener("touchstart", (event) => {
			isTouch = true;
			startDrawing(event);
		});
		document.addEventListener("touchend", () => {
			isTouch = true;
			stopDrawing();
		});
		document.addEventListener("touchcancel", () => {
			isTouch = true;
			stopDrawing();
		});
		document.addEventListener("touchmove", (event) => {
			isTouch = true;
			drawAll(event);
		});
		window.addEventListener("resize", resize);
	}, []);

	return (
		<div ref={wrapperRef} className="bg-gray-800 p-8 rounded-md select-none">
			<h2 className="text-center text-gray-600 text-2xl">Connected</h2>
			<div>
				{/* <p>X: </p> */}
				{/* <p>Y: </p> */}
				{/* <p>Speed: </p> */}
				{/* <p>Angle: </p> */}
				<canvas ref={canvasRef} height={200} width={200} />
			</div>
		</div>
	);
}
