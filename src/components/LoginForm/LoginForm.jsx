import React, { useState, useEffect } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import api from '../../api/axios';
import { toastMessage } from './../../helpers/toast.helper';
import styles from './styles.module.scss';

export function LoginForm({ onCodeChange }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = localStorage.getItem('accessToken');

    if (refreshToken && accessToken) {
      setIsLoggedIn(true);
      toastMessage('success', `Вы успешно залогинены!`);
      api.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
    }
  }, []);

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      try {
        const res = await api.post('/users/login', {
          email: formData.email,
          password: formData.password,
        });

        if (res.status === 200) {
          localStorage.setItem('refreshToken', res.data.data.refreshToken);
          localStorage.setItem('accessToken', res.data.data.accessToken);

          // api.options
          api.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.data.accessToken;

          toastMessage('success', `Вы успешно вошли!`);
          setIsLoggedIn(true);
          onCodeChange();
        }
      } catch (error) {
        toastMessage('error', `Неправильный email или пароль`);
      }
    } else {
      try {
        const res = await api.post('/users/logout', {
          refreshToken: localStorage.getItem('refreshToken'),
        });

        if (res.status === 204) {
          localStorage.setItem('refreshToken', '');
          localStorage.setItem('accessToken', '');
          toastMessage('success', `Вы успешно вышли!`);
          setIsLoggedIn(false);
        }
      } catch (error) {
        toastMessage('error', `Неправильные данные`);
      }
    }
  };

  const togglePassword = () => {
    const passwordInput = document.querySelector('#password');
    const type = passwordInput.type;
    passwordInput.type = type === 'text' ? 'password' : 'text';
  };

  return (
    <Form className={styles.form} onSubmit={onSubmit}>
      <Row>
        <Col sm="6" md="4" className={styles.col}>
          <Form.Control
            type="email"
            placeholder="Почта"
            name="email"
            value={formData.email}
            onChange={onChange}
            disabled={isLoggedIn}
          />
        </Col>

        <Col sm="6" md="4" className={styles.col}>
          <Form.Control
            id="password"
            type="password"
            placeholder="Пароль"
            name="password"
            value={formData.password}
            onChange={onChange}
            disabled={isLoggedIn}
          />
          <Button variant="primary" onClick={togglePassword} className={styles.view}>
            🧐
          </Button>
        </Col>

        <Col sm="6" md="4">
          <Button variant="primary" type="submit">
            {isLoggedIn ? 'Выйти' : 'Войти'}
          </Button>
        </Col>
      </Row>
    </Form>
  );
}
