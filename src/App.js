import React, { useState, useEffect } from 'react';
import './App.css';
import { Container } from 'react-bootstrap';
import { LoginForm } from './components/LoginForm/LoginForm';
import { CodeForm } from './components/CodeForm/CodeForm';
import { CodeList } from './components/CodeList/CodeList';

import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    setIsFetching(true);
  }, []);

  const onCodeChange = (value = true) => {
    setIsFetching(value);
  };

  return (
    <>
      <Container className="p-2">
        <LoginForm onCodeChange={() => onCodeChange()} />
        <CodeForm onCodeChange={() => onCodeChange()} />
        <CodeList onCodeChange={onCodeChange} isFetching={isFetching} />
      </Container>
      <ToastContainer position="bottom-right" />
    </>
  );
}

export default App;
