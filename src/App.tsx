import { Route, Routes } from 'react-router-dom';
import Editor from './pages/Editor';
import Preview from './pages/Preview';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Editor />} />
      <Route path="/preview" element={<Preview />} />
    </Routes>
  );
}

export default App;
