import { useSound } from './useSound';

export function useGameSounds() {
    const backgroundMusic = useSound('/sounds/background.mp3', 0.3);
    const hoverSound = useSound('/sounds/hover.mp3', 0.5);
    const clickSound = useSound('/sounds/click.mp3', 0.7);

    return {
        backgroundMusic,
        hoverSound,
        clickSound
    };
}