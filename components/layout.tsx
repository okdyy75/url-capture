import Head from 'next/head'
import { Container, Box, Typography, Link } from '@mui/material'

const Layout = ({ children }: any) => {
    const title = 'ゆーキャプ'
    const description = '複数のURLからまとめてキャプチャ取得ツール'
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
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
