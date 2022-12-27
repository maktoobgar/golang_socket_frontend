// =============== Libraries =============== //
import axios from "axios";

// =============== Types =============== //
import ServerName from "@/types/server_name";

export default axios.create({
	baseURL: ServerName,
	timeout: 10000,
});
