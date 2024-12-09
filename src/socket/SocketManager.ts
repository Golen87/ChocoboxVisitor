import { OmniRequests, OmniResponses, OmniType } from "./omniProtocol";
import { HostResponses, HostType } from "./hostProtocol";
import { ClientOutgoing, ClientRequests, ClientType } from "./clientProtocol";

type IncomingTypes = OmniType | HostType;
type Callbacks = Partial<{ [type in IncomingTypes]: (...args: any[]) => void }>;

export class SocketManager implements ClientOutgoing {
	private socket: WebSocket;
	private callbacks: Callbacks;

	constructor() {
		this.callbacks = {
			[OmniType.Connect]: () => {},
			[OmniType.Disconnect]: () => {},
			[OmniType.Authorized]: () => {},
			[OmniType.Code]: () => {},
			[OmniType.Error]: () => {},
		};
	}

	connect(code: string, name: string, callbacks: Callbacks) {
		if (this.socket && this.socket.readyState !== WebSocket.CLOSED) return;

		this.socket = new WebSocket("wss://omni.espeon.dev/ws/");
		// this.socket = new WebSocket("ws://localhost:8000/ws/");
		this.socket.onopen = () => this.send({ token: code, name });
		this.socket.onmessage = (event: MessageEvent) =>
			this.receive(JSON.parse(event.data));

		this.callbacks = {
			...this.callbacks,
			...callbacks,
		};
	}

	disconnect() {
		if (this.socket) {
			this.socket.close();
		}
	}

	private send(data: OmniRequests | ClientRequests) {
		if (this.socket) {
			console.log(data);
			this.socket.send(JSON.stringify(data));
		} else console.warn("Socket not connected");
	}

	private receive(data: OmniResponses | HostResponses) {
		console.log(data);
		if (data.type) {
			const handler = this.callbacks[data.type];
			if (handler) {
				return handler.call(this, data);
			}
		}
		console.warn("Unhandled message:", data);
	}

	/* Outgoing */

	submitImage(base64: string): void {
		this.send({ type: ClientType.SubmitImage, base64 });
	}

	submitMovement(x: number, y: number): void {
		this.send({ type: ClientType.SubmitMovement, x, y });
	}

	submitText(text: string): void {
		this.send({ type: ClientType.SubmitText, text });
	}

	submitVote(vote: string): void {
		this.send({ type: ClientType.SubmitVote, vote });
	}

	submitMashup(imageId: string, textId: string): void {
		this.send({ type: ClientType.SubmitMashup, imageId, textId });
	}
}

const socketManager = new SocketManager();
export default socketManager;
