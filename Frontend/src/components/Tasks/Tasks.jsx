import React, { useState, useEffect } from "react";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  fetchCategoriesApi,
} from "../../api/api";
import { Button, Table, Modal, Form, Row, Col } from "react-bootstrap";
import { Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";
import NavbarHead from "../Navbar";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "pending",
    categories_id: "",
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); 

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const filteredTasks = tasks.filter((task) => {
    return (
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const sortedTasks = filteredTasks.sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.title.localeCompare(b.title);
    }
    return b.title.localeCompare(a.title);
  });


  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchTasks(currentPage);
        setTasks(data.tasks.data);
        console.log(data.tasks);

        console.log(data.tasks.last_page);

        setTotalPages(data.tasks.last_page);
      } catch (error) {
        setError("Failed to load tasks:", error);
      }
      {
        setLoading(false);
      }
    };
    loadTasks();
  }, [currentPage]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategoriesApi();
        console.log(data);
        
        setCategories(data);
      } catch (error) {
        setError("Failed to load categories:", error);
      }
      {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  if (loading) {
    return <Skeleton count={15} height={50} borderRadius={10} enableAnimation />;
  }

  if (error) {
    return (
      <div className="text-center text-danger">
        <p>{error}</p>
      </div>
    );
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleAddTask = async () => {
    try {
       await createTask(newTask);
      const data = await fetchTasks(currentPage);

      setTasks(data.tasks.data);
      setShowAddModal(false);
      setNewTask({
        title: "",
        description: "",
        status: "pending",
        categories_id: "",
      });
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const handleUpdateTask = async () => {
    try {
      // eslint-disable-next-line no-unused-vars
      const updatedTask = await updateTask(currentTaskId, newTask);
      const data = await fetchTasks(currentPage);

      setTasks(data.tasks.data);
      setNewTask({
        title: "",
        description: "",
        status: "pending",
        categories_id: "",
      });
      setShowEditModal(false);

    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleEditModalShow = (task) => {
    setNewTask({
      title: task.title,
      description: task.description,
      status: task.status,
      categories_id: task.categories_id,
    });
    setCurrentTaskId(task.id);
    setShowEditModal(true);
  };

  const handleAddModalShow = () => {
    setShowAddModal(true);
  };

  return (
    <>
      <NavbarHead />
      <div className="container mt-5">
        <Row>
          <Col><input
        type="text"
        placeholder="Search tasks by title or description"
        value={searchQuery}
        onChange={handleSearchChange}
        className="mb-3 w-100 p-1"
      /></Col>
          <Col><select onChange={handleSortChange} value={sortOrder} className="mb-3 w-100 p-1">
        <option value="asc">Sort by Title (Ascending)</option>
        <option value="desc">Sort by Title (Descending)</option>
      </select></Col>

        </Row>
      

      
        <Row>
          <Col>
            <Button
              onClick={handleAddModalShow}
              variant="primary"
              className="mb-3 w-100"
            >
              Add Task
            </Button>
          </Col>
          <Col>
            <Link to="/trashed" className="w-auto">
              <Button variant="danger" className="mb-3 w-100">
                Trashed Tasks
              </Button>
            </Link>
          </Col>
        </Row>

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Description</th>
              <th>Category</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedTasks.map((task) => (
              <tr key={task.id}>
                <td>{task.id}</td>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{task.categories ? task.categories.name : "No category"}</td>
                <td>{task.status}</td>
                <td>
                  <Button
                    onClick={() => handleEditModalShow(task)}
                    variant="warning"
                    className="me-2"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteTask(task.id)}
                    variant="danger"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter task title"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter task description"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formStatus">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  as="select"
                  value={newTask.status}
                  onChange={(e) =>
                    setNewTask({ ...newTask, status: e.target.value })
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="formCategories">
                <Form.Label>Categories</Form.Label>
                <Form.Control
                  as="select"
                  value={newTask.categories_id}
                  onChange={(e) =>
                    setNewTask({ ...newTask, categories_id: e.target.value })
                  }
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  {categories?.length === 0 ? (
                    <option value="" disabled>
                      No categories available
                    </option>
                  ) : (
                    categories?.map((category) => (
                      <React.Fragment key={category.id}>
                        <option value={category.id}>{category.name}</option>
                      </React.Fragment>
                    ))
                  )}
                </Form.Control>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleAddTask}>
              Add Task
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formStatus">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  as="select"
                  value={newTask.status}
                  onChange={(e) =>
                    setNewTask({ ...newTask, status: e.target.value })
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="formCategories">
                <Form.Label>Categories</Form.Label>
                <Form.Control
                  as="select"
                  value={newTask.categories_id}
                  onChange={(e) =>
                    setNewTask({ ...newTask, categories_id: e.target.value })
                  }
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  {categories?.length === 0 ? (
                    <option value="" disabled>
                      No categories available
                    </option>
                  ) : (
                    categories?.map((category) => (
                      <React.Fragment key={category.id}>
                        <option value={category.id}>{category.name}</option>
                      </React.Fragment>
                    ))
                  )}
                </Form.Control>
              </Form.Group>








            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleUpdateTask}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
        <Pagination>
          <Pagination.Prev
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          />

          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}

          <Pagination.Next
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          />
        </Pagination>
      </div>
    </>
  );
};

export default Tasks;
