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
  transition: transform 0.3s ease-in-out;
  
  @media (max-width: 768px) {
    position: absolute;
    left: 0;
    top: 0;
    transform: translateX(${(props) => (props.$isOpen ? '0' : '-100%')});
  }

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #444;
    border-radius: 4px;
  }
`;

const MobileToggle = styled.button`
  display: none;
  position: absolute;
  top: 15px;
  left: 15px;
  z-index: 20;
  background: #333;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
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

const UploadLabel = styled.label`
  display: block;
  width: 100%;
  text-align: center;
  background-color: #2a2a2a;
  color: #aaa;
  border: 1px dashed #555;
  padding: 12px 0;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 15px;
  transition: all 0.2s;

  &:hover {
    background-color: #333;
    color: #fff;
    border-color: #777;
  }

  input {
    display: none;
  }
`;

export default function Sidebar() {
  const { availableBlocks, selectedBlockType, setSelectedBlockType, startDrag, stopDrag, setBlocks, addCustomBlockType } = useBlockStore();
  const [isOpen, setIsOpen] = React.useState(false);

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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('A imagem não pode passar de 2MB!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result;
      const newBlock = {
        id: `custom-${Date.now()}`,
        label: file.name.substring(0, 15),
        texture: base64,
        color: '#ffffff',
      };
      addCustomBlockType(newBlock);
      setSelectedBlockType(newBlock.id);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <MobileToggle onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕ Fechar Menu' : '☰ Abrir Menu'}
      </MobileToggle>

      <SidebarContainer $isOpen={isOpen}>
        <Title>BlockForge</Title>
        
        <ButtonRow>
          <ActionButton onClick={handleSave}>Salvar</ActionButton>
          <ActionButton onClick={handleLoad}>Carregar</ActionButton>
        </ButtonRow>
        
        <Title style={{ marginTop: 10 }}>Blocos</Title>

        <UploadLabel>
          + Upload Imagem
          <input type="file" accept="image/png, image/jpeg" onChange={handleFileUpload} />
        </UploadLabel>

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
    </>
  );
}
