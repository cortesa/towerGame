import styled from "styled-components";
import { Barrack as BarrackClass } from "../game/barrack";
import { Barrack } from "./Barrack";
import { useBattlefield } from "../hooks/useBattlefield";
import { useGame } from "../hooks/useGame";
import { useClickHandlers } from "../hooks/useClickHandlers";
import { Troop } from "./Troop";
import { Flex } from "../styles";


export function Battlefield() {
  const { resetSelection } = useGame();
  const { barracks, troops } = useBattlefield();


    const { onMouseDown, onMouseUp, onTouchStart, onTouchEnd } = useClickHandlers({
      onClick: () => {
        resetSelection()
      },
      onDoubleClick: () => console.log("double click"),
      onLongPress: () => console.log("long press"),
    });

  return (
		<BattlefieldContainer
      $grow={1}
      onMouseDown={onMouseDown}
			onMouseUp={onMouseUp}
			onTouchStart={onTouchStart}
			onTouchEnd={onTouchEnd}>
      {barracks.map((b: BarrackClass) => (
        <Barrack key={b.id} barrackInstance={b}/>
      ))}
      {troops.map((t) => (
        <Troop key={t.id} troopInstance={t} />
      ))}
		</BattlefieldContainer>
  );
}

const BattlefieldContainer = styled(Flex)`
position: relative;
  width: 100%;
  border: 1px solid red;
`;