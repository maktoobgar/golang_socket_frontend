// =============== Styles =============== //
import "@/styles/globals.css";

// =============== Libraries =============== //
import type { AppProps } from "next/app";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "react-query";

const client = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
				<meta
					name="description"
					content="A Frontend for golang_socket project."
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<QueryClientProvider client={client}>
				<Component {...pageProps} />
			</QueryClientProvider>
		</>
	);
}
