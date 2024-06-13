import { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function MovieApp() {
  const API_URL = '/api/movies';
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [movieDetails, setMovieDetails] = useState({
    title: '',
    director: '',
    releaseYear: '',
    rating: ''
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    console.log("Fetching movies...");
    try {
      const response = await fetch(API_URL);
      console.log("Movies response:", response);
      let apiData = await response.json();
      console.log("Movies Data:", apiData);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setMovies(apiData);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const addMovie = async (movie) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movie),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchMovies();
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding movie:', error);
    }
  };

  const updateMovie = async (movie) => {
    try {
      const response = await fetch(`${API_URL}/${movie.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movie),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchMovies();
      setShowUpdateModal(false);
    } catch (error) {
      console.error('Error updating movie:', error);
    }
  };

  const deleteMovie = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchMovies();
    } catch (error) {
      console.error('Error deleting movie:', error);
    }
  };

  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
    setMovieDetails(movie);
    setShowUpdateModal(true);
  };

  const handleClearSelection = () => {
    setSelectedMovie(null);
    setMovieDetails({
      title: '',
      director: '',
      releaseYear: '',
      rating: ''
    });
    setShowUpdateModal(false);
    setShowAddModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMovieDetails({
      ...movieDetails,
      [name]: value
    });
  };

  const handleUpdateSubmit = () => {
    updateMovie({ ...movieDetails, id: selectedMovie.id });
  };

  const handleAddSubmit = () => {
    addMovie(movieDetails);
  };

  return (
    <Container className="App">
      <h1>Movie List</h1>
      <Button variant="success" onClick={() => setShowAddModal(true)}>Add Movie</Button>
      <Row>
        {movies.map((movie) => (
          <Col key={movie.id} xs={12} md={6} lg={3} className="mb-4">
            <div className="movie-item">
              <h2>{movie.title}</h2>
              <p>Director: {movie.director}</p>
              <p>Release Year: {movie.releaseYear}</p>
              <p>Rating: {movie.rating}</p>
              <Button variant="link" onClick={() => handleSelectMovie(movie)}>Edit</Button>
              {' '}
              <Button variant="link" onClick={() => deleteMovie(movie.id)}>Delete</Button>
            </div>
          </Col>
        ))}
      </Row>

      <Modal show={showUpdateModal} onHide={handleClearSelection}>
        <Modal.Header closeButton>
          <Modal.Title>Update Movie</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={movieDetails.title}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formDirector">
              <Form.Label>Director</Form.Label>
              <Form.Control
                type="text"
                name="director"
                value={movieDetails.director}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formReleaseYear">
              <Form.Label>Release Year</Form.Label>
              <Form.Control
                type="text"
                name="releaseYear"
                value={movieDetails.releaseYear}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formRating">
              <Form.Label>Rating</Form.Label>
              <Form.Control
                type="text"
                name="rating"
                value={movieDetails.rating}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleUpdateSubmit}>
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showAddModal} onHide={handleClearSelection}>
        <Modal.Header closeButton>
          <Modal.Title>Add Movie</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={movieDetails.title}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formDirector">
              <Form.Label>Director</Form.Label>
              <Form.Control
                type="text"
                name="director"
                value={movieDetails.director}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formReleaseYear">
              <Form.Label>Release Year</Form.Label>
              <Form.Control
                type="text"
                name="releaseYear"
                value={movieDetails.releaseYear}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formRating">
              <Form.Label>Rating</Form.Label>
              <Form.Control
                type="text"
                name="rating"
                value={movieDetails.rating}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleAddSubmit}>
              Add Movie
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default MovieApp;
