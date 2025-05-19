import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import log from "loglevel";
import AuthContext from "../../context/AuthContext";
import Button from "../common/Button";
import FormInput from "../common/FormInput";
import Spinner from "../layout/Spinner";

function Register() {
  const { register, loading } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await register({ name, email, password });
      log.info("Registration successful, navigating to dashboard");
      navigate("/");
    } catch (err) {
      setError(err.message);
      log.error("Register page error:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <FormInput
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Full Name"
        className="mb-4"
      />
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
      <FormInput
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm Password"
        className="mb-4"
      />

      <Button
        onClick={handleSubmit}
        disabled={loading || !name || !email || !password || !confirmPassword}
        className="w-full"
      >
        {loading ? <Spinner /> : "Register"}
      </Button>
    </div>
  );
}

export default Register;
