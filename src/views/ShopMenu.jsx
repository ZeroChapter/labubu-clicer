import React from "react";
import styled from "styled-components";
import { useClick } from "../store/Context";
import { ShopButton } from "./ShopButton";

export function ShopMenu() {
    const { points, getLabubuCost } = useClick();

    return (
        <Screan>


            <Section>
                <Header>
                    <h1>МАГАЗИН</h1>
                </Header>

                <ShopButton coast={20} type={'auto'} point={1} icon={'icons/clock1.png'} />
                <ShopButton coast={100} type={'click'} point={1} icon={'icons/click1.png'} />

                <ShopButton coast={1000} type={'auto'} point={15} icon={'icons/clock2.png'} />
                <ShopButton coast={1500} type={'click'} point={20} icon={'icons/click2.png'} />

                <ShopButton coast={10000} type={'auto'} point={50} icon={'icons/clock3.png'} />
                <ShopButton coast={25000} type={'click'} point={30} icon={'icons/click3.png'} />

                <ShopButton coast={100000} type={'auto'} point={100} icon={'icons/clock4.png'} />
                <ShopButton coast={200000} type={'click'} point={200} icon={'icons/click4.png'} />








            </Section>
        </Screan>
    )
}

const Screan = styled.div`
    width: 30%;
    height: 100%;
    background: linear-gradient(135deg, #9E2A13, #7A1F0E);
    background-image: url(shopback.jpg);
    background-size: cover;
    padding: 0;
    overflow-y: auto;
    box-shadow: -15px 1px 15px rgba(0, 0, 0, 0.1);
    z-index: 2;
`;

const Header = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    
    h1 {
        color: #F2C150;
        margin: 0;
        font-size: 2rem;
        font-weight: bold;
        letter-spacing: 2px;
    }
`;



const Section = styled.div`
    background: rgba(0, 0, 0, 0.5);
    padding: 15px;
    border-radius: 10px;
    margin: 20px;
`;

const SectionTitle = styled.h3`
    color: #F2C150;
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 1rem;
`;




