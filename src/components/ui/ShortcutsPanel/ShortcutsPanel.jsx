import { useState } from 'react';
import styled from 'styled-components';
import { SHORTCUTS, SHORTCUT_CATEGORIES } from '../../../config/shortcuts';

const FloatingBtn = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 20;
  background: rgba(20, 20, 20, 0.85);
  backdrop-filter: blur(8px);
  color: #aaa;
  border: 1px solid #333;
  padding: 6px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: rgba(30, 30, 30, 0.95);
    color: #fff;
    border-color: #555;
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Panel = styled.div`
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 24px 28px;
  max-width: 420px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);

  @media (min-width: 1000px) {
    max-width: 600px;
    padding: 30px 40px;
  }

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #444;
    border-radius: 4px;
  }
`;

const PanelTitle = styled.h2`
  margin: 0 0 20px 0;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  border-bottom: 1px solid #2a2a2a;
  padding-bottom: 12px;
`;

const CategoryTitle = styled.h3`
  margin: 16px 0 8px 0;
  color: #00e5ff;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
  border-bottom: 1px solid #1f1f1f;
`;

const KeyBadge = styled.span`
  background: #222;
  color: #ccc;
  border: 1px solid #3a3a3a;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-family: monospace;
  white-space: nowrap;
`;

const ActionText = styled.span`
  color: #888;
  font-size: 12px;
`;

const CloseBtn = styled.button`
  display: block;
  margin: 20px auto 0;
  background: #222;
  color: #aaa;
  border: 1px solid #333;
  padding: 8px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  &:hover {
    background: #2a2a2a;
    color: #fff;
  }
`;

export default function ShortcutsPanel() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <FloatingBtn onClick={() => setOpen(true)}>⌨ Atalhos</FloatingBtn>

      {open && (
        <Overlay onClick={() => setOpen(false)}>
          <Panel onClick={(e) => e.stopPropagation()}>
            <PanelTitle>Atalhos & Comandos</PanelTitle>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
              }}
            >
              {SHORTCUT_CATEGORIES.map((cat) => (
                <div key={cat}>
                  <CategoryTitle>{cat}</CategoryTitle>
                  {SHORTCUTS.filter((s) => s.category === cat).map((s, i) => (
                    <Row key={i}>
                      <KeyBadge>{s.keys}</KeyBadge>
                      <ActionText>{s.action}</ActionText>
                    </Row>
                  ))}
                </div>
              ))}

              <CloseBtn onClick={() => setOpen(false)}>Fechar</CloseBtn>
            </div>
          </Panel>
        </Overlay>
      )}
    </>
  );
}
