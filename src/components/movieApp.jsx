// Import necessary libraries and components from React and Bootstrap
import { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// Define the main MovieApp component
function MovieApp() {
  const API_URL = '/api/movies'; // URL for the movie API
  const [movies, setMovies] = useState([]); // State to store the list of movies
  const [selectedMovie, setSelectedMovie] = useState(null); // State to store the currently selected movie for editing
  const [showUpdateModal, setShowUpdateModal] = useState(false); // State to control the visibility of the update modal
  const [showAddModal, setShowAddModal] = useState(false); // State to control the visibility of the add modal
  const [movieDetails, setMovieDetails] = useState({
    title: '',
    director: '',
    releaseYear: '',
    rating: ''
  }); // State to store the details of a movie for adding or updating

  // Fetch the list of movies when the component mounts
  useEffect(() => {
    fetchMovies();
  }, []);

  // Function to fetch movies from the API
  const fetchMovies = async () => {
    console.log("Fetching movies...");
    try {
      const response = await fetch(API_URL); // Fetch movies from the API
      console.log("Movies response:", response);
      let apiData = await response.json(); // Parse the JSON response
      console.log("Movies Data:", apiData);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`); // Handle HTTP errors
      }

      setMovies(apiData); // Update the movies state with the fetched data
    } catch (error) {
      console.error('Error fetching movies:', error); // Log any errors
    }
  };

  // Function to add a new movie to the database
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
      fetchMovies(); // Refresh the list of movies
      setShowAddModal(false); // Close the add modal
    } catch (error) {
      console.error('Error adding movie:', error); // Log any errors
    }
  };

  // Function to update an existing movie in the database
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
      fetchMovies(); // Refresh the list of movies
      setShowUpdateModal(false); // Close the update modal
    } catch (error) {
      console.error('Error updating movie:', error); // Log any errors
    }
  };

  // Function to delete a movie from the database
  const deleteMovie = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchMovies(); // Refresh the list of movies
    } catch (error) {
      console.error('Error deleting movie:', error); // Log any errors
    }
  };

  // Handle selecting a movie for editing
  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie); // Set the selected movie state
    setMovieDetails(movie); // Populate the movieDetails state with the selected movie's details
    setShowUpdateModal(true); // Show the update modal
  };

  // Clear the current selection and close any open modals
  const handleClearSelection = () => {
    setSelectedMovie(null); // Clear the selected movie state
    setMovieDetails({
      title: '',
      director: '',
      releaseYear: '',
      rating: ''
    }); // Reset the movieDetails state
    setShowUpdateModal(false); // Close the update modal
    setShowAddModal(false); // Close the add modal
  };

  // Handle input changes in the form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target; // Get the name and value of the input field
    setMovieDetails({
      ...movieDetails,
      [name]: value
    }); // Update the movieDetails state with the new value
  };

  // Handle the form submission for updating a movie
  const handleUpdateSubmit = () => {
    updateMovie({ ...movieDetails, id: selectedMovie.id }); // Update the movie with the current details
  };

  // Handle the form submission for adding a new movie
  const handleAddSubmit = () => {
    addMovie(movieDetails); // Add a new movie with the current details
  };

  return (
    <Container className="App">
      <h1>Movie List</h1>
      <Button variant="success" onClick={() => setShowAddModal(true)}>Add Movie</Button> {/* Button to show the add movie modal */}
      <Row>
        {movies.map((movie) => (
          <Col key={movie.id} xs={12} md={6} lg={3} className="mb-4">
            <div className="movie-item">
              <h2>{movie.title}</h2> {/* Display the movie title */}
              <p>Director: {movie.director}</p> {/* Display the movie director */}
              <p>Release Year: {movie.releaseYear}</p> {/* Display the movie release year */}
              <p>Rating: {movie.rating}</p> {/* Display the movie rating */}
              <Button variant="link" onClick={() => handleSelectMovie(movie)}>Edit</Button> {/* Button to edit the movie */}
              {' '}
              <Button variant="link" onClick={() => deleteMovie(movie.id)}>Delete</Button> {/* Button to delete the movie */}
            </div>
          </Col>
        ))}
      </Row>

      {/* Modal for updating a movie */}
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

      {/* Modal for adding a new movie */}
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
