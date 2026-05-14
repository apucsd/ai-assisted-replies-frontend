import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { ThemeProvider } from './context/ThemeContext.tsx'
import './index.css'
import App from './App.tsx'
import Home from './pages/Home.tsx'
import About from './pages/About.tsx'
import Login from './pages/Login.tsx'
import AuthSuccess from './pages/AuthSuccess.tsx'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/auth-success',
    element: <AuthSuccess />,
  },
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/about',
        element: <About />,
      },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
