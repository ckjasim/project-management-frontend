
import './App.css'
import UserLogin from './pages/UserLogin/UserLogin'
import { Route, Routes } from 'react-router-dom'

function App() {
 

  return (
   <div>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/login" element={<UserLogin />} />
        {/* <Route path="/player/:id" element={<Player />} /> */}
      </Routes>
   </div>
  )
}

export default App
