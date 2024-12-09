export enum ClientType {
	SubmitImage = "submit_image",
	SubmitText = "submit_text",
	SubmitVote = "submit_vote",
	SubmitMovement = "submit_movement",
	SubmitMashup = "submit_mashup",
}

// Upon client submitting a base64 image
export interface SubmitImage {
	type: ClientType.SubmitImage;
	base64: string;
}

// Upon client submitting a text response
export interface SubmitText {
	type: ClientType.SubmitText;
	text: string;
}

// Upon client submitting a vote
export interface SubmitVote {
	type: ClientType.SubmitVote;
	vote: string;
}

// Upon client submitting a vote
export interface SubmitMovement {
	type: ClientType.SubmitMovement;
	x: number;
	y: number;
}

// Upon client submitting a vote
export interface SubmitMashup {
	type: ClientType.SubmitMashup;
	imageId: string;
	textId: string;
}

export class ClientIncoming {
	onSubmitImage(data: SubmitImage): void {}
	onSubmitText(data: SubmitText): void {}
	onSubmitVote(data: SubmitVote): void {}
	onSubmitMovement(data: SubmitMovement): void {}
	onSubmitMashup(data: SubmitMashup): void {}
}

export class ClientOutgoing {
	submitImage(base64: string): void {}
	submitText(text: string): void {}
	submitVote(vote: string): void {}
	submitMovement(x: number, y: number): void {}
	submitMashup(imageId: string, textId: string): void {}
}

export type ClientRequests =
	| SubmitImage
	| SubmitText
	| SubmitVote
	| SubmitMovement
	| SubmitMashup;
