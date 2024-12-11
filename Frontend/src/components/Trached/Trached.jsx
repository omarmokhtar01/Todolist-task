import { useState, useEffect } from "react";
import {
  createTask,
  updateTask,
  fetchTrashedTasks,
  forceDeleteTask,
  restoreTask,
} from "../../api/api";
import { Button, Table, Modal, Form, Row, Col } from "react-bootstrap";
import { Pagination } from "react-bootstrap";
import NavbarHead from "../Navbar";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Trached = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "pending",
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentTaskId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

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
    if (sortOrder === "asc") {
      return a.title.localeCompare(b.title);
    }
    return b.title.localeCompare(a.title);
  });

  useEffect(() => {
    const loadTasksTrached = async () => {
      try {
        const data = await fetchTrashedTasks();
        setTasks(data.data);
        console.log(data.data);

        setTotalPages(data.data.last_page);
      } catch (error) {
        console.log("Failed to load tasks:", error);
      } finally {
        setLoading(false);
      }
    };
    loadTasksTrached();
  }, [currentPage]);
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
      const data = await fetchTrashedTasks(currentPage);

      setTasks(data.tasks.data);
            setShowAddModal(false);
      setNewTask({ title: "", description: "", status: "pending" });
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const handleUpdateTask = async () => {
    try {
      // eslint-disable-next-line no-unused-vars
      const updatedTask = await updateTask(currentTaskId, newTask);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === currentTaskId ? { ...task, ...newTask } : task
        )
      );
      setShowEditModal(false);
      setNewTask({ title: "", description: "", status: "pending" });
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await forceDeleteTask(id);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleRestoreTask = async (id) => {
    try {
      await restoreTask(id);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Failed to restore task:", error);
    }
  };

  return (
    <>
      <NavbarHead />
      <div className="container mt-5">
        <Row>
          <Col>
            <input
              type="text"
              placeholder="Search tasks by title or description"
              value={searchQuery}
              onChange={handleSearchChange}
              className="mb-3 w-100 p-1"
            />
          </Col>
          <Col>
            <select
              onChange={handleSortChange}
              value={sortOrder}
              className="mb-3 w-100 p-1"
            >
              <option value="asc">Sort by Title (Ascending)</option>
              <option value="desc">Sort by Title (Descending)</option>
            </select>
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
                    onClick={() => handleRestoreTask(task.id)}
                    variant="success"
                    className="me-2"
                  >
                    Resotre
                  </Button>
                  <Button
                    onClick={() => handleDeleteTask(task.id)}
                    variant="danger"
                  >
                    Force Delete
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

export default Trached;
