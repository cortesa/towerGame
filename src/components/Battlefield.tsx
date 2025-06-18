import styled from "styled-components";

import { Barrack as BarrackClass } from "../game/barrack";
import { Barrack } from "./Barrack";
import { Tower as TowerClass } from "../game/tower";
import { Tower } from "./Tower";

import { useBattlefield } from "../hooks/useBattlefield";
import { useGame } from "../hooks/useGame";
import { useClickHandlers } from "../hooks/useClickHandlers";

import { Troop } from "./Troop";
import { Flex } from "../styles";
import type { BuildingMap } from "../game/types";

type AnyBuildingInstance = BuildingMap[keyof BuildingMap];

export function Battlefield() {
  const { resetSelection } = useGame();
  const { buildings, troops } = useBattlefield();


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
      {buildings.map((b: AnyBuildingInstance) => {
        switch (b.buildingType) {
          case "barrack":
            return <Barrack key={b.id} barrackInstance={b as BarrackClass}/>
          case "tower":
            return  <Tower key={b.id} towerInstance={b as TowerClass}/>
          default:
            break;
        }
      })}

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
  overflow: hidden;
`;