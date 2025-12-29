import React, { useState, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useClick } from "../store/Context";
import { LabubuLevelProgress } from "./LabubuLevelProgress";
import { StarsPointer } from "./StarsPointer";
import { useSound } from "../hooks/useSound";

export function GameScrean() {
    const { points, addPoints, pointToClick, labubuLevel, labubuImage } = useClick();
    const [clickAnimations, setClickAnimations] = useState([]);
    const starsContainerRef = useRef();
    const clickSound = useSound('sounds/click.mp3', 0.5);


    const handleClick = (e) => {
        addPoints(pointToClick);
        clickSound.play();

        const newAnimation = {
            id: Date.now(),
            points: pointToClick,
            x: Math.random() * 100 - 50,
        };
        setClickAnimations(prev => [...prev, newAnimation]);


        createStars();

        setTimeout(() => {
            setClickAnimations(prev => prev.filter(anim => anim.id !== newAnimation.id));
        }, 1000);
    };

    const createStars = () => {
        if (!starsContainerRef.current) return;

        const starCount = 10;

        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            const size = 35 + Math.random() * 8;
            const angle = Math.random() * Math.PI * 2;
            const distance = 240 + Math.random() * 300;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            const duration = 1500 + Math.random() * 500;
            const delay = Math.random() * 300;

            star.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: ${size}px;
            height: ${size}px;
            pointer-events: none;
            z-index: -1;
            border-radius: 50%;
            background: radial-gradient(circle, #FFD700, #FF6BCB);
            box-shadow: 
                0 0 15px #FFD700,
                0 0 30px #FF6BCB,
                0 0 45px #FF1493;
            opacity: 0;
        `;
            starsContainerRef.current.appendChild(star);


            const animation = star.animate([
                {
                    transform: 'translate(0, 0) scale(0) rotate(0deg)',
                    opacity: 1
                },
                {
                    transform: `translate(${x}px, ${y}px) scale(1) rotate(360deg)`,
                    opacity: 0
                }
            ], {
                duration: duration,
                delay: delay,
                easing: 'ease-out',
                fill: 'forwards'
            });

            animation.onfinish = () => {
                if (star.parentNode) {
                    star.parentNode.removeChild(star);
                }
            };
        }
    };

    return (
        <Screen>

            <StarsPointer />


            <Labubu onClick={handleClick} level={labubuLevel}>
                <LabubuImage src={labubuImage} alt="Labubu" key={labubuLevel} />

                {clickAnimations.map(animation => (
                    <ClickAnimation key={animation.id} x={animation.x}>
                        +{animation.points}
                    </ClickAnimation>
                ))}


                <div ref={starsContainerRef} style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none'
                }} />
            </Labubu>

            <LabubuLevelBar>
                <LabubuLevelProgress />
            </LabubuLevelBar>
        </Screen>
    )
}



const floatUp = keyframes`
    0% {
        transform: translateX(var(--x)) translateY(0);
        opacity: 1;
    }
    100% {
        transform: translateX(var(--x)) translateY(-100px);
        opacity: 0;
    }
`;

const LabubuLevelBar = styled.div`
 position: absolute;
 bottom: 20px;
 width: 100%;
`


const ClickAnimation = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    color: #F250D7;
    font-size: 2rem;
    font-weight: bold;
    text-shadow: 
        2px 2px 0 #000,
        -1px -1px 0 #000,
        1px -1px 0 #000,
        -1px 1px 0 #000;
    animation: ${floatUp} 1s ease-out forwards;
    pointer-events: none;
    z-index: 100;
    --x: ${props => props.x}px;
`;

const Screen = styled.div`
    width: 70%;
    height: 100%;
    background: linear-gradient(135deg, #F2C150, #E6B143);
    background-image: url(forest.jpg);
    background-size: cover;
    padding: 0px;
    position: relative;
    overflow: hidden;
`;

const Labubu = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    animation: float 3s ease-in-out infinite;
    
    width: 40vw;
    height: 40vw;

    @keyframes float {
        0%, 100% {
            transform: translate(-50%, -50%) translateY(0px) rotate(0deg);
        }
        50% {
            transform: translate(-50%, -50%) translateY(-20px) rotate(3deg);
        }
    }

    

    &:hover {
        filter: drop-shadow(0 0 30px rgba(242, 80, 215, 0.5));
    }
    
`;

const LabubuImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 30px;
    user-select: none;
    -webkit-user-drag: none;
    z-index: 2;
    
    animation: neonAppear 1s ease-out forwards;

    @keyframes neonAppear {
        0% {
            opacity: 0;
            transform: scale(0.5);
            filter: drop-shadow(0 0 0px rgba(242, 80, 215, 0)) brightness(10);
        }
        50% {
            opacity: 1;
            transform: scale(1.1);
            filter: drop-shadow(0 0 50px rgba(242, 80, 215, 1)) brightness(2);
        }
        100% {
            opacity: 1;
            transform: scale(1);
            filter: drop-shadow(0 0 20px rgba(242, 80, 215, 0.7)) brightness(1);
        }
    }

    &:active {
         transform: scale(0.95) !important;
        transition: transform 0.1s ease;
    }
`;


const starExplode = keyframes`
    0% {
        transform: translate(0, 0) scale(0) rotate(0deg);
        opacity: 1;
    }
    50% {
        opacity: 0.9;
    }
    100% {
        transform: translate(var(--star-x), var(--star-y)) scale(1) rotate(360deg);
        opacity: 0;
    }
`;

const starTwinkle = keyframes`
    0%, 100% {
        opacity: 1;
        transform: translate(0, 0) scale(0);
    }
    50% {
        opacity: 0.7;
        transform: translate(calc(var(--star-x) * 0.7), calc(var(--star-y) * 0.7)) scale(0.7);
    }
    100% {
        transform: translate(var(--star-x), var(--star-y)) scale(1);
        opacity: 0;
    }
`;

const starPulse = keyframes`
    0% {
        transform: translate(0, 0) scale(0);
        opacity: 1;
    }
    100% {
        transform: translate(var(--star-x), var(--star-y)) scale(2);
        opacity: 0;
    }
`;

