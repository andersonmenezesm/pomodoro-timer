// import { BrowserRouter } from 'react-router-dom'
// import { ThemeProvider } from 'styled-components'
// import { Router } from './Router'
// import { GlobalStyle } from './styles/global'
// import { defaultTheme } from './styles/themes/default'
import { Home } from './Home'

export function App() {
  return (
    <Home />
    // <ThemeProvider theme={defaultTheme}>
    //   <BrowserRouter>
    //     <Router />
    //   </BrowserRouter>
    //   <GlobalStyle />
    // </ThemeProvider>
  )
}
