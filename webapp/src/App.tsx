import './App.css'
import { Shelf } from "./components/Shelf";
import kallaxOneByFour from '../../test-data/shelf1x4.json';
import kallaxTwoByFour from '../../test-data/shelf2x4.json';

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
        <h1>APP</h1>
        <Shelf config={ kallaxOneByFour }/>
        <Shelf config={ kallaxTwoByFour }/>
        <Shelf config={ kallaxTwoByFour }/>
    </>
  )
}

export default App
