// =============== Libraries =============== //
import { useEffect, useState } from "react";
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

export default function Home() {
	const [activeGroup, setActiveGroup] = useState("");
	const { data } = useQuery("/rooms", () =>
		axios.get<Room[]>("/rooms").then((results) => results.data)
	);

	useEffect(() => {
		console.log("in it");
		const socket = new WebSocket.w3cwebsocket("ws://localhost:8080/ws");
		socket.onopen = function () {
			socket.send("helloheee!");
			socket.onmessage = (msg: any) => {
				console.log(msg);
				console.log("we got msg..");
			};
		};
	}, []);

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
								<ListItem disablePadding>
									<ListItemButton
										selected={activeGroup === value.name}
										onClick={() => setActiveGroup(value.name)}
									>
										<ListItemText primary={value.name} />
									</ListItemButton>
								</ListItem>
							))}
						</List>
					</div>
				</main>
			</div>
		</>
	);
}
