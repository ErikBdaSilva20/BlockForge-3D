import styled from 'styled-components';

const LayoutContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  overflow: hidden;
  background-color: #1e1e1e;
`;

export default function AppLayout({ children }) {
  return (
    <LayoutContainer>
      {children}
    </LayoutContainer>
  );
}
