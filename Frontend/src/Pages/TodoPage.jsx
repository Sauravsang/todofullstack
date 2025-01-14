import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Button, Form, Row, Col, Card } from "react-bootstrap";
import toast, { useToaster } from "react-hot-toast";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import "../style/Todopage.css";

// import Loder from "../components/Loder";
import Loder2 from "../components/Loder2";
import { baseURL } from "../varibles";

const TodoPage = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [currentTodoId, setCurrentTodoId] = useState(null); // For updating a To-Do id

  const [autorender, setAutorender] = useState(0); // create delting and updating data fatch automatically

  // Fetch To-Do List from API
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/api/todo/getAllTodos`,
          { withCredentials: true }
        );

        if (response.data.success) {
          setTodos(response.data.todos);
          toast.success("To-Do list loaded successfully!");
        } else {
          toast.error("Failed to load To-Do list.");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching To-Do list:", error);
        toast.error(
          "Something went wrong while fetching the To-Do list. Please try again."
        );
        setLoading(false);
      }
    };

     const delayFetch = setTimeout(() => {
       fetchTodos();
     
     }, 1000); // Delay for 1 seconds (1000 ms)

     // Cleanup the timeout on component unmount or dependency change
     return () => clearTimeout(delayFetch);
  }, [autorender]);

  // Handle Create To-Do List Button Click
  const handleCreateList = () => {
    setShowForm(true); // Show the form when clicked
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  // handle for list updates
  const handleEdit = (todo) => {
    setFormData({ title: todo.title, description: todo.description });
    setCurrentTodoId(todo._id); // Set the current To-Do ID to update
    setShowForm(true); // Show the form to update the To-Do
  };
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // If updating a To-Do, use the PUT request instead of POST
      let response;
      if (currentTodoId) {
        response = await axios.put(
          `${baseURL}/api/todo/update/${currentTodoId}`, // API endpoint
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true, // If you need credentials (auth token, etc.)
          }
        );
      } else {
        response = await axios.post(
          `${baseURL}/api/todo/create`, // API endpoint
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true, // If you need credentials (auth token, etc.)
          }
        );
      }

      // Handle success response
      if (response.data.success) {
        toast.success(
          currentTodoId
            ? "To-Do item update successfully! "
            : " To-Do item create successfully!"
        );

        // setTodos((prevTodos) => [response.data.todo, ...prevTodos]);
        setFormData({ title: "", description: "" }); // Reset form data
        setShowForm(false); // Hide the form
        setAutorender((prves) => {
          return prves + 1;
        }); // Add the new To-Do item to the list automatically
      } else {
        toast.error("Failed to create To-Do item.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Error creating To-Do:", error);
    }
  };

  // Handle Delete To-Do List Button Click
  const handleDelete = async (todoId) => {
    try {
      const response = await axios.delete(
        `${baseURL}/api/todo/delete/${todoId}`, // API endpoint
        {
          withCredentials: true, // If you need credentials (auth token, etc.)
        }
      );
      if (response.data.success) {
        toast.success("To-Do item deleted successfully!");
        setAutorender((prves) => {
          return prves + 1;
        });
      }
    } catch (error) {
      toast.error("Failed to delete To-Do item.");
    }
  };

  return (
    <div className="custom-todo-container mt-5">
      <h2 className="custom-todo-heading">Create Your To-Do List</h2>

      <div className="custom-create-btn-container">
        <Button
          variant="primary"
          onClick={handleCreateList}
          className="custom-btn"
        >
          Create To-Do List
        </Button>
      </div>

      {showForm && (
        <Form onSubmit={handleSubmit} className="custom-todo-form">
          <Row className="custom-form-row">
            <Col md={6}>
              <Form.Group controlId="title">
                <Form.Label className="custom-form-label">Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="custom-form-control"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="description">
                <Form.Label className="custom-form-label">
                  Description
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Enter description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="custom-form-control"
                />
              </Form.Group>
            </Col>
          </Row>
          <div className="custom-submit-btn-container">
            <Button type="submit" variant="success" className="custom-btn">
              Save To-Do
            </Button>
          </div>
        </Form>
      )}

      {loading ? (
        <Loder2/>
      ) : (
        <Row className="custom-todo-list">
          {todos.length > 0 ? (
            todos.map((todo) => (
              <Col
                md={4}
                sm={6}
                xs={12}
                key={todo._id}
                className="custom-todo-item"
              >
                <Card className="custom-todo-card">
                  <Card.Body>
                    <Card.Title className="custom-todo-title">
                      {todo.title}
                    </Card.Title>
                    <Card.Text>{todo.description}</Card.Text>
                    <Card.Footer className="custom-todo-footer">
                      <small>
                        Created at: {new Date(todo.createdAt).toLocaleString()}
                      </small>
                    </Card.Footer>
                    <div className="custom-todo-actions">
                      <Button
                        variant="warning"
                        className="custom-btn custom-edit-btn"
                        onClick={() => handleEdit(todo)}
                      >
                        <FaEdit /> Edit
                      </Button>
                      <Button
                        variant="danger"
                        className="custom-btn custom-delete-btn"
                        onClick={() => handleDelete(todo._id)}
                      >
                        <FaTrashAlt /> Delete
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <div className="text-center">No To-Do items available.</div>
          )}
        </Row>
      )}
    </div>
  );
};

export default TodoPage;
