import React, { useState, useEffect } from "react";
import "./App.css";
import { Container } from "react-bootstrap";
import { LoginForm } from "./components/LoginForm/LoginForm";
import { CodeForm } from "./components/CodeForm/CodeForm";
import { CodeList } from "./components/CodeList/CodeList";
import { CodesModal } from "./components/CodesModal/CodesModal";

import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [isFetching, setIsFetching] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsFetching(true);
  }, []);

  const onCodeChange = (value = true) => setIsFetching(value);

  const onOpenModal = () => setIsModalOpen(true);

  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <Container className="p-2">
        <LoginForm onCodeChange={() => onCodeChange()} />
        <CodeForm
          onCodeChange={() => onCodeChange()}
          onOpenModal={() => onOpenModal()}
          closeModal={() => closeModal()}
        />
        <CodeList onCodeChange={onCodeChange} isFetching={isFetching} />
        {isModalOpen && (
          <CodesModal
            isModalOpen={isModalOpen}
            closeModal={closeModal}
            onCodeChange={onCodeChange}
          />
        )}
      </Container>
      <ToastContainer position="bottom-right" />
    </>
  );
}

export default App;
