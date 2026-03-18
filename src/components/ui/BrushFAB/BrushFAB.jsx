import React from 'react';
import styled from 'styled-components';
import { useBlockStore } from '../../../store/blockStore';

const FABContainer = styled.button`
  position: absolute;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background-color: ${(props) => props.$active ? '#00e5ff' : '#222'};
  color: ${(props) => props.$active ? '#000' : '#00e5ff'};
  border: 2px solid ${(props) => props.$active ? '#00e5ff' : '#00e5ff44'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  transition: all 0.2s ease;
  z-index: 50;

  &:hover {
    transform: scale(1.05);
    background-color: ${(props) => props.$active ? '#33eaff' : '#333'};
    box-shadow: 0 6px 16px rgba(0, 229, 255, 0.3);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    bottom: 20px;
    right: 20px;
    width: 48px;
    height: 48px;
    font-size: 20px;
  }
`;

export default function BrushFAB() {
  const { brushMode, toggleBrushMode } = useBlockStore();

  return (
    <FABContainer 
      $active={brushMode} 
      onClick={toggleBrushMode}
      title={brushMode ? "Desativar Pincel" : "Ativar Pincel"}
    >
      🖌️
    </FABContainer>
  );
}
