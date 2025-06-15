import './App.css'

import styled from 'styled-components';
import { Battlefield } from './components/Battlefield';
import { GameStatics } from './components/GameStatics';
import { useGameStart } from './hooks/useGameStart';
import { Flex } from './styles';

function App() {
  const isReady = useGameStart();

  console.log("ACZ isReady:", isReady)

  return (
    <GameContainer
    $column
    $gap={20}>
      {isReady && (
        <>
        <GameStatics/>
        <Battlefield/>
        </>
      )}
    </GameContainer>
  )
}

export default App

const GameContainer = styled(Flex)`
  position: fixed;
  inset: 20px;
`
