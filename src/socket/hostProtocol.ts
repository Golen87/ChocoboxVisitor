export enum HostType {
	SetBlank = "set_blank",
	StartDrawing = "start_drawing",
	StartTyping = "start_typing",
	StartVote = "start_vote",
	StartMashup = "start_mashup",
	StartJoystick = "start_joystick",
}

// Tell clients to clear screen
export interface SetBlank {
	type: HostType.SetBlank;
	user: string;
}

// Tell clients to show drawing prompt
export interface StartDrawing {
	type: HostType.StartDrawing;
	user: string;
}

// Tell clients to show typing prompt
export interface StartTyping {
	type: HostType.StartTyping;
	user: string;
}

// Send a poll to clients
export interface StartVote {
	type: HostType.StartVote;
	user: string;
	options: string[];
}

// Start a mashup where clients combine images and text
export interface StartMashup {
	type: HostType.StartMashup;
	user: string;
	images: { id: string; base64: string }[];
	texts: { id: string; text: string }[];
}

// Tell clients to show joystick controls
export interface StartJoystick {
	type: HostType.StartJoystick;
	user: string;
}

export class HostIncoming {
	onSetBlank(data: SetBlank): void {}
	onStartDrawing(data: StartDrawing): void {}
	onStartTyping(data: StartTyping): void {}
	onStartVote(data: StartVote): void {}
	onStartMashup(data: StartMashup): void {}
	onStartJoystick(data: StartJoystick): void {}
}

export class HostOutgoing {
	setBlank(): void {}
	startDrawing(): void {}
	startTyping(): void {}
	startVote(options: string[]): void {}
	startMashup(
		images: { id: string; base64: string }[],
		texts: { id: string; text: string }[]
	): void {}
	startJoystick(): void {}
}

export type HostResponses =
	| SetBlank
	| StartDrawing
	| StartTyping
	| StartVote
	| StartMashup
	| StartJoystick;
