import { Toaster } from "react-hot-toast";
import AppRouter from "@/routes/AppRouter";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { useEffect } from "react";
import { useGetUserDetailsQuery } from "./app/Api's/auth";
import { removeuser, setUser } from "./app/slices/auth";

function App() {
  const dispatch = useAppDispatch();
  const {data ,isLoading} = useGetUserDetailsQuery(undefined, {
    refetchOnMountOrArgChange: true, 
  });

  useEffect(() => {
    if(isLoading)return;
    if (data) {
        dispatch(setUser(data));  
    } else {
        dispatch(removeuser());
    }
  }, [data , isLoading]);
  
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <AppRouter />
    </>
  );
}

export default App;
