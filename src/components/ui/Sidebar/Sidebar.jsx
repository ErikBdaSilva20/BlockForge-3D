import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useBlockStore } from '../../../store/blockStore';
import BlockItem from './BlockItem';
import { saveProject, loadProject } from '../../../utils/storage/projectStorage';

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
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #444;
    border-radius: 4px;
  }
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

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
`;

const ActionButton = styled.button`
  flex: 1;
  background-color: #333;
  color: #fff;
  border: 1px solid #444;
  padding: 8px 0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #444;
  }
`;

export default function Sidebar() {
  const { availableBlocks, selectedBlockType, setSelectedBlockType, startDrag, stopDrag, setBlocks } = useBlockStore();

  useEffect(() => {
    const handleUp = () => stopDrag();
    window.addEventListener('pointerup', handleUp);
    return () => window.removeEventListener('pointerup', handleUp);
  }, [stopDrag]);

  const handleSave = () => {
    const state = useBlockStore.getState();
    if (saveProject(state.blocks)) {
      alert('Projeto salvo com sucesso!');
    }
  };

  const handleLoad = () => {
    const data = loadProject();
    if (data) {
      setBlocks(data);
    } else {
      alert('Nenhum projeto foi encontrado.');
    }
  };

  return (
    <SidebarContainer>
      <Title>BlockForge</Title>
      
      <ButtonRow>
        <ActionButton onClick={handleSave}>Salvar</ActionButton>
        <ActionButton onClick={handleLoad}>Carregar</ActionButton>
      </ButtonRow>
      
      <Title style={{ marginTop: 10 }}>Blocos</Title>

      {availableBlocks.map((block) => (
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
