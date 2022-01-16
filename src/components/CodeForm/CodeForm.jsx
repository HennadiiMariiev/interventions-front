import React, { useState } from 'react';
import { Button, Form, Row, Col, Container } from 'react-bootstrap';
import api from '../../api/axios';
import { toastMessage } from './../../helpers/toast.helper';
import styles from './styles.module.scss';

export function CodeForm({ onCodeChange }) {
  const [code, setCode] = useState({ text: '', id: null });
  const [addButtonDisabled, setAddButtonDisabled] = useState(true);
  const [undoButtonDisabled, setUndoButtonDisabled] = useState(true);

  const onChange = (e) => {
    const value = e.target.value;

    value.search(/(\d{5})\b/) ? setAddButtonDisabled(true) : setAddButtonDisabled(false);

    setCode((prev) => ({ ...prev, text: value }));
  };

  const undoAddition = async () => {
    if (code.id) {
      try {
        const res = await api.delete(`/interventions/${code.id}`);

        if (res.status === 204) {
          setCode((prev) => ({ ...prev, id: null }));
          toastMessage('success', `Код успешно удален`);
          setUndoButtonDisabled(true);

          onCodeChange();
        }
      } catch (error) {
        toastMessage('error', `Ошибка: ${error.message}`);
        setUndoButtonDisabled(true);
      }
    }
  };

  const addCode = async () => {
    if (code.text.trim()) {
      try {
        const res = await api.post('/interventions', {
          code: code.text,
          date: Date.now(),
        });

        if (res.status === 201) {
          const interventionId = res.data.data._id;
          setCode((prev) => ({ ...prev, id: interventionId, text: '' }));
          setAddButtonDisabled(true);
          setUndoButtonDisabled(false);
          toastMessage('success', `Код ${code.text} успешно добавлен`);

          onCodeChange();
        }
      } catch (error) {
        toastMessage('error', `Ошибка: ${error.message}`);
        setUndoButtonDisabled(true);
      }
    }
  };

  return (
    <Form className={styles.form}>
      <Container>
        <Row>
          <h4 className="mb-2">Добавление кода</h4>{' '}
        </Row>
        <Row>
          <Col sm="6" md="6" className={styles.col}>
            <Form.Control type="text" placeholder="Код" id="code" value={code.text} onChange={onChange} />
          </Col>

          <Col style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start' }}>
            <Button variant="primary" onClick={addCode} disabled={addButtonDisabled} style={{ marginRight: '1rem' }}>
              Добавить
            </Button>
            <Button variant="primary" onClick={undoAddition} disabled={undoButtonDisabled}>
              Отменить
            </Button>
          </Col>
        </Row>
      </Container>
    </Form>
  );
}
