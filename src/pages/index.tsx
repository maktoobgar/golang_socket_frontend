// =============== Libraries =============== //
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useRef } from "react";
import Router from "next/router";

const Index = () => {
	const roomNameRef = useRef<HTMLInputElement>();
	return (
		<form
			className="h-screen w-screen flex flex-col justify-center items-center space-y-5"
			onSubmit={(e) => {
				e.preventDefault();
				if (roomNameRef.current?.value !== "") {
					Router.push(`/${roomNameRef.current!.value}`);
				}
			}}
		>
			<p>Enter your name and enjoy in public rooms:</p>
			<TextField
				autoFocus
				label="Your Name"
				type="text"
				variant="outlined"
				inputRef={roomNameRef}
			></TextField>
			<Button variant="contained" type="submit">
				Enter
			</Button>
		</form>
	);
};

export default Index;
