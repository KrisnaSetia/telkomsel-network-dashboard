import Head from "next/head";
import Navbar from "@/components/Navbar";
const HomePage = () => {
    return (
        <>
        <Head>
        <title>Telkomsel Dashboard</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/telkomsel.svg" />
      </Head>
        <Navbar/>
        </>
    );
};
export default HomePage;