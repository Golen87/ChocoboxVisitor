export enum OmniType {
	Connect = "server_connect",
	Disconnect = "server_disconnect",
	Authorized = "server_authorized",
	Code = "server_code",
	Error = "server_error",
	UserJoin = "server_join",
	UserLeave = "server_leave",
}

// Sending token
export interface ServerToken {
	token: string;
	name?: string;
}

// Upon connecting successfully
export interface ServerConnect {
	type: OmniType.Connect;
	message: string;
}

// Upon forced disconnect
export interface ServerDisconnect {
	type: OmniType.Disconnect;
	message: string;
}

// Upon authorizing successfully
export interface ServerAuthorized {
	type: OmniType.Authorized;
	message: string;
}

// Upon receiving public visitor code
export interface ServerCode {
	type: OmniType.Code;
	code: string;
}

// Errors including non-json message sent or invalid token.
export interface ServerError {
	type: OmniType.Error;
	message: string;
}

// Upon new application connecting.
export interface UserJoin {
	type: OmniType.UserJoin;
	user: string;
	role: "host" | "client" | "guest";
}

// Upon application disconnecting.
export interface UserLeave {
	type: OmniType.UserLeave;
	user: string;
	role: "host" | "client" | "guest";
}

export class OmniIncoming {
	onServerConnect(data: ServerConnect): void {}
	onServerDisconnect(data: ServerDisconnect): void {}
	onServerAuthorized(data: ServerAuthorized): void {}
	onServerCode(data: ServerCode): void {}
	onServerError(data: ServerError): void {}
	onUserJoin(data: UserJoin): void {}
	onUserLeave(data: UserLeave): void {}
}

export type OmniRequests = ServerToken;

export type OmniResponses =
	| ServerConnect
	| ServerDisconnect
	| ServerAuthorized
	| ServerCode
	| ServerError
	| UserJoin
	| UserLeave;
