// =============== Libraries =============== //
import axios from "axios";

export default axios.create({
	baseURL: process.env.NEXT_PUBLIC_BACKEND
		? process.env.NEXT_PUBLIC_BACKEND
		: "http://127.0.0.1:5000",
	timeout: 10000,
});
