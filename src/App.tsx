import './App.css'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import 'altcha';


function App() {

  return (
    <>
      <div className='flex gap-4 h-screen justify-between'>
        <div className='flex flex-col items-center justify-center w-full'>
          <div className="card shadow">
            <Input placeholder='Username' />

            <Button variant="default">Login</Button>
          </div>
        </div>
        <div className='flex flex-col items-center w-full justify-center'>
          <span>LAYOUT 2</span>
        </div>
      </div>
    </>
  )
}

export default App
