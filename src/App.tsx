import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Qr } from './components/qr'

function App() {
  const [count, setCount] = useState(0)
  const [size, setSize] = useState(100)
  const [thickness, setThickness] = useState(true)
  const [svg, setSvg] = useState(true)
  const [bgColor, setBgColor] = useState('#ffffff')
  const [fgColor, setFgColor] = useState('#000000')

  return (
    <>
      <input type='checkbox' checked={thickness} onChange={(e) => {
        setThickness(e.target.checked)
      }} />
      <input type='checkbox' checked={svg} onChange={(e) => {
        setSvg(e.target.checked)
      }} />
      <input type="color" value={bgColor} onChange={(e) => {
        setBgColor(e.target.value)
      }} />
      <input type="color" value={fgColor} onChange={(e) => {
        setFgColor(e.target.value)
      }} />
      <input type="range" min={0} max={500} value={size} onChange={(e) => {
        setSize(+e.target.value)
      }} />
      <div>
        <br />
        <Qr content={count.toString()} thickness={thickness} fgColor={fgColor} bgColor={bgColor} size={size} svg={svg} />
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
