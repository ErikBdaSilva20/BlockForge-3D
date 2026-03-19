import React, { useState } from 'react';
import styled from 'styled-components';
import { useBlockStore } from '../../../store/blockStore';

const MenuContainer = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  gap: 12px;
  z-index: 1000;

  @media (max-width: 768px) {
    bottom: 85px;
    right: 20px;
  }
`;

const MainFAB = styled.button`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${(props) => (props.$active ? '#00e5ff' : '#222')};
  color: ${(props) => (props.$active ? '#000' : '#00e5ff')};
  border: 2px solid ${(props) => (props.$active ? '#00e5ff' : '#00e5ff44')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform: ${(props) => (props.$isOpen ? 'rotate(45deg)' : 'rotate(0)')};

  &:hover {
    transform: ${(props) => (props.$isOpen ? 'rotate(45deg) scale(1.05)' : 'scale(1.05)')};
  }

  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }
`;

const OptionList = styled.div`
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  gap: 10px;
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  transform: ${(props) => (props.$isOpen ? 'translateY(0)' : 'translateY(20px)')};
  pointer-events: ${(props) => (props.$isOpen ? 'auto' : 'none')};
  transition: all 0.3s ease;
`;

const SubFAB = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: ${(props) => (props.$isSelected ? '#00e5ff' : '#1a1a1a')};
  color: ${(props) => (props.$isSelected ? '#000' : '#888')};
  border: 1.5px solid ${(props) => (props.$isSelected ? '#00e5ff' : '#333')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => (props.$isSelected ? '#33eaff' : '#252525')};
    color: ${(props) => (props.$isSelected ? '#000' : '#fff')};
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
`;

const Tooltip = styled.div`
  position: absolute;
  right: 64px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 11px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s;
  ${SubFAB}:hover & {
    opacity: 1;
  }
`;

export default function BrushFAB() {
  const { 
    brushMode, 
    toggleBrushMode, 
    brushOrientation, 
    setBrushOrientation,
    brushType,
    setBrushType
  } = useBlockStore();
  
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleModeChange = (orientation) => {
    if (!brushMode) toggleBrushMode();
    setBrushOrientation(orientation);
    // Auto-close menu on selection for better UX? Maybe not.
  };

  const handleTypeChange = (type) => {
    if (!brushMode) toggleBrushMode();
    setBrushType(type);
  };

  return (
    <MenuContainer>
      <MainFAB $isOpen={isOpen} $active={brushMode} onClick={toggleMenu}>
        +
      </MainFAB>

      <OptionList $isOpen={isOpen}>
        {/* Toggle Brush Mode Entirely */}
        <SubFAB 
          $isSelected={brushMode} 
          onClick={toggleBrushMode}
        >
          {brushMode ? '🖌️' : '🔘'}
          <Tooltip>{brushMode ? 'Desativar Pincel' : 'Ativar Pincel'}</Tooltip>
        </SubFAB>

        {/* Orientation: Vertical */}
        <SubFAB 
          $isSelected={brushMode && brushOrientation === 'vertical'} 
          onClick={() => handleModeChange('vertical')}
        >
          ║
          <Tooltip>Vertical</Tooltip>
        </SubFAB>

        {/* Orientation: Horizontal */}
        <SubFAB 
          $isSelected={brushMode && brushOrientation === 'horizontal'} 
          onClick={() => handleModeChange('horizontal')}
        >
          ═
          <Tooltip>Horizontal</Tooltip>
        </SubFAB>

        {/* Type: Remove */}
        <SubFAB 
          $isSelected={brushMode && brushType === 'remove'} 
          onClick={() => handleTypeChange('remove')}
        >
          🧹
          <Tooltip>Borracha</Tooltip>
        </SubFAB>

        {/* Type: Add */}
        <SubFAB 
          $isSelected={brushMode && brushType === 'add'} 
          onClick={() => handleTypeChange('add')}
        >
          ✏️
          <Tooltip>Lápis</Tooltip>
        </SubFAB>
      </OptionList>
    </MenuContainer>
  );
}
