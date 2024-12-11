import { useEffect, useState } from "react";
import { Card, ListGroup, Button, Modal, Form } from "react-bootstrap";
import { fetchCategoriesApi, addCategoriesApi } from "../../api/api";
import NavbarHead from "../Navbar";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [modalError, setModalError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetchCategoriesApi();
        setCategories(response);
        
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handlers for modal and category form
  const handleModalClose = () => {
    setShowModal(false);
    setNewCategory("");
    setModalError(null);
  };

  const handleModalShow = () => setShowModal(true);

  const handleCategoryChange = (e) => setNewCategory(e.target.value);

  const handleAddCategory = async () => {
    if (!newCategory) {
      setModalError("Category name is required");
      return;
    }
  
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await addCategoriesApi({ name: newCategory });
     const data = await fetchCategoriesApi();
     setCategories(data)
     setShowModal(false);

    } catch (err) {
      console.error("Error adding category:", err.response?.data || err);
      setModalError(
        "Failed to add category: " + (err.response?.data?.message || err.message)
      );
    }
  };
  

  // Render loading, error, or categories list
  if (loading) return <Skeleton count={15} height={50} borderRadius={10} enableAnimation />;

  if (error) return <div className="text-center text-danger"><p>{error}</p></div>;


  return (
    <>
      <NavbarHead />
      <div>
        <Card className="shadow">
          <Card.Header as="h5" className="bg-primary text-white">
            Categories
            <Button
              variant="success"
              className="float-end"
              onClick={handleModalShow}
            >
              Add Category
            </Button>
          </Card.Header>
          <ListGroup variant="flush">
            {categories && categories.length > 0 ? (
              categories.map((category) =>
                category && category.id ? (
                  <ListGroup.Item key={category.id}>
                    {category ? category?.name : ""}
                  </ListGroup.Item>
                ) : null
              )
            ) : (
              <div>No categories available</div>
            )}
          </ListGroup>
        </Card>

        <Modal show={showModal} onHide={handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Category</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formCategoryName">
                <Form.Label>Category Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter category name"
                  value={newCategory}
                  onChange={handleCategoryChange}
                />
                {modalError && (
                  <Form.Text className="text-danger">{modalError}</Form.Text>
                )}
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleAddCategory}>
              Save Category
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default CategoriesList;
