import Head from 'next/head'
import { Container, Box, Typography, Link } from '@mui/material'
import { useRouter } from 'next/router'

const Layout = ({ children }: any) => {
    const { asPath } = useRouter()

    const title = 'ゆーキャプ'
    const description = '複数のURLからまとめてキャプチャ取得ツール'
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const ogImageUrl = baseUrl + '/images/og_image.jpg'
    const iconUrl = baseUrl + '/images/icon.jpg'
    const canonicalUrl = baseUrl + asPath

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description}></meta>
                <meta name="thumbnail" content={ogImageUrl}></meta>
                <meta property="og:locale" content="ja_JP"></meta>
                <meta property="og:title" content={title}></meta>
                <meta property="og:description" content={description}></meta>
                <meta property="og:image" content={ogImageUrl}></meta>
                <meta property="og:image:width" content="1200"></meta>
                <meta property="og:image:height" content="630"></meta>
                <meta property="og:url" content={canonicalUrl}></meta>
                <meta property="og:site_name" content={title}></meta>
                <meta name="twitter:title" content={title}></meta>
                <meta name="twitter:description" content={description}></meta>
                <meta name="twitter:image" content={ogImageUrl}></meta>
                <meta name="twitter:card" content="summary_large_image"></meta>
                <link rel="apple-touch-icon" href={iconUrl}></link>
                <link rel="apple-touch-icon" sizes="180x180" href={iconUrl}></link>
                <meta name="msapplication-TileImage" content={iconUrl}></meta>
                <link rel="canonical" href={canonicalUrl}></link>
            </Head>
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Box component="footer">
                    <Typography variant="h1">{title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                        {description}
                    </Typography>
                </Box>
                <Box
                    component="main"
                    sx={{
                        minHeight: '100vh',
                    }}
                >
                    {children}
                </Box>
                <Box component="footer" sx={{ mt: 4 }}>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ py: 2, textAlign: 'center', fontSize: 12 }}
                    >
                        © 2022{' '}
                        <Link
                            href="https://twitter.com/okdyy75"
                            color="inherit"
                            underline="none"
                            sx={{ ml: 1 }}
                        >
                            okdyy75
                        </Link>
                        <br />
                        Powered by
                        <Link
                            href="https://nextjs.org/"
                            color="inherit"
                            underline="none"
                            sx={{ ml: 1 }}
                        >
                            Next.js
                        </Link>
                        ,
                        <Link
                            href="https://mui.com/"
                            color="inherit"
                            underline="none"
                            sx={{ ml: 1 }}
                        >
                            MUI
                        </Link>
                        ,
                        <Link
                            href="https://vercel.com/"
                            color="inherit"
                            underline="none"
                            sx={{ ml: 1 }}
                        >
                            Vercel
                        </Link>
                    </Typography>
                </Box>
            </Container>
        </>
    )
}

export default Layout
