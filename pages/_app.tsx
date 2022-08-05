import '../styles/style.css'
import type { AppProps } from 'next/app'
import { createTheme, responsiveFontSizes, ThemeProvider } from '@mui/material'
import { GoogleAnalytics, usePageView } from '../lib/gtag'

const theme = responsiveFontSizes(
    createTheme({
        typography: {
            h1: { fontSize: 36 },
            h2: { fontSize: 30 },
            h3: { fontSize: 24 },
            h4: { fontSize: 20 },
            h5: { fontSize: 16 },
            h6: { fontSize: 12 },
        },
    })
)

function MyApp({ Component, pageProps }: AppProps) {
    usePageView()
    return (
        <>
            <ThemeProvider theme={theme}>
                <GoogleAnalytics />
                <Component {...pageProps} />
            </ThemeProvider>
        </>
    )
}

export default MyApp
