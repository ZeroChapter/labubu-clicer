import { useRef, useCallback, useEffect } from 'react';

export function useSound(soundPath, volume = 1.0, loop = false, isBackgroundMusic = false) {
    const audioInstancesRef = useRef([]);
    const wasPlayingRef = useRef(false);
    const isBackgroundMusicRef = useRef(isBackgroundMusic);

    // Обновляем флаг фоновой музыки
    useEffect(() => {
        isBackgroundMusicRef.current = isBackgroundMusic;
    }, [isBackgroundMusic]);

    // Очистка завершенных аудио
    useEffect(() => {
        const interval = setInterval(() => {
            audioInstancesRef.current = audioInstancesRef.current.filter(audio => {
                // Для фоновой музыки не удаляем даже если она завершилась
                if (isBackgroundMusicRef.current) {
                    return true;
                }
                // Для обычных звуков удаляем завершенные
                if (audio.ended && audio.currentTime >= audio.duration - 0.1) {
                    audio.remove();
                    return false;
                }
                return true;
            });
        }, 1000);

        return () => {
            clearInterval(interval);
            // Очистка всех аудио при размонтировании
            audioInstancesRef.current.forEach(audio => {
                audio.pause();
                audio.remove();
            });
            audioInstancesRef.current = [];
        };
    }, []);

    // Обработчик видимости страницы
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                // Страница скрыта - запоминаем состояние и ставим на паузу
                wasPlayingRef.current = audioInstancesRef.current.some(audio => !audio.paused);
                audioInstancesRef.current.forEach(audio => {
                    audio.pause();
                });
            } else {
                // Страница снова видна - восстанавливаем если нужно
                if (wasPlayingRef.current && isBackgroundMusicRef.current) {
                    // Для фоновой музыки восстанавливаем воспроизведение
                    audioInstancesRef.current.forEach(audio => {
                        if (audio.paused) {
                            audio.play().catch(error => {
                                console.log('Audio resume failed:', error);
                            });
                        }
                    });
                    wasPlayingRef.current = false;
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    const play = useCallback(() => {
        if (document.hidden && !isBackgroundMusicRef.current) return;

        try {
            // Для фоновой музыки используем только один экземпляр
            if (isBackgroundMusicRef.current && audioInstancesRef.current.length > 0) {
                const audio = audioInstancesRef.current[0];
                if (!audio.paused) return; // Уже играет

                audio.currentTime = 0;
                audio.play().catch(error => {
                    console.log('Background music play failed:', error);
                });
                return;
            }

            // Создаем новый экземпляр для каждого воспроизведения
            const audio = new Audio(soundPath);
            audio.volume = volume;
            audio.loop = loop;
            audio.preload = 'auto';

            // Для фоновой музыки не добавляем обработчик окончания
            if (!isBackgroundMusicRef.current) {
                audio.addEventListener('ended', () => {
                    setTimeout(() => {
                        const index = audioInstancesRef.current.indexOf(audio);
                        if (index > -1) {
                            audioInstancesRef.current.splice(index, 1);
                        }
                        audio.remove();
                    }, 100);
                });
            }

            audioInstancesRef.current.push(audio);

            // Для фоновой музыки ограничиваем одним экземпляром
            if (isBackgroundMusicRef.current) {
                audioInstancesRef.current = [audio];
            } else if (audioInstancesRef.current.length > 10) {
                // Для обычных звуков ограничиваем пул
                const oldAudio = audioInstancesRef.current.shift();
                if (oldAudio) {
                    oldAudio.pause();
                    oldAudio.remove();
                }
            }

            const playPromise = audio.play();

            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log('Audio play failed:', error);
                    if (!isBackgroundMusicRef.current) {
                        const index = audioInstancesRef.current.indexOf(audio);
                        if (index > -1) {
                            audioInstancesRef.current.splice(index, 1);
                        }
                        audio.remove();
                    }
                });
            }
        } catch (error) {
            console.log('Audio creation failed:', error);
        }
    }, [soundPath, volume, loop]);

    const stop = useCallback(() => {
        audioInstancesRef.current.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
        if (isBackgroundMusicRef.current) {
            wasPlayingRef.current = false;
        }
    }, []);

    const pause = useCallback(() => {
        audioInstancesRef.current.forEach(audio => {
            audio.pause();
        });
        if (isBackgroundMusicRef.current) {
            wasPlayingRef.current = true;
        }
    }, []);

    const restart = useCallback(() => {
        stop();
        play();
    }, [stop, play]);

    return { play, stop, pause, restart };
}