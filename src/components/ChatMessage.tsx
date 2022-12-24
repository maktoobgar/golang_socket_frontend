interface ChatMessageProps {
	message: string;
	from: string;
	className?: string;
}

const ChatMessage = (props: ChatMessageProps) => {
	return (
		<div
			className={`text-white p-4 rounded-2xl space-y-2 my-1 ${props.className}`}
		>
			<p className="text-sm">{props.from}</p>
			<h4>{props.message}</h4>
		</div>
	);
};

export default ChatMessage;
