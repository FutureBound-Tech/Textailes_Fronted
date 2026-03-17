import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../redux/slices/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, token } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => {
    if (token) navigate('/admin');
  }, [token, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(adminLogin(form));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Admin Login</h1>
          <p className="text-sm text-slate-500">Access the Textail dashboard</p>
        </div>
        <label className="space-y-2 text-sm font-medium text-slate-700 block">
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
            required
          />
        </label>
        <label className="space-y-2 text-sm font-medium text-slate-700 block">
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
            required
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Signing in…' : 'Sign in'}
        </button>
        {error && <p className="text-sm text-rose-600">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
