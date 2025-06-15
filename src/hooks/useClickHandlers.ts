import { useRef } from "react";

type ClickCallbacks = {
	onClick?: () => void;
	onDoubleClick?: () => void;
	onLongPress?: () => void;
};

interface ClickHandlerEvents {
		onMouseDown: (e: React.MouseEvent) => void;
		onMouseUp: (e: React.MouseEvent) => void;
		onTouchStart: (e: React.TouchEvent) => void;
		onTouchEnd: (e: React.TouchEvent) => void;
	}

export function useClickHandlers({ onClick, onDoubleClick, onLongPress }: ClickCallbacks) {
	const clickTimeout = useRef<NodeJS.Timeout | null>(null);
	const longPressTimeout = useRef<NodeJS.Timeout | null>(null);

	function handleClick() {
		if (clickTimeout.current) {
			clearTimeout(clickTimeout.current);
			clickTimeout.current = null;
			onDoubleClick?.();
		} else {
			clickTimeout.current = setTimeout(() => {
				onClick?.();
				clickTimeout.current = null;
			}, 250);
		}
	}

	function onPressStart(event: React.MouseEvent | React.TouchEvent) {
		event.stopPropagation();
		longPressTimeout.current = setTimeout(() => {
			onLongPress?.();
			longPressTimeout.current = null;
		}, 500);
	}

	function onPressEnd(event: React.MouseEvent | React.TouchEvent) {
		event.stopPropagation();
		if (longPressTimeout.current) {
			clearTimeout(longPressTimeout.current);
			handleClick();
		}
	}

	
	return {
		onMouseDown: (e: React.MouseEvent) => onPressStart(e),
		onMouseUp: (e: React.MouseEvent) => onPressEnd(e),
		onTouchStart: (e: React.TouchEvent) => onPressStart(e),
		onTouchEnd: (e: React.TouchEvent) => onPressEnd(e),
	} as ClickHandlerEvents;
}
