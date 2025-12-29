import React from "react";
import styled from "styled-components";
import { useClick } from "../store/Context";
import { useEffect, useState } from "react";
import { useSound } from "../hooks/useSound";

export function ShopButton({ type, point, coast, icon }) {
    const [text, setText] = useState('');
    const { points, addPointToClick, awayPoints, addAutoPoints } = useClick();
    const activeSound = useSound('sounds/activ.mp3', 0.6);
    const hoverSound = useSound('sounds/hover.mp3');

    const [lastAdTime, setLastAdTime] = useState(0);

    useEffect(() => {
        if (type === "click") {
            setText(` за клик`);
        } else if (type === "auto") {
            setText(` в секунду`);
        }
    }, [type, point]);



    const buy = async () => {
        if (points >= coast) {
            activeSound.play();

            awayPoints(coast);

            if (type === 'click') {
                addPointToClick(point);
            } else if (type === 'auto') {
                addAutoPoints(point);
            }
        }
    };

    useEffect(() => {
        const savedTime = localStorage.getItem('lastAdTime');
        if (savedTime) {
            setLastAdTime(parseInt(savedTime));
        }
    }, []);

    return (
        <ShopButtonContainer
            onClick={buy}
            disabled={points < coast}
            onMouseEnter={() => { hoverSound.play() }}
        >
            <Icon $src={icon} />
            <TextContainer>
                +{point}<br />{text}
            </TextContainer>
            <CoastContainer>{coast} <Star /></CoastContainer>
        </ShopButtonContainer>
    );
}

const ShopButtonContainer = styled.button`
    width: 100%;
    padding: 20px 10px;
    background-color: ${props => props.disabled ? '#555' : '#F250D7'};
    color: white;
    border: solid 2px #F250D7;
    border-radius: 15px;
    margin: 5px 0;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    display: grid;
    grid-template-columns: 50px 1fr auto;
    align-items: center;
    gap: 15px;
    font-size: 24px;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
        background-color: ${props => props.disabled ? '#555' : '#D946C4'};
        transform: translateY(-1px);
    }
`;

const TextContainer = styled.div`
    text-align: center;
    line-height: 1.2rem;
    
    @media (max-width: 1500px) {
        text-align: left;
    }
`;

const Icon = styled.div`
    background: url(${props => props.$src});
    width: 50px;
    height: 50px;
    background-size: contain;
    background-repeat: no-repeat;
`;

const Star = styled.div`
    background: url('/icons/star.png');
    width: 40px;
    height: 40px;
    background-size: cover;
    filter: drop-shadow(0 0 10px rgba(242, 194, 0, 0.8));
`;

const CoastContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
`;