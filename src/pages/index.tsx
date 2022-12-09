// =============== Libraries =============== //
import { useEffect, useReducer, useState } from "react";
import { useQuery } from "react-query";
import Head from "next/head";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import * as WebSocket from "websocket";

// =============== Utils =============== //
import axios from "@/utils/axios";

// =============== Types =============== //
import Room from "@/types/room";

interface Action {
	method: "add" | "clear";
	message: string;
}

const chatReducer = (prev: string[], action: Action): string[] => {
	if (action.method === "add") {
		return [...prev, action.message];
	} else if (action.method === "clear") {
		return [];
	}
	return prev;
};

export default function Home() {
	const [activeGroup, setActiveGroup] = useState("");
	const [chat, dispatchChat] = useReducer(chatReducer, []);
	const { data } = useQuery("/rooms", () =>
		axios.get<Room[]>("/rooms").then((results) => results.data)
	);

	let socket: WebSocket.w3cwebsocket | null = null;
	const connect = (room: string) => {
		if (room !== "") {
			socket = new WebSocket.w3cwebsocket(
				`ws://localhost:5000/rooms/${room}/ws`
			);
			socket.onopen = function () {
				socket!.onmessage = (msg: WebSocket.IMessageEvent) => {
					dispatchChat({
						method: "add",
						message: msg.data as string,
					});
				};
			};
			setActiveGroup(room);
		}
	};

	const close = () => {
		if (socket !== null) {
			socket.close();
			socket = null;
		}
	};

	const reconnect = (room: string) => {
		close();
		connect(room);
		dispatchChat({
			method: "clear",
		} as Action);
	};

	return (
		<>
			<Head>
				<title>Public Chat</title>
			</Head>
			<div className="h-screen">
				<main className="flex h-full">
					{/* Sidemenu */}
					<div className="w-[300px]">
						<List>
							{data?.map((value) => (
								<ListItem disablePadding key={value.id}>
									<ListItemButton
										selected={activeGroup === value.name}
										onClick={() => {
											if (activeGroup !== value.name) reconnect(value.name);
										}}
									>
										<ListItemText primary={value.name} />
									</ListItemButton>
								</ListItem>
							))}
						</List>
					</div>
					<div className="overflow-y-scroll">
						{chat.map((value, i) => (
							<p key={i}>{value}</p>
						))}
					</div>
				</main>
			</div>
		</>
	);
}
