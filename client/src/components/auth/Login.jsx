import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import log from "loglevel";
import AuthContext from "../../context/AuthContext";
import Button from "../common/Button";
import FormInput from "../common/FormInput";
import Spinner from "../layout/Spinner";

function Login() {
  const { login, loading } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await login(email, password);
      log.info("Login successful, navigating to dashboard");
      navigate("/");
    } catch (err) {
      setError(err.message);
      log.error("Login page error:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <FormInput
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="mb-4"
      />
      <FormInput
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="mb-4"
      />
      <Button
        onClick={handleSubmit}
        disabled={loading || !email || !password}
        className="w-full"
      >
        {loading ? <Spinner /> : "Login"}
      </Button>
    </div>
  );
}

export default Login;
