import React from "react";
import styled from "styled-components";
import { useClick } from "../store/Context";
import { useSound } from "../hooks/useSound";

export function LabubuLevelProgress() {
    const { points, labubuLevel, upLevel, getLabubuCost, awayPoints } = useClick();

    const currentLevelCost = getLabubuCost();
    const progress = Math.min((points / currentLevelCost) * 100, 100);
    const canUpgrade = points >= currentLevelCost;
    const hoverSound = useSound('sounds/hover.mp3');
    const activeSound = useSound('sounds/active.mp3');
    const lvlupSound = useSound('sounds/lvlup.mp3');

    const showAd = async () => {
        if (window.ysdk && window.ysdk.adv) {
            try {
                console.log('Showing fullscreen ad');

                // Сообщаем SDK о начале показа рекламы
                if (window.ysdk.gameReady) {
                    window.ysdk.gameReady();
                }

                await window.ysdk.adv.showFullscreenAdv();
                console.log('Ad completed successfully');

                // Сообщаем SDK о завершении показа рекламы
                if (window.ysdk.gameReady) {
                    window.ysdk.gameReady();
                }
            } catch (error) {
                console.error('Ad failed:', error);
                // Все равно сообщаем о готовности даже при ошибке
                if (window.ysdk.gameReady) {
                    window.ysdk.gameReady();
                }
            }
        } else {
            console.log('Yandex SDK not available, skipping ad');
        }
    };

    const handleUpgrade = async () => {
        if (canUpgrade) {
            // Сообщаем SDK о начале важного игрового события
            if (window.ysdk && window.ysdk.gameReady) {
                window.ysdk.gameReady();
            }

            activeSound.play();

            // Показываем рекламу каждый 3 уровень
            if (labubuLevel > 0 && labubuLevel % 3 === 0) {
                await showAd();
            }

            lvlupSound.play();
            awayPoints(currentLevelCost);
            upLevel();

            // Сообщаем SDK о завершении игрового события
            if (window.ysdk && window.ysdk.gameReady) {
                window.ysdk.gameReady();
            }
        }
    };

    return (
        <LabubuLevelBar>
            <LevelInfo>
                <LevelText>Lvl {labubuLevel}</LevelText>
            </LevelInfo>

            <ProgressContainer>
                <ExpBar progress={progress} />
                <CostText>
                    {points}/{currentLevelCost}
                </CostText>
            </ProgressContainer>

            <UpgradeButton
                onClick={handleUpgrade}
                disabled={!canUpgrade}
                $canUpgrade={canUpgrade}
                onMouseEnter={() => { hoverSound.play() }}
            >
                УЛУЧШИТЬ <br />ЛАБУБУ
                {labubuLevel > 0 && labubuLevel % 3 === 0 && canUpgrade && (
                    <AdBadge>+ реклама</AdBadge>
                )}
            </UpgradeButton>
        </LabubuLevelBar>
    );
}

// ... остальной код стилей без изменений ...
const AdBadge = styled.div`
    position: absolute;
    top: -5px;
    right: -5px;
    background: #FFD700;
    color: #000;
    font-size: 0.7rem;
    padding: 2px 6px;
    border-radius: 10px;
    font-weight: bold;
`;

const LabubuLevelBar = styled.div`
    border-radius: 15px;
    padding: 15px;
    height: 80px;
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    display: flex;
    align-items: center;
    gap: 15px;
    border: 2px solid #F2C150;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
`;

const LevelInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 80px;
`;

const LevelText = styled.div`
    color: #F250D7;
    font-weight: bold;
    font-size: 2rem;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
`;

const CostText = styled.div`
    color:  #8a0399;
    font-size: 1.5rem;
    position: absolute;
    left: 10%;
    z-index: 100;
    top: 0%;
    margin-top: 5px;
`;

const ProgressContainer = styled.div`
    flex: 1;
    height: 40px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    overflow: hidden;
    border: 2px solid #F2C150;
    position: relative;
`;

const ExpBar = styled.div`
    background: linear-gradient(90deg, #F250D7, #FF6BCB);
    height: 100%;
    width: ${props => props.progress}%;
    border-radius: 12px;
    transition: width 0.3s ease;
    position: relative;
    overflow: hidden;

    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(255, 255, 255, 0.3) 50%, 
            transparent 100%);
        animation: shine 2s infinite;
    }

    @keyframes shine {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
    }
`;

const UpgradeButton = styled.button`
    padding: 1rem 2rem;
    border-radius: 15px;
    background: ${props => props.$canUpgrade
        ? 'linear-gradient(45deg, #F250D7, #FF6BCB)'
        : 'linear-gradient(45deg, #666, #999)'};
    border: 2px solid #F2C150;
    color: white;
    font-size: 1rem;
    font-weight: bold;
    cursor: ${props => props.$canUpgrade ? 'pointer' : 'not-allowed'};
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    position: relative;

    &:hover {
        transform: ${props => props.$canUpgrade ? 'scale(1.1)' : 'scale(1)'};
        box-shadow: ${props => props.$canUpgrade
        ? '0 6px 20px rgba(242, 80, 215, 0.6)'
        : '0 4px 10px rgba(0, 0, 0, 0.3)'};
    }

    &:active {
        transform: ${props => props.$canUpgrade ? 'scale(0.95)' : 'scale(1)'};
    }
`;