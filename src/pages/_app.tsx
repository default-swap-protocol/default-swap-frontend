import { useEffect } from 'react'
import type { AppProps } from 'next/app'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { MoralisProvider } from 'react-moralis'
import { AccountProvider } from '@contexts/AccountContext'
import { CssBaseline } from '@material-ui/core'

import theme from '@utils/theme'

import dynamic from 'next/dynamic'
const NavBar = dynamic(
  () => import('@components/NavBar'),
  { ssr: false }
)

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
}, []);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {/* <AuthProvider> */}
      <MoralisProvider appId={process.env.MORALIS_APP_ID} serverUrl={process.env.MORALIS_SERVER_URL}>
        <AccountProvider>
          <style jsx global>
            {`
              body {
               
                height: 100vh;
                transition: all 0.25s linear 0s;
              }
            `}
          </style>
          <NavBar />
          <Component {...pageProps} />
        </AccountProvider>
      </MoralisProvider>
      {/* </AuthProvider> */}
    </MuiThemeProvider>
  )
}
export default MyApp
