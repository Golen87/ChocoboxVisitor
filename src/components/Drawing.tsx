import { useRef, useEffect, useState } from "react";
import simplify from "simplify-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faArrowRotateLeft,
	faTrashCan,
	faCheck,
} from "@fortawesome/free-solid-svg-icons";

const CANVAS_WIDTH = 256;
const CANVAS_HEIGHT = 256;

interface Point {
	x: number;
	y: number;
}

interface Line {
	points: Point[];
	color: string;
}

const colors = [
	"#ffffff", // White
	"#b91c1c", // Red 700
	"#eab308", // Yellow 500
	"#15803d", // Green 700
	"#2563eb", // Blue 600
];

export function Drawing({ onSubmit }: { onSubmit: (base64: string) => void }) {
	const wrapperRef = useRef<HTMLDivElement>(null);
	const canvasBackRef = useRef<HTMLCanvasElement>(null);
	const canvasFrontRef = useRef<HTMLCanvasElement>(null);

	const [selectedColor, setSelectedColor] = useState("#ffffff");
	const [drawnLines, setDrawnLines] = useState<Line[]>([]);

	function getCanvas(ref: React.RefObject<HTMLCanvasElement>) {
		const canvas = ref.current!;
		const context = canvas.getContext("2d")!;
		return { canvas, context };
	}

	function drawCircle(context: CanvasRenderingContext2D, point: Point) {
		const r = 0.45 * context.lineWidth;
		context.beginPath();
		context.arc(point.x, point.y, r, 0, 2 * Math.PI);
		context.fill();
	}

	function drawLine(context: CanvasRenderingContext2D, { points }: Line) {
		context.beginPath();
		context.moveTo(points[0].x, points[0].y);

		let i = 0;
		if (points.length > 2) {
			for (i = 1; i < points.length - 2; i++) {
				let xc = (points[i].x + points[i + 1].x) / 2;
				let yc = (points[i].y + points[i + 1].y) / 2;
				context.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
			}
		}
		if (points.length > 1) {
			context.quadraticCurveTo(
				points[i].x,
				points[i].y,
				points[i + 1].x,
				points[i + 1].y
			);
		}

		context.stroke();
		context.closePath();

		drawCircle(context, points[0]);
		drawCircle(context, points[points.length - 1]);
	}

	useEffect(() => {
		const { context: contextBack } = getCanvas(canvasBackRef);
		const { canvas: canvasFront, context: contextFront } =
			getCanvas(canvasFrontRef);

		contextBack.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		contextBack.fillStyle = colors[0];
		contextBack.strokeStyle = colors[0];
		contextBack.lineWidth = 8;

		contextFront.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		contextFront.fillStyle = colors[0];
		contextFront.strokeStyle = colors[0];
		contextFront.lineWidth = 8;

		let isTouch = false;
		let points: Point[] = [];
		let coord = { x: 0, y: 0 };
		let prevCoord = { x: 0, y: 0 };
		let isDrawing = false;

		const getPosition = (event: MouseEvent | TouchEvent) => {
			if (event instanceof TouchEvent) isTouch = true;
			else if (isTouch) return;

			if ("clientX" in event) {
				coord.x = event.clientX;
				coord.y = event.clientY;
			} else if ("touches" in event) {
				coord.x = event.touches[0].clientX;
				coord.y = event.touches[0].clientY;
			}

			const rect = canvasFront.getBoundingClientRect();
			coord.x -= rect.x;
			coord.y -= rect.y;
			coord.x = coord.x * (canvasFront.width / rect.width);
			coord.y = coord.y * (canvasFront.height / rect.height);
		};

		const startDrawing = (event: MouseEvent | TouchEvent) => {
			if (event instanceof TouchEvent) isTouch = true;
			else if (isTouch) return;

			isDrawing = true;
			points = [];
			drawAll(event, true);
		};

		const stopDrawing = () => {
			if (isDrawing) {
				points = points.concat({ x: coord.x, y: coord.y });
				points = simplify(points, 0.5, true);
				let line = {
					points: [...points],
					color: contextFront.strokeStyle as string,
				};
				setDrawnLines((lines) => [...lines, line]);
				// lines.push({ points });
				// drawLine(contextBack, { points });
				points = [];
				contextFront.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
				isDrawing = false;
			}
		};

		const drawAll = (event: MouseEvent | TouchEvent, newPath = false) => {
			if (event instanceof TouchEvent) isTouch = true;
			else if (isTouch) return;

			if (isDrawing) {
				getPosition(event);

				if (newPath) {
					prevCoord.x = coord.x;
					prevCoord.y = coord.y;
				}

				const distance = Math.sqrt(
					Math.pow(coord.x - prevCoord.x, 2) +
						Math.pow(coord.y - prevCoord.y, 2)
				);
				if (distance > 2 || newPath) {
					points.push({ x: coord.x, y: coord.y });
					prevCoord.x = coord.x;
					prevCoord.y = coord.y;
				}

				contextFront.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

				drawLine(contextFront, {
					points: points.concat({ x: coord.x, y: coord.y }),
					color: contextFront.strokeStyle as string,
				});
			}
		};

		canvasFront.addEventListener("mousedown", startDrawing);
		document.addEventListener("mouseup", stopDrawing);
		document.addEventListener("mousemove", drawAll);
		canvasFront.addEventListener("touchstart", startDrawing);
		document.addEventListener("touchend", stopDrawing);
		document.addEventListener("touchcancel", stopDrawing);
		document.addEventListener("touchmove", drawAll);
	}, []);

	// Upon setting color
	useEffect(() => {
		const { context: contextFront } = getCanvas(canvasFrontRef);

		contextFront.fillStyle = selectedColor;
		contextFront.strokeStyle = selectedColor;
	}, [selectedColor]);

	// Redraw all lines
	useEffect(() => {
		const { context } = getCanvas(canvasBackRef);
		context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		for (let line of drawnLines) {
			context.fillStyle = line.color;
			context.strokeStyle = line.color;
			drawLine(context, line);
		}
	}, [drawnLines]);

	// Erase all lines
	function reset() {
		setDrawnLines([]);
	}

	// Remove the last line
	function undo() {
		setDrawnLines((lines) => lines.slice(0, -1));
	}

	function submit() {
		const { canvas: canvasBack } = getCanvas(canvasBackRef);

		const base64 = canvasBack.toDataURL("image/png");
		onSubmit(base64);
		reset();
	}

	return (
		<div ref={wrapperRef} className="bg-gray-800 p-8 rounded-md select-none">
			<h2 className="text-center text-gray-600 text-2xl">Connected</h2>
			<div className="relative w-full border rounded-md overflow-hidden">
				<canvas
					className="w-full"
					ref={canvasBackRef}
					height={256}
					width={256}
				/>
				<canvas
					className="canvas"
					ref={canvasFrontRef}
					height={256}
					width={256}
				/>
			</div>
			<div className="mt-2 grid grid-cols-8 gap-1">
				<button type="button" className="redButton" onClick={reset}>
					<FontAwesomeIcon icon={faTrashCan}></FontAwesomeIcon>
				</button>
				<button type="button" className="redButton" onClick={undo}>
					<FontAwesomeIcon icon={faArrowRotateLeft}></FontAwesomeIcon>
				</button>
				{/* <div className="flex-grow grid grid-cols-5"> */}
				{/* <div> */}
				{colors.map((color) => (
					<div
						key={color}
						className={`col-span-1 m-0.5 self-center rounded-full ${
							color == selectedColor ? "border-2" : ""
						}`}
						style={{ backgroundColor: color, aspectRatio: "1 / 1" }}
						onClick={() => {
							setSelectedColor(color);
						}}
					></div>
				))}
				{/* </div> */}
				<button type="button" className="redButton" onClick={submit}>
					<FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
				</button>
			</div>
		</div>
	);
}
