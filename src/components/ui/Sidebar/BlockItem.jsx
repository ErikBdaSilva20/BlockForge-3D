import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 16px;
  background-color: ${(props) => (props.$selected ? 'rgba(255, 255, 255, 0.15)' : 'transparent')};
  border-radius: 10px;
  cursor: grab;
  user-select: none;
  transition: all 0.2s ease;
  border: 1px solid ${(props) => (props.$selected ? 'rgba(255, 255, 255, 0.3)' : 'transparent')};
  box-shadow: ${(props) => (props.$selected ? '0 4px 12px rgba(0,0,0,0.2)' : 'none')};
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
  }

  &:active {
    cursor: grabbing;
    transform: translateY(1px);
  }
`;

const Preview = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: ${(props) => props.$color};
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
`;

const Label = styled.span`
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.5px;
`;

export default function BlockItem({ block, isSelected, onSelect, onDragStart }) {
  return (
    <Container
      $selected={isSelected}
      onClick={onSelect}
      onPointerDown={(e) => {
        if (e.target.hasPointerCapture(e.pointerId)) {
          e.target.releasePointerCapture(e.pointerId);
        }
        onDragStart();
      }}
    >
      <Preview $color={block.color} />
      <Label>{block.label}</Label>
    </Container>
  );
}
