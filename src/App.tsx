import Dashboard from './Components/Dashboard/Dashboard'
import Layout from './layout'
import { ConnectionProvider } from './connection-provider'

function App() {
  return (
    <>
      <ConnectionProvider>
        <Layout />
      </ConnectionProvider>
    </>
  )
}

export default App