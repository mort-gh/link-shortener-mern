// libraries
import React, { useState, useEffect, useContext } from 'react';

// services
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';

// icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUserCircle } from '@fortawesome/free-solid-svg-icons';

const AuthPage = () => {
  const auth = useContext(AuthContext);
  const message = useMessage();
  const { loading, request, error, clearError } = useHttp();
  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => {
    message(error);
    clearError();
  }, [error, message, clearError]);

  useEffect(() => {
    window.M.updateTextFields();
  }, []);

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const registerHandler = async () => {
    try {
      const data = await request('/api/auth/register', 'POST', { ...form });
      message(data.message);
    } catch (error) {}
  };

  const loginHandler = async () => {
    try {
      const data = await request('/api/auth/login', 'POST', { ...form });
      message(data.message);
      auth.login(data.token, data.userId);
    } catch (error) {}
  };

  return (
    <div className='row'>
      <div className='col s6 offset-s3'>
        <h1 className='yellow accent-4 black-text auth_h1'>Link Shortener</h1>
        <div className='card'>
          <div className='card-content white-text'>
            <div>
              <div className='input-field'>
                <input
                  className='validate auth_input'
                  id='email'
                  type='email'
                  name='email'
                  value={form.email}
                  onChange={changeHandler}
                />
                <label className='auth_label' htmlFor='email'>
                  Email
                </label>
              </div>

              <div className='input-field'>
                <input
                  className='validate auth_input'
                  id='password'
                  type='password'
                  name='password'
                  value={form.password}
                  onChange={changeHandler}
                />
                <label className='auth_label' htmlFor='password'>
                  Password
                </label>
              </div>
            </div>
          </div>
          <div className='card-action auth_btns'>
            <button
              onClick={registerHandler}
              disabled={loading}
              className='btn waves-effect waves-light white black-text'
            >
              <FontAwesomeIcon icon={faUserPlus} className='auth_icon' />
              Sign up
            </button>
            or
            <button
              onClick={loginHandler}
              disabled={loading}
              className='btn waves-effect yellow accent-4 black-text'
            >
              <FontAwesomeIcon icon={faUserCircle} className='auth_icon' />
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
