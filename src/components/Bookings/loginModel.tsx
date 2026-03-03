import { useNavigate } from "react-router-dom";
import Button from "../common/button/Button";

interface Props {
  setLoginModel: (state: boolean) => void;
}

function LoginModel({ setLoginModel }: Props) {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white rounded-lg shadow-lg w-80 sm:w-96 p-6 flex flex-col space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 text-center">
          Login Required
        </h2>
        <p className="text-sm text-gray-600 text-center">
          You need to login to book a room.
        </p>
        <div className="flex justify-end space-x-2 mt-2">
          <Button
            label="Cancel"
            onClick={() => setLoginModel(false)}
            className="bg-gray-200 w-15 hover:bg-gray-300 text-gray-800"
          />
          <Button
            label="Login"
            onClick={() => navigate("/login")}
            className="bg-blue-600 w-15 hover:bg-blue-700 text-white"
          />
        </div>
      </div>
    </div>
  );
}

export default LoginModel;