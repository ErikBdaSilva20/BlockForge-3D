import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useBlockStore } from '../../../store/blockStore';
import BlockItem from './BlockItem';
import { saveProject, loadProject } from '../../../utils/storage/projectStorage';
import { WORLD_SIZES } from '../../../utils/constants/worldSizes';

const SidebarContainer = styled.div`
  width: 260px;
  height: 100vh;
  background-color: #151515;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 10;
  overflow-y: auto;
  transition: transform 0.3s ease-in-out;
  
  @media (max-width: 768px) {
    position: absolute;
    left: 0;
    top: 0;
    transform: translateX(${(props) => (props.$isOpen ? '0' : '-100%')});
  }

  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 4px;
  }
`;

const MobileToggle = styled.button`
  display: none;
  position: absolute;
  top: 15px;
  left: 15px;
  z-index: 20;
  background: #222;
  color: white;
  border: 1px solid #333;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Logo = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding-bottom: 12px;
  margin-bottom: 4px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

const SectionLabel = styled.div`
  font-size: 10px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-top: 12px;
  margin-bottom: 4px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 6px;
`;

const SmallBtn = styled.button`
  flex: 1;
  background-color: #222;
  color: #aaa;
  border: 1px solid #333;
  padding: 7px 0;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.15s;
  
  &:hover {
    background-color: #2a2a2a;
    color: #fff;
    border-color: #555;
  }
`;

const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  background: #1a1a1a;
  border-radius: 6px;
  border: 1px solid #2a2a2a;
`;

const ToggleLabel = styled.span`
  font-size: 12px;
  color: #999;
`;

const ToggleSwitch = styled.button`
  width: 36px;
  height: 20px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  position: relative;
  background: ${(props) => (props.$active ? '#00e5ff' : '#333')};
  transition: background 0.2s;

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${(props) => (props.$active ? '18px' : '2px')};
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #fff;
    transition: left 0.2s;
  }
`;

const SizeSelect = styled.select`
  width: 100%;
  background: #1a1a1a;
  color: #ccc;
  border: 1px solid #2a2a2a;
  padding: 7px 10px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  outline: none;

  &:hover {
    border-color: #444;
  }
`;

const UploadLabel = styled.label`
  display: block;
  width: 100%;
  text-align: center;
  background-color: #1a1a1a;
  color: #666;
  border: 1px dashed #333;
  padding: 10px 0;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;

  &:hover {
    background-color: #222;
    color: #aaa;
    border-color: #555;
  }

  input {
    display: none;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.05);
  margin: 4px 0;
`;

const BlockList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  overflow-y: auto;
`;

export default function Sidebar() {
  const { 
    availableBlocks, selectedBlockType, setSelectedBlockType, 
    startDrag, stopDrag, setBlocks, addCustomBlockType, 
    shadowsEnabled, toggleShadows, 
    showWorldBounds, toggleWorldBounds,
    worldSize, setWorldSize, clearAllBlocks, getOutOfBoundsCount,
    blocks
  } = useBlockStore();
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

  const handleClearAll = () => {
    if (blocks.length === 0) return;
    const confirmed = window.confirm(
      `Tem certeza que deseja apagar todos os ${blocks.length} blocos? Esta ação pode ser desfeita com Ctrl+Z.`
    );
    if (confirmed) clearAllBlocks();
  };

  const handleWorldSizeChange = (e) => {
    const newSizeId = e.target.value;
    const outCount = getOutOfBoundsCount(newSizeId);
    
    if (outCount > 0) {
      const confirmed = window.confirm(
        `Atenção: ${outCount} bloco(s) estão fora dos limites do tamanho selecionado e serão removidos. Deseja continuar?`
      );
      if (confirmed) {
        setWorldSize(newSizeId, true);
      }
      // If not confirmed, don't change
      return;
    }
    
    setWorldSize(newSizeId, false);
  };

  return (
    <>
      <MobileToggle onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕ Fechar' : '☰ Menu'}
      </MobileToggle>

      <SidebarContainer $isOpen={isOpen}>
        <Logo>BlockForge</Logo>

        {/* ---- PROJECT ---- */}
        <SectionLabel>Projeto</SectionLabel>
        <ButtonRow>
          <SmallBtn onClick={handleSave}>💾 Salvar</SmallBtn>
          <SmallBtn onClick={handleLoad}>📂 Carregar</SmallBtn>
        </ButtonRow>
        <SmallBtn onClick={handleClearAll} style={{ color: '#ff6b6b' }}>
          🗑️ Apagar Tudo ({blocks.length})
        </SmallBtn>

        <Divider />

        {/* ---- SETTINGS ---- */}
        <SectionLabel>Configurações</SectionLabel>
        
        <ToggleRow>
          <ToggleLabel>Sombras</ToggleLabel>
          <ToggleSwitch $active={shadowsEnabled} onClick={toggleShadows} />
        </ToggleRow>

        <ToggleRow>
          <ToggleLabel>Bordas do Mundo</ToggleLabel>
          <ToggleSwitch $active={showWorldBounds} onClick={toggleWorldBounds} />
        </ToggleRow>

        <SizeSelect 
          value={worldSize.id}
          onChange={handleWorldSizeChange}
        >
          {WORLD_SIZES.map((size) => (
            <option key={size.id} value={size.id}>
              {size.label} ({size.width}×{size.height}×{size.depth})
            </option>
          ))}
        </SizeSelect>

        <Divider />

        {/* ---- BLOCKS ---- */}
        <SectionLabel>Blocos</SectionLabel>

        <UploadLabel>
          + Upload Imagem
          <input type="file" accept="image/png, image/jpeg" onChange={handleFileUpload} />
        </UploadLabel>

        <BlockList>
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
        </BlockList>
      </SidebarContainer>
    </>
  );
}
