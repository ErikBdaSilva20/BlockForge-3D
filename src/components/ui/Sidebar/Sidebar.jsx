import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useBlockStore } from '../../../store/blockStore';
import BlockItem from './BlockItem';

const SidebarContainer = styled.div`
  width: 250px;
  height: 100vh;
  background-color: #1e1e1e;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 10;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.5);
`;

const Title = styled.h3`
  margin: 0 0 10px 0;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const BLOCKS = [
  { id: 'wood', label: 'Wood Block', color: '#8B5A2B' },
  { id: 'stone', label: 'Stone Block', color: '#888888' },
  { id: 'grass', label: 'Grass Block', color: '#556B2F' },
  { id: 'glass', label: 'Glass Block', color: '#ADD8E6' },
];

export default function Sidebar() {
  const { selectedBlockType, setSelectedBlockType, startDrag, stopDrag } = useBlockStore();

  useEffect(() => {
    const handleUp = () => stopDrag();
    window.addEventListener('pointerup', handleUp);
    return () => window.removeEventListener('pointerup', handleUp);
  }, [stopDrag]);

  return (
    <SidebarContainer>
      <Title>Blocks</Title>
      {BLOCKS.map((block) => (
        <BlockItem 
          key={block.id}
          block={block}
          isSelected={selectedBlockType === block.id}
          onSelect={() => setSelectedBlockType(block.id)}
          onDragStart={() => {
            setSelectedBlockType(block.id);
            startDrag(block.id);
          }}
        />
      ))}
    </SidebarContainer>
  );
}
