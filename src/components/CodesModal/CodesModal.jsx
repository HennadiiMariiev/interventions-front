import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import api from "../../api/axios";
import { toastMessage } from "./../../helpers/toast.helper";

import codesJson from "./codes.json";

import styles from "./styles.module.scss";

export function CodesModal({ isModalOpen, closeModal, onCodeChange }) {
  const [checkedCodes, setCheckedCodes] = useState([]);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (checkedCodes.length) {
      try {
        const res = await api.post("/interventions/add_list", {
          codes: checkedCodes,
        });

        if (res.status === 201) {
          toastMessage(
            "success",
            `Коды (в кол-ве ${checkedCodes.length}) успешно добавлены`
          );
          setCheckedCodes([]);
          closeModal();
          onCodeChange();
        }
      } catch (error) {
        toastMessage("error", `Ошибка: ${error.message}`);
      }
    }
  };

  const onCodeChecked = ({ target: { checked, value } }) => {
    checked
      ? setCheckedCodes((prev) => [...prev, value])
      : setCheckedCodes((prev) => prev.filter((code) => code !== value));
  };

  const codeChecks = Object.keys(codesJson).map((code, index) => {
    const [codeArr] = Object.entries(codesJson[code]);

    return (
      <Form.Check
        type="checkbox"
        className={styles.codes_item}
        id={`check-api-${code}`}
        key={index}
      >
        <Form.Check.Input
          type="checkbox"
          onChange={(e) => onCodeChecked(e)}
          value={codeArr[0]}
        />
        <Form.Check.Label className={styles.codes_label}>
          {codeArr[0]}
        </Form.Check.Label>
        <p className={styles.codes_description}>{codeArr[1]}</p>
      </Form.Check>
    );
  });

  return (
    <Modal
      show={isModalOpen}
      onHide={closeModal}
      backdrop="static"
      keyboard={false}
      dialogClassName="modal-90w"
      aria-labelledby="example-custom-modal-styling-title"
      size="xl"
      // className={styles.backdrop}
    >
      <Form>
        <Modal.Header closeButton>
          <Modal.Title>Добавление кодов</Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.modal}>
          <div className={styles.wrapper}>
            <p className={styles.subtitle}>Выберите коды.</p>
            {/* <Button variant="primary">Добавить</Button> */}
          </div>
          <div className={styles.codes_list}>{codeChecks}</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Закрыть
          </Button>
          <Button variant="primary" onClick={onSubmit} type="submit">
            Добавить
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
