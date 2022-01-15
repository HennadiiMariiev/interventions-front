import './App.css';
import { Container, Col, Row } from 'react-bootstrap';
import { LoginForm } from './components/LoginForm/LoginForm';
import { CodeForm } from './components/CodeForm/CodeForm';
import { CodeList } from './components/CodeList/CodeList';

import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <>
      <Container className="p-2">
        <LoginForm />
        <CodeForm />
        <CodeList />
      </Container>
      <ToastContainer position="bottom-right" />
    </>
  );
}

export default App;
