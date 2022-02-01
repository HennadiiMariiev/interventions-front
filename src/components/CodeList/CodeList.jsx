import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button, Row, Col, Container, Spinner, Form } from 'react-bootstrap';

import api from '../../api/axios';
import { CodeTable } from './CodeTable';
import { toastMessage } from './../../helpers/toast.helper';
import styles from './styles.module.scss';

export function CodeList({ onCodeChange, isFetching }) {
  const [data, setData] = useState({ result: [], total: 0 });
  const [lastFive, setLastFive] = useState([]);
  const [isCurrentMonth, setIsCurrentMonth] = useState(false);

  useEffect(() => {
    const isCurMonthFromLocStor = localStorage.getItem('is_current_month');
    if (isCurMonthFromLocStor) {
      setIsCurrentMonth(isCurMonthFromLocStor === 'true' ? true : false);
    } else {
      localStorage.setItem('is_current_month', 'false');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('is_current_month', isCurrentMonth);
    document.querySelector('#switch-month').checked = isCurrentMonth;
  }, [isCurrentMonth]);

  useEffect(() => {
    async function fetchData() {
      try {
        const resAll = await api.get(`/interventions?is_current_month=${isCurrentMonth}`);
        const resLastFive = await api.get('/interventions/last_five');

        if (resAll.status === 200) {
          const { result, total } = resAll.data.data;
          setData((prev) => ({ ...prev, total, result }));
        }

        if (resLastFive.status === 200) {
          const { interventions } = resLastFive.data.data;
          setLastFive(interventions);
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
  }, [isFetching, onCodeChange, isCurrentMonth]);

  const refreshTable = async () => {
    onCodeChange(true);
  };

  const prepareCodeItems = useCallback((codes, itemName) => {
    if (!codes.length) {
      return <p className={styles.item}>-</p>;
    }

    return codes.map((item, index) => (
      <p key={index} className={styles.item}>
        {item[itemName]}
      </p>
    ));
  }, []);

  const resultTable = useMemo(() => {
    return data.result
      .map((elem, index) => (
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
      ))
      .filter((el, index) => (isCurrentMonth ? index === 0 : el));
  }, [data.result, prepareCodeItems, isCurrentMonth]);

  const prepareDate = (dateStr) => {
    const newDate = new Date(dateStr);
    return newDate.toLocaleString('ru', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const prepareLastFiveList = () => {
    return lastFive.map((el, index) => {
      return (
        <li className={styles.list_item} key={index}>
          <b>{el.code}</b>&nbsp;- {prepareDate(el.createdAt)}
        </li>
      );
    });
  };

  const codeTable = useMemo(() => <CodeTable data={resultTable} />, [resultTable]);

  return (
    <Container>
      <Row className="mb-2">
        <Col sm="6" md="4" className={styles.subtitle}>
          <h4 className="m-0">Список кодов</h4>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col sm="12" md="5">
          <h5>Последние добавленные</h5>
          <ul className={styles.last}>{!isFetching && prepareLastFiveList()}</ul>
        </Col>
        <Col
          sm="6"
          md="4"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            marginBottom: '1rem',
          }}
        >
          <Form className={styles.switch_month}>
            <Form.Check
              type="switch"
              id="switch-month"
              label="Tекущий месяц"
              onChange={() => {
                setIsCurrentMonth(!isCurrentMonth);
                onCodeChange(true);
              }}
            />
          </Form>
        </Col>
        <Col sm="12" md="3">
          <Button variant="primary" onClick={refreshTable}>
            Обновить
          </Button>
        </Col>
      </Row>
      {isFetching ? (
        <Spinner
          animation="border"
          variant="primary"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '2rem auto',
          }}
        />
      ) : (
        <>
          {codeTable}
          <h3>Всего кодов: {data.total}</h3>
        </>
      )}
    </Container>
  );
}
