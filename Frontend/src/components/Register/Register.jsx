/* eslint-disable react-hooks/rules-of-hooks */
import  { useState } from "react";
import axios from "../../api/api";
import { Form, Button, Alert } from "react-bootstrap";
import { Link, Navigate, useNavigate } from "react-router-dom";

const Register = () => {
  const isAuthenticated = !!localStorage.getItem("authToken");

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/register", formData);
      setMessage(response.data.message);
      setStatus(response.data.status);
      setFormData({ name: "", email: "", password: "" });
      navigate("/");

    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
      setStatus(400);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Register</h2>
      {message && <Alert variant={status === 200 ? "success" : "danger"}>{message}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your name"
            required
          />
        </Form.Group>
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
        <p>Have an account? <Link to={'/login'}>Login</Link></p>
        <Button className="w-75" variant="primary" type="submit">
          Register
        </Button>
      </div>
      </Form>
    </div>
  );
};

export default Register;
