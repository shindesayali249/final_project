import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function SignUp() {
  const { handleSubmit, register } = useForm();
  const nav = useNavigate();
  const [step, setStep] = useState(1);

  async function registerUser(data) {
    data.profile_pic = data.profile_pic[0];
    { console.log(data); }
    try {
      const res = await axios.post('http://127.0.0.1:8000/signup/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.status === 201) {
        console.log('data saved', res);
        nav('/login/');
      }
    } catch (e) {
      console.log(e);
      alert('Something went wrong..!');
    }
  }

  function seePassword() {
    let signupForm = document.getElementById('signupForm');
    if (signupForm.password.getAttribute('type') === 'text') {
      signupForm.password.setAttribute('type', 'password');
    } else {
      signupForm.password.setAttribute('type', 'text');
    }
  }

  async function sendMail() {
    let email = document.querySelector('#email-Inp').value;
    if (email) {
      try {
        const res = await axios.post('http://127.0.0.1:8000/otp/', { email: email });
        if (res.status === 200) {
          alert('Otp Sent..!');
          console.log('otp sent', res);
          setStep(2);
        }
      } catch (e) {
        console.log(e);
        alert('Something went wrong..!');
      }
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-lg" style={{ width: '40%' }}>
        <div className="card-body">
          <h4 className="card-title text-center mb-4">SignUp Form</h4>
          <form onSubmit={handleSubmit(registerUser)} id="signupForm" className="row g-3" encType="multipart/form-data">
            {step === 1 ? (
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label">Email : <span className="text-danger">*</span></label>
                  <input
                    type="email"
                    {...register('email')}
                    id="email-Inp"
                    placeholder="Enter your email"
                    className="form-control"
                    required
                  />
                </div>
                <button type="button" onClick={sendMail} className="btn btn-outline-primary w-100">
                  Send OTP
                </button>
              </div>
            ) : (
              <>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Email : <span className="text-danger">*</span></label>
                    <input
                      type="email"
                      {...register('email')}
                      id="email-Inp"
                      placeholder="Enter your email"
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">OTP : <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      {...register('otp')}
                      placeholder="Enter OTP"
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Username : <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      {...register('username')}
                      placeholder="Enter your username"
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Password : <span className="text-danger">*</span></label>
                    <input
                      type="password"
                      {...register('password')}
                      placeholder="Enter your password"
                      className="form-control"
                      required
                    />
                    <input
                      type="checkbox"
                      id="seePw"
                      onChange={seePassword}
                      className="mt-2"
                    />{' '}
                    <label htmlFor="seePw" className="text-secondary">Show password</label>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">First Name : <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      {...register('first_name')}
                      placeholder="Enter your first name"
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Last Name : <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      {...register('last_name')}
                      placeholder="Enter your last name"
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Gender: <span className="text-danger">*</span></label>
                    <select {...register('gender')} className="form-control" required>
                      <option value="">Select Gender</option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                      <option value="O">Other</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Profile Picture :</label>
                    <input
                      type="file"
                      {...register('profile_pic')}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Address : <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      {...register('address')}
                      placeholder="Enter your address"
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Pincode : <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      {...register('pincode')}
                      placeholder="Enter your pincode"
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">City : <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      {...register('city')}
                      placeholder="Enter your city"
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Contact : <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      {...register('contact')}
                      placeholder="Enter your contact"
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="col-md-12 text-center">
                  <button className="btn btn-outline-success w-100 mt-3">SignUp</button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
