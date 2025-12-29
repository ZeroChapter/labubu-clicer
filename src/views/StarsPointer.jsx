import React from "react";
import styled from "styled-components";
import { useClick } from "../store/Context";

export function StarsPointer() {
    const { points, pointToClick, autoClick } = useClick()

    return (
        <PosotionContainer>
            <DivCounter>
                <Icon key={points} />
                <h2>{points}</h2>
            </DivCounter>
            <BuffBar>
                <p>+{pointToClick} за клик</p>
                <p>+{autoClick} в секунду</p>
            </BuffBar>
        </PosotionContainer>
    );
}

const PosotionContainer = styled.div`
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 100;
    display: flex
    flex-direction: column;
`
const BuffBar = styled.div`
    display: flex;
    flex-direction: column;
    font-size: 1.5rem;
    gap: 0;
    margin-left: 40px;
    color: #8a0399;
    p {
    font-size: 1.5rem;
    margin: 0;
    }
`
const DivCounter = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center; 
    gap: 10px; 
    margin: 0px;
    padding: 0px;

    h2 {
        font-size: 3rem;
        color: #8a0399;
    }
`;

const Icon = styled.div`
    background: url(icons/star.png);
    caret-color: transparent;
    background-size: cover;
    width: 130px;
    height: 130px;
    animation: Up 0.5s ease-in-out forwards;
    filter: drop-shadow(0 0 10px rgba(242, 80, 215, 0.7));
    @keyframes Up {
        0%, 100% {
            transform: scale(1);
            filter: drop-shadow(0 0 10px rgba(242, 80, 215, 0.7));
        }
        50% {
            transform: scale(0.7);
            filter: drop-shadow(0 0 50px rgba(242, 80, 215, 0.8));
        }
    }
        
`;