import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Modal = styled.div`
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 16px;
  padding: 30px;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 0.4s ease forwards;
`;

const Title = styled.h2`
  margin: 0 0 16px 0;
  color: #00e5ff;
  font-size: 20px;
  font-weight: 700;
`;

const Description = styled.p`
  margin: 0 0 24px 0;
  color: #ccc;
  font-size: 14px;
  line-height: 1.6;
`;

const ButtonsRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: auto;
`;

const Button = styled.button`
  background: ${(props) => (props.$primary ? 'rgba(0, 229, 255, 0.15)' : '#2a2a2a')};
  color: ${(props) => (props.$primary ? '#00e5ff' : '#aaa')};
  border: 1px solid ${(props) => (props.$primary ? '#00e5ff' : '#444')};
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => (props.$primary ? 'rgba(0, 229, 255, 0.25)' : '#333')};
    color: #fff;
  }
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-bottom: 20px;
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(props) => (props.$active ? '#00e5ff' : '#444')};
  transition: background 0.3s;
`;

const TUTORIAL_STEPS = [
  {
    title: 'Bem-vindo ao BlockForge!',
    text: 'Este é um editor 3D poderoso para criar e visualizar modelos do Minecraft diretamente no seu navegador. Vamos te guiar rapidamente pelas ferramentas!',
  },
  {
    title: '📂 Gerenciar Projeto',
    text: 'Para prosseguir na aplicação e gerenciar seu trabalho, use o menu lateral. Lá você pode salvar seu progresso no navegador, carregar projetos ou baixar seu mundo como um arquivo JSON.',
  },
  {
    title: '⚙️ Configurações do Mundo',
    text: 'Ajuste o tamanho do cenário (Pequeno a Gigante), ligue as sombras para melhores gráficos ou ative as bordas para não se perder na construção.',
  },
  {
    title: '🖌️ Ferramenta de Pincel',
    text: 'Use o botão de "+" no canto da tela para abrir o menu do Pincel. Você pode escolher entre pintar na Vertical (paredes) ou Horizontal (pisos), além de alternar entre o Lápis e a Borracha.',
  },
  {
    title: '📦 Catálogo de Blocos',
    text: 'Abra o Catálogo no topo do menu lateral para escolher entre centenas de blocos reais do Minecraft. Use a pesquisa para encontrar o que precisa instantaneamente!',
  },
];

export default function TutorialOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check local storage on mount
    const hasSeenTutorial = localStorage.getItem('blockforge_tutorial_seen');
    if (!hasSeenTutorial) {
      setIsOpen(true);
    }
  }, []);

  const closeTutorial = () => {
    setIsOpen(false);
    localStorage.setItem('blockforge_tutorial_seen', 'true');
  };

  const nextStep = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      closeTutorial();
    }
  };

  if (!isOpen) return null;

  const step = TUTORIAL_STEPS[currentStep];

  return (
    <Overlay>
      {/* O uso do key no Modal força o recarregamento do componente, ativando a animação de fade-in novamente entre os passos */}
      <Modal key={currentStep}>
        <Title>{step.title}</Title>
        <Description>{step.text}</Description>
        
        <StepIndicator>
          {TUTORIAL_STEPS.map((_, index) => (
            <Dot key={index} $active={index === currentStep} />
          ))}
        </StepIndicator>

        <ButtonsRow>
          <Button onClick={closeTutorial}>Pular Tudo</Button>
          <Button $primary onClick={nextStep}>
            {currentStep === TUTORIAL_STEPS.length - 1 ? 'Começar a Criar!' : 'Próximo'}
          </Button>
        </ButtonsRow>
      </Modal>
    </Overlay>
  );
}
