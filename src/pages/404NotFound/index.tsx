import { useAppSelector } from '@/hooks/useAppSelector';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAppSelector(state => state.auth);

  if (location.pathname === "/" && user) {
    if (user?.role === "Admin" || user?.role === "Ops") {
      return <Navigate to="/admin/dashboard" />
    } else if (user?.role === "HR") {
      return <Navigate to="/hr/dashboard" />
    } else if (user?.role === "Guard") {
      return <Navigate to="/guard/dashboard" />
    }
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-layout px-6 py-24 sm:py-32 lg:px-8 relative overflow-hidden">
      <div className="text-center z-10">
        <p className="text-8xl font-black text-primary/20 tracking-tighter">404</p>
        
        <h1 className="mt-4 text-3xl font-black tracking-tight text-text-main sm:text-6xl">
          Page not found
        </h1>
        
        <p className="mt-6 text-base leading-7 text-text-muted font-medium max-w-md mx-auto">
          Sorry, we couldn’t find the page you’re looking for. 
          It might have been moved or the URL might be incorrect.
        </p>

        <div className="mt-10 flex items-center justify-center gap-x-6">
          <button
            onClick={() => navigate(-1)}
            className="rounded-xl bg-primary px-8 py-3 text-sm font-black uppercase tracking-widest text-surface shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all active:scale-95 cursor-pointer"
          >
            Go Back
          </button>
        </div>
      </div>

      <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6">
        <div
          className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-primary to-primary-hover opacity-10"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
    </div>
  );
};

export default NotFound;