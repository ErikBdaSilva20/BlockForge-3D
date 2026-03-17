import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useBlockStore } from '../../../store/blockStore';

const SidebarContainer = styled.div`
  width: 250px;
  height: 100vh;
  background-color: #222;
  border-right: 1px solid #333;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 10;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.5);
`;

const BlockItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background-color: ${(props) => (props.$selected ? '#444' : '#333')};
  border-radius: 8px;
  cursor: grab;
  user-select: none;
  transition: background-color 0.2s;
  
  &:active {
    cursor: grabbing;
  }
`;

const ColorPreview = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 4px;
  background-color: ${(props) => props.$color};
  border: 2px solid #555;
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
      <h3 style={{ margin: 0, paddingBottom: 10, borderBottom: '1px solid #444' }}>Blocks</h3>
      {BLOCKS.map((block) => (
        <BlockItem 
          key={block.id}
          $selected={selectedBlockType === block.id}
          onClick={() => setSelectedBlockType(block.id)}
          onPointerDown={(e) => {
            e.preventDefault();
            // Free the pointer from this element so the R3F Canvas can receive hover events
            if (e.target.hasPointerCapture(e.pointerId)) {
               e.target.releasePointerCapture(e.pointerId);
            }
            setSelectedBlockType(block.id);
            startDrag(block.id);
          }}
        >
          <ColorPreview $color={block.color} />
          <span>{block.label}</span>
        </BlockItem>
      ))}
    </SidebarContainer>
  );
}
