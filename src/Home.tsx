import { createContext, useContext } from 'react'

const CyclesContext = createContext({
  activeCycle: 5,
})

// =========== fim do code context ================ //

export function Countdown() {
  const { activeCycle } = useContext(CyclesContext)

  return <h1>Countdown: {activeCycle}</h1>
}

export function NewCycleForm() {
  const { activeCycle } = useContext(CyclesContext)

  return <h1>NewCycleForm: {activeCycle}</h1>
}

export function Home() {
  return (
    <div>
      <NewCycleForm />
      <Countdown />
    </div>
  )
}
