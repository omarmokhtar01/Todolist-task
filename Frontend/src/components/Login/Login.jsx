/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import axios from "../../api/api";
import { Form, Button, Alert } from "react-bootstrap";
import { Link, Navigate, useNavigate } from "react-router-dom";

const Login = () => {
  const isAuthenticated = !!localStorage.getItem("authToken");

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/login", formData);
      const { access_token, message,user_id } = response.data;

      localStorage.setItem("authToken", access_token);
      
      localStorage.setItem("user_id", user_id.toString());


      setMessage(message);
      setStatus(200);

      navigate("/");
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
      setStatus(401);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      {message && <Alert variant={status === 200 ? "success" : "danger"}>{message}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            required
          />
        </Form.Group>
        <div className="text-center">
        <p>Not a member? <Link to={'/register'}>Register</Link></p>
        <Button className="w-75" variant="primary" type="submit">
          Login
        </Button>
      </div>
       
      </Form>
    </div>
  );
};

export default Login;
