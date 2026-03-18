import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useBlockStore } from '../../../store/blockStore';
import { WORLD_SIZES } from '../../../utils/constants/worldSizes';
import {
  downloadProjectFile,
  loadProject,
  loadProjectFile,
  saveProject,
} from '../../../utils/storage/projectStorage';
import BlockItem from './BlockItem';

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

const BrushBtn = styled.button`
  width: 100%;
  background-color: ${(props) => (props.$active ? '#00e5ff' : '#222')};
  color: ${(props) => (props.$active ? '#000' : '#aaa')};
  border: 1px solid ${(props) => (props.$active ? '#00e5ff' : '#333')};
  padding: 7px 0;
  border-radius: 5px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
  transition: all 0.15s;
  &:hover {
    opacity: 0.85;
  }
`;

const LayerIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  background: #1a1a1a;
  border-radius: 6px;
  border: 1px solid #00e5ff33;
  font-size: 12px;
  color: #00e5ff;
`;

const LayerBtn = styled.button`
  background: #222;
  color: #00e5ff;
  border: 1px solid #00e5ff44;
  width: 26px;
  height: 26px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  &:hover {
    background: #00e5ff22;
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

const SearchInput = styled.input`
  width: 100%;
  background-color: #1a1a1a;
  color: #fff;
  border: 1px solid #333;
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 12px;
  margin-bottom: 8px;
  outline: none;
  &:focus {
    border-color: #00e5ff;
  }
`;

const BlocksDrawer = styled.div`
  position: fixed;
  left: ${(props) => (props.$isOpen ? '260px' : '-100vw')};
  top: 0;
  width: 40%;
  height: 100vh;
  background-color: #1a1a1a;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  padding: 24px;
  z-index: 15;
  transition: left 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  box-shadow: 10px 0 30px rgba(0, 0, 0, 0.8);

  @media (max-width: 1000px) {
    width: 60%;
  }

  @media (max-width: 768px) {
    left: ${(props) => (props.$isOpen ? '0' : '-100vw')};
    width: 85%;
    z-index: 30;
  }
`;

const BlocksDrawerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const BlocksDrawerTitle = styled.h2`
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  text-transform: uppercase;
`;

const BlocksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
  overflow-y: auto;
  flex: 1;
  padding-right: 8px;

  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: #444;
    border-radius: 4px;
  }
`;

const HelpText = styled.div`
  font-size: 10px;
  color: #555;
  line-height: 1.4;
`;

export default function Sidebar() {
  const {
    availableBlocks,
    selectedBlockType,
    setSelectedBlockType,
    startDrag,
    stopDrag,
    setBlocks,
    addCustomBlockType,
    shadowsEnabled,
    toggleShadows,
    showWorldBounds,
    toggleWorldBounds,
    worldSize,
    setWorldSize,
    clearAllBlocks,
    getOutOfBoundsCount,
    blocks,
    brushMode,
    toggleBrushMode,
    brushLayer,
    setBrushLayer,
    brushMarks,
    confirmBrushMarks,
    clearBrushMarks,
    brushType,
    setBrushType,
    brushOrientation,
    setBrushOrientation,
  } = useBlockStore();
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isBlocksOpen, setIsBlocksOpen] = React.useState(false);
  const drawerRef = React.useRef(null);
  const sidebarRef = React.useRef(null);

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (
        isBlocksOpen &&
        drawerRef.current &&
        !drawerRef.current.contains(event.target) &&
        !event.target.closest('#catalog-btn')
      ) {
        setIsBlocksOpen(false);
      }

      if (
        isOpen &&
        window.innerWidth <= 768 &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest('#mobile-toggle-btn')
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isBlocksOpen, isOpen]);

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

  const handleDownloadFile = () => {
    downloadProjectFile(blocks);
  };

  const handleUploadFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    loadProjectFile(file, (data) => {
      setBlocks(data);
    });
    e.target.value = null;
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
      return;
    }

    setWorldSize(newSizeId, false);
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
      <MobileToggle id="mobile-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕ Fechar' : '☰ Menu'}
      </MobileToggle>

      <SidebarContainer ref={sidebarRef} $isOpen={isOpen}>
        <Logo>BlockForge</Logo>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
          <SmallBtn
            id="catalog-btn"
            style={{
              backgroundColor: 'rgba(0, 229, 255, 0.1)',
              color: '#00e5ff',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: '600',
              border: '1px solid #00e5ff66',
              borderRadius: '20px',
              cursor: 'pointer',
              width: 'max-content',
            }}
            onClick={() => setIsBlocksOpen(!isBlocksOpen)}
          >
            {isBlocksOpen ? '✕ Fechar Catálogo' : '📦 Catálogo'}
          </SmallBtn>
        </div>

        {/* ---- PROJECT ---- */}
        <SectionLabel>Projeto</SectionLabel>
        <ButtonRow>
          <SmallBtn onClick={handleSave}>💾 Salvar</SmallBtn>
          <SmallBtn onClick={handleLoad}>📂 Carregar</SmallBtn>
          <SmallBtn
            onClick={handleClearAll}
            style={{ color: '#ff6b6b', flex: '0 0 auto', padding: '7px 10px' }}
          >
            🗑️
          </SmallBtn>
        </ButtonRow>
        <ButtonRow>
          <SmallBtn onClick={handleDownloadFile}>📥 Baixar (.json)</SmallBtn>
          <SmallBtn as="label" style={{ textAlign: 'center', margin: 0 }}>
            📤 Abrir JSON
            <input
              type="file"
              accept=".json"
              onChange={handleUploadFile}
              style={{ display: 'none' }}
            />
          </SmallBtn>
        </ButtonRow>

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

        <SizeSelect value={worldSize.id} onChange={handleWorldSizeChange}>
          {WORLD_SIZES.map((size) => (
            <option key={size.id} value={size.id}>
              {size.label} ({size.width}×{size.height}×{size.depth})
            </option>
          ))}
        </SizeSelect>

        <Divider />

        {/* ---- BRUSH MODE ---- */}
        <SectionLabel>Modo Pincel</SectionLabel>

        <BrushBtn $active={brushMode} onClick={toggleBrushMode}>
          {brushMode ? '✓ Pincel Ativado' : '🖌️ Ativar Pincel'}
        </BrushBtn>

        {brushMode && (
          <>
            <ButtonRow>
              <SmallBtn
                onClick={() => setBrushType('add')}
                style={{
                  backgroundColor: brushType === 'add' ? '#2a4433' : '#222',
                  borderColor: brushType === 'add' ? '#4cff88' : '#333',
                  color: brushType === 'add' ? '#4cff88' : '#aaa',
                }}
              >
                Colocar
              </SmallBtn>
              <SmallBtn
                onClick={() => setBrushType('remove')}
                style={{
                  backgroundColor: brushType === 'remove' ? '#442a2a' : '#222',
                  borderColor: brushType === 'remove' ? '#ff6b6b' : '#333',
                  color: brushType === 'remove' ? '#ff6b6b' : '#aaa',
                }}
              >
                Remover
              </SmallBtn>
            </ButtonRow>

            <SectionLabel style={{ marginTop: '6px', marginBottom: '2px' }}>
              Orientação
            </SectionLabel>
            <ButtonRow>
              <SmallBtn
                onClick={() => setBrushOrientation('horizontal')}
                style={{
                  backgroundColor: brushOrientation === 'horizontal' ? '#1a2a44' : '#222',
                  borderColor: brushOrientation === 'horizontal' ? '#5588ff' : '#333',
                  color: brushOrientation === 'horizontal' ? '#5588ff' : '#aaa',
                }}
              >
                ═ Horizontal
              </SmallBtn>
              <SmallBtn
                onClick={() => setBrushOrientation('vertical')}
                style={{
                  backgroundColor: brushOrientation === 'vertical' ? '#2a1a44' : '#222',
                  borderColor: brushOrientation === 'vertical' ? '#aa55ff' : '#333',
                  color: brushOrientation === 'vertical' ? '#aa55ff' : '#aaa',
                }}
              >
                ║ Vertical
              </SmallBtn>
            </ButtonRow>

            <LayerIndicator>
              <LayerBtn onClick={() => setBrushLayer(brushLayer - 1)}>−</LayerBtn>
              <span>
                {brushOrientation === 'vertical'
                  ? `Altura: ${brushLayer}`
                  : `Camada: ${brushLayer}`}
              </span>
              <LayerBtn onClick={() => setBrushLayer(brushLayer + 1)}>+</LayerBtn>
            </LayerIndicator>

            <ButtonRow>
              <SmallBtn
                onClick={confirmBrushMarks}
                style={{ color: '#00e5ff', borderColor: '#00e5ff44' }}
              >
                ✓ Executar ({brushMarks.length})
              </SmallBtn>
              <SmallBtn onClick={clearBrushMarks} style={{ color: '#aaa' }}>
                ✕ Limpar
              </SmallBtn>
            </ButtonRow>

            <HelpText>
              {brushOrientation === 'vertical'
                ? 'Vertical: pinta colunas do chão até a altura definida. Scroll muda a altura.'
                : 'Horizontal: pinta na camada (altura) definida. Scroll muda a camada.'}
            </HelpText>
          </>
        )}

        <UploadLabel>
          + Upload Imagem
          <input type="file" accept="image/png, image/jpeg" onChange={handleFileUpload} />
        </UploadLabel>
      </SidebarContainer>

      <BlocksDrawer ref={drawerRef} $isOpen={isBlocksOpen}>
        <BlocksDrawerHeader>
          <BlocksDrawerTitle>Catálogo de Blocos ({availableBlocks.length})</BlocksDrawerTitle>
          <SmallBtn
            onClick={() => setIsBlocksOpen(false)}
            style={{ flex: 'none', width: '36px', height: '36px', padding: 0 }}
          >
            ✕
          </SmallBtn>
        </BlocksDrawerHeader>
        <SearchInput
          type="text"
          placeholder="Buscar bloco..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <BlocksGrid>
          {availableBlocks
            .filter((b) => (b.label || '').toLowerCase().includes((searchTerm || '').toLowerCase()))
            .map((block) => (
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
        </BlocksGrid>
      </BlocksDrawer>
    </>
  );
}
