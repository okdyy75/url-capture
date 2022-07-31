import Head from 'next/head'

const Layout = ({ children }: any) => {
    return (
        <>
            <Head>
                <title>タイトル</title>
                <meta name="description" content="ディスクリプション" />
            </Head>
            <main>{children}</main>
        </>
    )
}

export default Layout
