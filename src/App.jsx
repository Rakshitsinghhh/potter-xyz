import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './App.css'
import { Uservalidation } from './components/uservalidation'

const queryClient=new QueryClient();

function App() {

  return (
    <>
    <QueryClientProvider client={queryClient}>
      <Uservalidation/>
    </QueryClientProvider>
    </>
  )
}

export default App
