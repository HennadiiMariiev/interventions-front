import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Container, Spinner, Table } from 'react-bootstrap';

import api from '../../api/axios';
import { toastMessage } from './../../helpers/toast.helper';
import styles from './styles.module.scss';

export function CodeList({ onCodeChange, isFetching }) {
  const [data, setData] = useState({ result: [], total: 0 });

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get('/interventions');

        if (res.status === 200) {
          const { result, total } = res.data.data;
          setData((prev) => ({ ...prev, total, result }));
        }
      } catch (error) {
        toastMessage('error', `Ошибка: ${error.message}`);
      } finally {
        onCodeChange(false);
      }
    }

    if (isFetching) {
      fetchData();
    }
  }, [isFetching, onCodeChange]);

  const refreshTable = async () => {
    onCodeChange(true);
  };

  const prepareCodeItems = (codes, itemName) => {
    if (!codes.length) {
      return <p className={styles.item}>-</p>;
    }

    return codes.map((item, index) => (
      <p key={index} className={styles.item}>
        {item[itemName]}
      </p>
    ));
  };

  const prepareTable = () => {
    if (data.result.length) {
      return data.result.map((elem, index) => (
        <tbody key={index}>
          <tr rowSpan={elem.codes.length || 1}>
            <td className={styles.month}>{index + 1}</td>
            <td className={styles.month}>{elem.month.toUpperCase()}</td>
            <td className={styles.td}>{prepareCodeItems(elem.codes, 'code')}</td>
            <td>{prepareCodeItems(elem.codes, 'amount')}</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td>
              <b>Всего:</b>
            </td>
            <td>
              <b>{elem.total}</b>
            </td>
          </tr>
        </tbody>
      ));
    }
  };

  return (
    <Container>
      <Row className="mb-2">
        <Col sm="6" md="6" className={styles.subtitle}>
          <h4 className="m-0">Список кодов</h4>
        </Col>
        <Col>
          <Button variant="primary" onClick={refreshTable}>
            Обновить
          </Button>
        </Col>
      </Row>
      {isFetching ? (
        <Spinner
          animation="border"
          variant="primary"
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '2rem auto' }}
        />
      ) : (
        <>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>#</th>
                <th>Месяц</th>
                <th>Код</th>
                <th>Количество</th>
              </tr>
            </thead>
            {prepareTable()}
          </Table>
          <h3>Всего кодов: {data.total}</h3>
        </>
      )}
    </Container>
  );
}
