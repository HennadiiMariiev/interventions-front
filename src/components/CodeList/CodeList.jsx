import React, { useState, useEffect } from 'react';
import { Button, Form, Row, Col, Container, Spinner } from 'react-bootstrap';

import api from '../../api/axios';
import { toastMessage } from './../../helpers/toast.helper';

export function CodeList() {
  const [data, setData] = useState({ result: [], total: 0, isFetching: true });

  useEffect(async () => {
    try {
      const res = await api.get('/interventions');

      if (res.status === 200) {
        const { result, total } = res.data.data;
        console.log(result, total);
        setData((prev) => ({ ...prev, total, result, isFetching: false }));
        toastMessage('success', `Данные ${total} кодов успешно загружены`);
      }
    } catch (error) {
      toastMessage('error', `Ошибка: ${error.message}`);
    }
  }, []);

  const prepareItem = (codes) => {
    return codes.map((item) => (
      <div style={{ display: 'flex' }}>
        <p style={{ marginRight: '1rem' }}>{item.code}</p>
        <h5 style={{ marginRight: '1.5rem' }}>{item.amount}</h5>
      </div>
    ));
  };

  const prepareList = () => {
    if (data.result.length) {
      return data.result.map((elem, index) => (
        <li
          key={index}
          style={{
            border: '1px solid black',
            display: 'flex',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            padding: '1rem',
          }}
        >
          <div>
            <h5>{elem.month}</h5>
          </div>
          {prepareItem(elem.codes)}
        </li>
      ));
    }
  };

  return (
    <Container>
      <h5>Список кодов</h5>
      {data.isFetching ? (
        <Spinner
          animation="border"
          variant="primary"
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '2rem auto' }}
        />
      ) : (
        <ul style={{ padding: 0 }}>{prepareList()}</ul>
      )}
    </Container>
  );
}
