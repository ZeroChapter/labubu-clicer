import React from 'react'
import './App.css'
import styled from "styled-components";
import { ClickProvider } from './store/Context';
import { GameScrean } from './views/GameScrean'
import { ShopMenu } from './views/ShopMenu'
import { useSound } from './hooks/useSound';
import { useState, useEffect } from 'react';

function App() {
  const backgroundSound = useSound('sounds/music.mp3', 0.3, true, true);
  const [musicStarted, setMusicStarted] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);

  // Проверяем инициализацию Яндекс SDK
  useEffect(() => {
    // Если SDK уже инициализирован в index.html
    if (window.ysdk) {
      console.log('Yandex SDK ready');
      setSdkReady(true);
      return;
    }

    // Ждем инициализации
    const checkSDK = setInterval(() => {
      if (window.ysdk) {
        console.log('Yandex SDK detected');
        setSdkReady(true);
        clearInterval(checkSDK);
      }
    }, 100);

    // Таймаут на случай если в не-яндекс среде
    const timeout = setTimeout(() => {
      clearInterval(checkSDK);
      console.log('Running outside Yandex Games');
      setSdkReady(true);
    }, 2000);

    return () => {
      clearInterval(checkSDK);
      clearTimeout(timeout);
    };
  }, []);

  // Обработчик первого клика для музыки
  useEffect(() => {
    const handleFirstClick = () => {
      if (!musicStarted && sdkReady) {
        backgroundSound.play();
        setMusicStarted(true);
        document.removeEventListener('click', handleFirstClick);
      }
    };

    if (sdkReady) {
      document.addEventListener('click', handleFirstClick);
    }

    return () => {
      document.removeEventListener('click', handleFirstClick);
    };
  }, [musicStarted, backgroundSound, sdkReady]);

  if (!sdkReady) {
    return (
      <LoadingScreen>
        <div>Загрузка...</div>
      </LoadingScreen>
    );
  }

  return (
    <Maindiv>
      <ClickProvider>
        <GameScrean />
        <ShopMenu />

        {!musicStarted && (
          <StartHint>
            Кликните чтобы начать игру
          </StartHint>
        )}
      </ClickProvider>
    </Maindiv>
  )
}

const Maindiv = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  margin: 0;
  padding: 0;
  position: relative;
`;

const StartHint = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 5rem;
  border-radius: 10px;
  z-index: 1000;
  font-size: 2rem;
`;

const LoadingScreen = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 2rem;
  background: #000;
  color: white;
`;

export default App