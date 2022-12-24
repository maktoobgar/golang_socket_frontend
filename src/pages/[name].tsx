// =============== Libraries =============== //
import { useReducer, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import Head from "next/head";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import RefreshIcon from "@mui/icons-material/Refresh";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import Backdrop from "@mui/material/Backdrop";
import * as WebSocket from "websocket";
import router from "next/router";
import orderBy from "lodash/orderBy";

// =============== Components =============== //
import ChatMessage from "@/components/ChatMessage";

// =============== Utils =============== //
import axios from "@/utils/axios";

// =============== Types =============== //
import RoomType from "@/types/room";
import Dialog from "@mui/material/Dialog";
import {
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from "@mui/material";

interface Action {
	method: "add" | "clear";
	message: string;
}

const chatReducer = (prev: string[], action: Action): string[] => {
	if (action.method === "add") {
		return [...prev, action.message.trim()];
	} else if (action.method === "clear") {
		return [];
	}
	return prev;
};

let socket: WebSocket.w3cwebsocket | null = null;

export default function Chat() {
	const { name } =
		typeof window !== "undefined" ? router.query : { name: "dumb" };
	const [onOffSideMenu, setOnOffSideMenu] = useState(true);
	const [activeRoom, setActiveRoom] = useState("");
	const [showAddRoom, setShowAddRoom] = useState(false);
	const [chat, dispatchChat] = useReducer(chatReducer, []);
	const textRef = useRef<HTMLInputElement | null>(null);
	const { data, refetch } = useQuery(
		"/rooms",
		() =>
			axios.get<RoomType[]>("/rooms").then((results) => {
				return orderBy(
					results.data as RoomType[],
					(value) => value.connection_length
				).reverse();
			}),
		{
			refetchOnWindowFocus: false,
			retry: false,
		}
	);
	const { mutateAsync } = useMutation((name: string) =>
		axios.post("/rooms", { name: name }).then(() => refetch())
	);

	const connect = (room: string) => {
		if (room !== "") {
			socket = new WebSocket.w3cwebsocket(
				`ws://localhost:5000/rooms/${room}/name/${name}/ws`
			);
			socket.onopen = function () {
				socket!.onmessage = (msg: WebSocket.IMessageEvent) => {
					dispatchChat({
						method: "add",
						message: msg.data as string,
					});
				};
			};
			setActiveRoom(room);
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
		refetch();
		if (window.innerWidth < 768) {
			setOnOffSideMenu(false);
		}
	};

	const send = () => {
		if (
			textRef !== null &&
			socket !== null &&
			textRef.current &&
			textRef.current.value !== ""
		) {
			socket.send(textRef.current.value);
			textRef.current.value = "";
		}
	};

	return (
		<>
			<Head>
				<title>Public Chat</title>
			</Head>
			<Dialog open={showAddRoom} onClose={() => setShowAddRoom(false)}>
				<DialogTitle>Add Room</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Please enter a name for your Room.
					</DialogContentText>
					<TextField
						autoFocus
						margin="dense"
						inputRef={textRef}
						label="Name"
						type="text"
						fullWidth
						variant="standard"
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setShowAddRoom(false)}>Cancel</Button>
					<Button
						onClick={() =>
							mutateAsync(textRef.current!.value).then(() =>
								setShowAddRoom(false)
							)
						}
					>
						Add
					</Button>
				</DialogActions>
			</Dialog>
			<div className="h-screen">
				<main className="flex h-full">
					{/* Sidemenu */}
					<div
						className={`min-w-[300px] h-full relative mdMax:fixed z-10 bg-white transition-all left-0 ${
							!onOffSideMenu && "!-left-[300px]"
						} ${!onOffSideMenu && window.innerWidth > 768 && "!fixed"}`}
					>
						<Button
							className="rounded-full h-16 ml-2 mt-2 mb-2"
							onClick={() => setOnOffSideMenu((prev) => !prev)}
						>
							<MenuIcon />
						</Button>
						<List>
							{data?.map((value) => (
								<ListItem disablePadding key={value.id}>
									<ListItemButton
										selected={activeRoom === value.name}
										onClick={() => {
											if (activeRoom !== value.name) reconnect(value.name);
											if (socket === null) reconnect(value.name);
										}}
									>
										<ListItemText
											primary={value.name + " - " + value.connection_length}
										/>
									</ListItemButton>
								</ListItem>
							))}
							{data?.length === 0 && (
								<div className="p-2 text-center">No Rooms Available</div>
							)}
						</List>
						<Button
							className="absolute bottom-2 left-2 rounded-full bg-slate-300"
							onClick={() => refetch()}
						>
							<RefreshIcon />
						</Button>
						<Button
							className="absolute bottom-2 right-2 rounded-full bg-slate-300"
							onClick={() => setShowAddRoom(true)}
						>
							<AddIcon />
						</Button>
					</div>
					{/* Chat */}
					<div className="w-full bg-gray-200">
						<div className="h-full flex flex-col">
							<Button
								className="rounded-full h-16 fixed left-2 top-2"
								onClick={() => setOnOffSideMenu((prev) => !prev)}
							>
								<MenuIcon />
							</Button>
							<div className="overflow-y-scroll w-full flex flex-col items-baseline flex-grow p-2">
								{chat.length !== 0 &&
									chat.map((value, i) => {
										const splits = value.split(":", 2);
										if (splits[0] === name) {
											return (
												<div className="w-full flex flex-col items-end" key={i}>
													<ChatMessage
														className="bg-blue-500"
														from={splits[0]}
														message={splits[1]}
													/>
												</div>
											);
										}
										return (
											<ChatMessage
												className="bg-red-500"
												from={splits[0]}
												message={splits[1]}
												key={i}
											/>
										);
									})}
							</div>
							{activeRoom && socket !== null && (
								<form
									className="flex p-5 w-full bg-gray-300 space-x-2"
									onSubmit={(e) => {
										e.preventDefault();
										send();
									}}
								>
									<TextField
										label="Text"
										variant="outlined"
										inputRef={textRef}
										className="w-full"
									/>
									<Button variant="contained" type="submit">
										Send
									</Button>
								</form>
							)}
						</div>
					</div>
				</main>
			</div>
		</>
	);
}
