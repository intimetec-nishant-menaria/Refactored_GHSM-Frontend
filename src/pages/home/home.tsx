import { useEffect } from "react";
import Bookings from "@/components/Bookings/bookings";
import { useAppSelector } from "@/hooks/useAppSelector";
import toast from "react-hot-toast";
import Carousel from "@/components/common/carousel/Carousel";

function Home() {
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      const hasWelcomed = sessionStorage.getItem("welcomed");
      if (!hasWelcomed) {
        toast.success(`Welcome back, ${user.name}! 👋`, { duration: 3000 });
        sessionStorage.setItem("welcomed", "true");
      }
    }
  }, [user]);

  return (
    <div className="max-w-screen mx-auto space-y-8">
      <section>
        <Carousel />
      </section>
      <section>
        <Bookings />
      </section>
    </div>
  );
}

export default Home;
