import React, { useState } from "react";
import { useSnackbar } from "notistack";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import InputField from "../components/commons/InputField";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [useEmail, setUseEmail] = useState(true);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = useEmail
        ? { email: identifier, password }
        : { username: identifier, password };

      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        payload
      );

      if (response.status === 200 && response.data?.data?.token) {
        console.log(response.data?.data?.token)
        sessionStorage.setItem("token", response.data.data.token);
        enqueueSnackbar(response.data.message, { variant: "success" });
        navigate("/dashboard");
      } else {
        enqueueSnackbar("Login sukses tapi data invalid", {
          variant: "warning",
        });
      }
    } catch (err: any) {
      enqueueSnackbar(
        err.response?.data?.message || "Terjadi kesalahan. Coba lagi nanti.",
        { variant: "error" }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="hero bg-base-200 min-h-screen flex items-center justify-center">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="card bg-base-100 w-full max-w-lg shadow-2xl p-8">
          <div className="card-body">
            <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

            {/* Toggle Login Method */}
            <div className="flex justify-center mb-4">
              <button
                className={`btn ${
                  useEmail ? "btn-neutral" : "btn-outline"
                } mx-1`}
                onClick={() => setUseEmail(true)}
              >
                Login with Email
              </button>
              <button
                className={`btn ${
                  !useEmail ? "btn-neutral" : "btn-outline"
                } mx-1`}
                onClick={() => setUseEmail(false)}
              >
                Login with Username
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <InputField
                  label={useEmail ? "Email" : "Username"}
                  name={useEmail ? "email" : "username"}
                  type={useEmail ? "email" : "text"}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  // required
                />
              </div>

              <div>
                <InputField
                  label="Password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  // required
                />
              </div>

              <button
                type="submit"
                className="btn btn-neutral w-full mt-4"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
