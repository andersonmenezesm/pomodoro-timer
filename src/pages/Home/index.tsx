import { zodResolver } from '@hookform/resolvers/zod'
import { HandPalm, Play } from 'phosphor-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as zod from 'zod'

import { differenceInSeconds } from 'date-fns'
import { Countdown } from './Countdown'
import { NewCycleForm } from './NewCycleForm'
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'

const newCycleFormValidatorSchema = zod.object({
  task: zod.string().min(1, 'Tarefa é obrigatória'),
  minutesAmmount: zod
    .number()
    .min(1, 'O ciclo precisa ser no mínimo de 1 minuto1')
    .max(60, 'O ciclo precisa ser no máximo de 60 minutos'),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidatorSchema>

interface CycleProps {
  id: string
  task: string
  minutesAmmount: number
  startDate: Date
  interruptedDate?: Date
  fineshedDate?: Date
}

export function Home() {
  const [cycles, setCycles] = useState<CycleProps[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [ammountSecondsPassed, setAmmountSecondsPassed] = useState(0)

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)
  const totalSeconds = activeCycle ? activeCycle.minutesAmmount * 60 : 0
  const currentSeconds = activeCycle ? totalSeconds - ammountSecondsPassed : 0

  const minutesAmmount = Math.floor(currentSeconds / 60)
  const secondsAmmount = currentSeconds % 60

  // função padStart inclui um caractere 0 em caso o número seja menor que 10
  const minutes = String(minutesAmmount).padStart(2, '0')
  const seconds = String(secondsAmmount).padStart(2, '0')

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidatorSchema),
    defaultValues: {
      task: '',
      minutesAmmount: 0,
    },
  })

  const task = watch('task')
  const isSubmitDisabled = !task

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

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`
    }
  }, [minutes, seconds, activeCycle])

  function handleCreateNewCycle(data: NewCycleFormData) {
    const id = String(new Date().getTime())

    const newCycle: CycleProps = {
      id,
      task: data.task,
      minutesAmmount: data.minutesAmmount,
      startDate: new Date(),
    }

    setCycles((state) => [...state, newCycle])
    setActiveCycleId(id)
    setAmmountSecondsPassed(0)

    reset()
  }

  function handleStopCountdown() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
    setActiveCycleId(null)
  }

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <NewCycleForm />
        <Countdown />

        {activeCycle ? (
          <StopCountdownButton onClick={handleStopCountdown} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
