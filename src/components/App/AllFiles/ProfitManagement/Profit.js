import React, { useState, useEffect } from "react";
import { Table, Spinner, Alert } from "react-bootstrap";
import { API_URL } from "../../../../service";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(API_URL + "getAllBlogs");
        const result = await response.json();

        if (result.status === 200) {
          setBlogs(result.response);
        } else {
          setError("Failed to retrieve blogs.");
        }
      } catch (err) {
        setError("Error fetching blogs.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div>
      <h3 className="text-primary mb-4">Blogs</h3>
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && !error && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Description</th>
              <th>Link</th>
              <th>Button</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog._id}>
                <td>
                  <img src={API_URL + blog.image} alt={blog.title} width="100" />
                </td>
                <td>{blog.title}</td>
                <td>{blog.description}</td>
                <td>
                  <a href={blog.link} target="_blank" rel="noopener noreferrer">
                    {blog.link}
                  </a>
                </td>
                <td>
                  <a href={blog.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    {blog.blogbutton}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default BlogList;
