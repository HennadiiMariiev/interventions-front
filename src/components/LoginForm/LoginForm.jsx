import React, { useState } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import api from '../../api/axios';
import { toastMessage } from './../../helpers/toast.helper';

const COLORS = { success: '#CAF1A9', error: '#DFD0BE' };

export function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [toast, setToast] = useState({ message: 'Login successfull', color: COLORS.success, show: false });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
          toastMessage('success', `Вы успешно вошли!`);
          setIsLoggedIn(true);
        }
      } catch (error) {
        toastMessage('error', `Неправильный email или пароль`);
        setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 5000);
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
        setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 5000);
      }
    }
  };

  const togglePassword = () => {
    const passwordInput = document.querySelector('#password');
    const type = passwordInput.type;
    passwordInput.type = type === 'text' ? 'password' : 'text';
  };

  return (
    <Form
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        padding: '1rem',
        backgroundColor: '#C8E6FF',
        borderBottom: '1px solid #C1DDF5',
      }}
      onSubmit={onSubmit}
    >
      <Row>
        <Col>
          <Form.Control
            type="email"
            placeholder="Почта"
            name="email"
            value={formData.email}
            onChange={onChange}
            disabled={isLoggedIn}
          />
        </Col>

        <Col>
          <Form.Control
            id="password"
            type="password"
            placeholder="Пароль"
            name="password"
            value={formData.password}
            onChange={onChange}
            disabled={isLoggedIn}
          />
        </Col>

        <Col>
          <Button variant="primary" style={{ marginRight: '1rem' }} onClick={togglePassword}>
            🧐
          </Button>
          <Button variant="primary" type="submit">
            {isLoggedIn ? 'Выйти' : 'Войти'}
          </Button>
        </Col>
      </Row>
    </Form>
  );
}
