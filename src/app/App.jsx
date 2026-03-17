import AppLayout from '../components/layout/AppLayout';
import Editor from '../pages/Editor';
import { GlobalStyle } from '../styles/globals';

function App() {
  return (
    <>
      <GlobalStyle />
      <AppLayout>
        <Editor />
      </AppLayout>
    </>
  );
}

export default App;
