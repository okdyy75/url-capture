import Head from "next/head";

const Layout = ({ children }: any) => {
    return (
        <>
            <Head>
                <title>タイトル</title>
                <meta name="description" content="ディスクリプション" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>{children}</main>
        </>
    );
};

export default Layout;
