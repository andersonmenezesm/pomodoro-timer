import { differenceInSeconds } from 'date-fns'
import { useEffect, useState } from 'react'
import { CountdownContainer, Separator } from './styles'

export function Countdown() {
  const [ammountSecondsPassed, setAmmountSecondsPassed] = useState(0)

  const totalSeconds = activeCycle ? activeCycle.minutesAmmount * 60 : 0

  useEffect(() => {
    let interval: number

    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate,
        )

        if (secondsDifference >= totalSeconds) {
          setCycles((state) =>
            state.map((cycle) => {
              if (cycle.id === activeCycleId) {
                return { ...cycle, fineshedDate: new Date() }
              } else {
                return cycle
              }
            }),
          )
          setAmmountSecondsPassed(totalSeconds)

          clearInterval(interval)
        } else {
          setAmmountSecondsPassed(secondsDifference)
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [activeCycle, totalSeconds, activeCycleId])

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator> : </Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  )
}
