import { useForm } from 'react-hook-form';
import useAuth from '../hooks/useAuth';
import { NavLink, useNavigate } from 'react-router-dom';
import useAI2 from '../hooks/useAI2.js';
import useForceLogout from '../hooks/useForceLogout.js';

function DeleteUser() {
  const { register, handleSubmit } = useForm();
  const auth = useAuth();
  const nav = useNavigate();
  const AI2 = useAI2();
  const forceLogout = useForceLogout();

  async function DeleteUserAccount(data) {
    // Confirm deletion
    const isConfirmed = window.confirm("Are you sure you want to delete this user?");
    
    if (isConfirmed) {
      try {
        const response = await AI2.post('/deleteuser/', data);
        console.log(response);
        if (response.status === 200) {
          await forceLogout();
          nav("/login/");
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      console.log("Deletion canceled");
    }
  }

  return (
    <>
      <div className="p-3 mt-2">
        <div
          className="mx-auto p-4 ps-5 pe-5 rounded"
          style={{ width: '50%', background: 'rgb(170,240,170)' }}
        >
          <h4 className="text-center mb-3">Delete User Form</h4>
          <form onSubmit={handleSubmit(DeleteUserAccount)} id="loginForm" className="row g-3">
            <div className="col-md-6">
              <label className="form-label">
                Username : <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                {...register('username')}
                placeholder="username here.."
                className="form-control mb-2"
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">
                Password : <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                {...register('password')}
                placeholder="password here.."
                className="form-control mb-2"
                required
              />
            </div>

            <div className="col-md-12 text-center">
              <button type="submit" className="btn btn-outline-primary mt-3 col-4">
                Delete User
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default DeleteUser;
