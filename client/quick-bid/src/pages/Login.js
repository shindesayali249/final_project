import { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../hooks/useAuth';
import { NavLink, useNavigate } from 'react-router-dom';
import { AI } from '../utils/AxiosInstance';

function Login() {
  const { register, handleSubmit } = useForm();
  const auth = useAuth();
  const nav = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);  // State to toggle password visibility

  async function loginHandler(data) {
    try {
      const response = await AI.post('/signin/', data);
      console.log(response);
      if (response.status === 200) {
        auth.setAccessToken(response?.data?.access);
        auth.setCSRFToken(response.headers['x-csrftoken']);

        async function verifyUser() {
          try {
            const res = await AI.get('/user/info/', {
              headers: {
                Authorization: `Bearer ${response?.data?.access}`,
              },
            });
            console.log(res);
            auth.setUser(res.data);
            auth.setLoggedIn(true);
          } catch (error) {
            console.log(error);
          }
        }
        await verifyUser();
        nav('/home/');
      }
    } catch (e) {
      console.log(e);
      alert('Something went wrong..!');
    }
  }

  function togglePasswordVisibility() {
    setPasswordVisible(!passwordVisible);
  }

  return (
    <div className="p-4 mt-5">
      <div
        className="mx-auto p-4 rounded shadow-lg"
        style={{
          width: '100%',
          maxWidth: '450px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
        }}
      >
        <h4 className="text-center mb-4 font-weight-bold">
          Login to Your Account
        </h4>
        <form onSubmit={handleSubmit(loginHandler)} id="loginForm" className="row g-3">
          <div className="col-md-12">
            <label className="form-label">Username :</label>
            <input
              type="text"
              {...register('username')}
              placeholder="Enter your username"
              className="form-control"
              required
            />
          </div>

          <div className="col-md-12">
            <label className="form-label">Password :</label>
            <div className="input-group">
              <input
                type={passwordVisible ? 'text' : 'password'}
                {...register('password')}
                placeholder="Enter your password"
                className="form-control"
                required
              />
              <span
                className="input-group-text"
                onClick={togglePasswordVisibility}
                style={{ cursor: 'pointer' }}
              >
                <i className={`fas ${passwordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </span>
            </div>

          </div>

          <div className="col-md-12 text-center mt-3">
            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </div>

          <div className="col-md-12 text-center mt-3">
            <button type="button" className="btn btn-link p-0">
              <NavLink to="/forgotpw/" className="text-decoration-none text-primary">
                Forgot Password?
              </NavLink>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
