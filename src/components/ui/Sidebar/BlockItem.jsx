import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px;
  background-color: ${(props) => (props.$selected ? 'rgba(0, 229, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)')};
  border-radius: 10px;
  cursor: grab;
  user-select: none;
  transition: all 0.2s ease;
  border: 1px solid ${(props) => (props.$selected ? 'rgba(0, 229, 255, 0.5)' : 'transparent')};
  box-shadow: ${(props) => (props.$selected ? '0 4px 12px rgba(0,0,0,0.2)' : 'none')};
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.08);
    transform: translateY(-2px);
  }

  &:active {
    cursor: grabbing;
    transform: translateY(1px);
  }
`;

const PreviewImage = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 6px;
  background-color: ${(props) => props.$color || '#555'};
  background-image: ${(props) => props.$texture ? `url(${props.$texture})` : 'none'};
  background-size: cover;
  image-rendering: pixelated;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
`;

const Label = styled.div`
  color: #fff;
  font-size: 11px;
  font-weight: 500;
  text-align: center;
  letter-spacing: 0.5px;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export default function BlockItem({ block, isSelected, onSelect, onDragStart }) {
  const [textureUrl, setTextureUrl] = useState(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    if (!block.texture) return;
    setLoadFailed(false);
    
    // Validar se a textura realmente carrega via Image antes de mostrar
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setTextureUrl(block.texture);
      setLoadFailed(false);
    };
    img.onerror = () => {
      setTextureUrl(null);
      setLoadFailed(true);
    };
    img.src = block.texture;
  }, [block.texture]);

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
      <PreviewImage 
        $color={loadFailed ? (block.color || '#555') : (block.color || '#333')} 
        $texture={textureUrl} 
      />
      <Label>{block.label}</Label>
    </Container>
  );
}
