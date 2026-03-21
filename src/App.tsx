import { Toaster } from "react-hot-toast";
import AppRouter from "@/routes/AppRouter";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { useEffect } from "react";
import { checkMe } from "./app/asyncThunk/auth";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkMe());
  }, [dispatch]);
  
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <AppRouter />
    </>
  );
}

export default App;
