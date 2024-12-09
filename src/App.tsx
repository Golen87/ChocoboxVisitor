import { useState } from "react";

import socketManager from "./socket/SocketManager";
import * as Omni from "./socket/omniProtocol";
import * as Host from "./socket/hostProtocol";

import { Mode } from "./Mode";
import { Code } from "./components/Code";
import { Blank } from "./components/Blank";
import { Drawing } from "./components/Drawing";
import { Typing } from "./components/Typing";
import { Voting } from "./components/Voting";
import { Mashup } from "./components/Mashup";
import { Joystick } from "./components/Joystick";

function App() {
	const [mode, setMode] = useState<Mode>(Mode.Code);
	const [voteOptions, setVoteOptions] = useState<string[]>(["A", "B", "C"]);
	const [mashupOptions, setMashupOptions] = useState<{
		images: { id: string; base64: string }[];
		texts: { id: string; text: string }[];
	}>({
		images: [
			{ id: "id1", base64: "..." },
			{ id: "id2", base64: "..." },
		],
		texts: [
			{ id: "id1", text: "..." },
			{ id: "id2", text: "..." },
		],
	});

	function connectToServer(code: string, name: string) {
		socketManager.connect(code, name, {
			[Omni.OmniType.Disconnect]: ({ message }: Omni.ServerAuthorized) => {
				confirm(message);
				setMode(Mode.Code);
			},
			[Omni.OmniType.Authorized]: ({}: Omni.ServerAuthorized) => {
				setMode(Mode.Blank);
			},
			[Host.HostType.SetBlank]: ({}: Host.SetBlank) => {
				setMode(Mode.Blank);
			},
			[Host.HostType.StartDrawing]: ({}: Host.StartDrawing) => {
				setMode(Mode.Drawing);
			},
			[Host.HostType.StartTyping]: ({}: Host.StartTyping) => {
				setMode(Mode.Typing);
			},
			[Host.HostType.StartVote]: ({ options }: Host.StartVote) => {
				setMode(Mode.Voting);
				setVoteOptions(options);
			},
			[Host.HostType.StartMashup]: ({ images, texts }: Host.StartMashup) => {
				setMode(Mode.Mashup);
				setMashupOptions({ images, texts });
			},
			[Host.HostType.StartJoystick]: ({}: Host.StartJoystick) => {
				setMode(Mode.Joystick);
			},
		});
	}

	return (
		<div id="app">
			{mode == Mode.Code && <Code connectToServer={connectToServer} />}
			{mode == Mode.Blank && <Blank />}
			{mode == Mode.Drawing && (
				<Drawing
					onSubmit={(base64: string) => socketManager.submitImage(base64)}
				/>
			)}
			{mode == Mode.Typing && (
				<Typing onSubmit={(text: string) => socketManager.submitText(text)} />
			)}
			{mode == Mode.Voting && (
				<Voting
					options={voteOptions}
					onSubmit={(vote: string) => socketManager.submitVote(vote)}
				/>
			)}
			{mode == Mode.Mashup && (
				<Mashup
					options={mashupOptions}
					onSubmit={(imageId: string, textId: string) =>
						socketManager.submitMashup(imageId, textId)
					}
				/>
			)}
			{mode == Mode.Joystick && (
				<Joystick
					onSubmit={(x: number, y: number) =>
						socketManager.submitMovement(x, y)
					}
				/>
			)}
		</div>
	);
}

export default App;
