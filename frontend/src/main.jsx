import ReactDOM from 'react-dom/client'
import { StrictMode } from 'react'
import {BrowserRouter} from 'react-router-dom'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'

import App from './App'
import './index.css'

const queryClient = new QueryClient({

})

ReactDOM.createRoot(document.getElementById('root')).render(
   <StrictMode>
    <BrowserRouter>
        <QueryClientProvider client={queryClient}>
             <App />
        </QueryClientProvider>
    </BrowserRouter>
   </StrictMode>
)