import { useState } from 'react'
import Signup from './components/Signup.jsx'
import Login from './components/Login.jsx'
import Home from './components/Home.jsx'
import Expensespage from './components/Expensespage.jsx'
import BudgetPage from './components/BudgetPage.jsx'
import{BrowserRouter,Routes,Route} from 'react-router-dom'

function App() {
  

  return (
    
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Signup />}></Route>
      <Route path='/login' element={<Login />}></Route>
      <Route path='/home' element={<Home />}></Route>
      <Route path='/expenses' element={<Expensespage />}></Route>
      <Route path='/budget' element={<BudgetPage />}></Route>


    </Routes>
    </BrowserRouter>

     
    
  )
}

export default App
