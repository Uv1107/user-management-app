import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  useEffect(() => {
    handleSearch(searchQuery);
  });

  const fetchUsers = async (pageNumber) => {
    try {
      const response = await axios.get(`https://reqres.in/api/users?page=${pageNumber}`);
      setUsers(response.data.data);
      setFilteredUsers(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (query) => {
    if (!query) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter((user) =>
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredUsers(filtered);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://reqres.in/api/users/${id}`);
      const updatedUsers = users.filter(user => user.id !== id);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      alert('User deleted successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to delete user');
    }
  };

  const handleEdit = (user) => {
    navigate(`/edit-user/${user.id}`, { state: user });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="container mt-5">
      <h2>User List</h2>
      <button className="btn btn-secondary mb-3" onClick={handleLogout}>Logout</button>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="row">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div className="col-md-4 mb-3" key={user.id}>
              <div className="card">
                <img src={user.avatar} className="card-img-top" alt={`${user.first_name} ${user.last_name}`} />
                <div className="card-body">
                  <h5 className="card-title">{user.first_name} {user.last_name}</h5>
                  <p className="card-text">{user.email}</p>
                  <button className="btn btn-outline-secondary me-2" onClick={() => handleEdit(user)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(user.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No users found</p>
        )}
      </div>
      <div className="d-flex justify-content-between">
        <button
          className="btn btn-primary"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <button
          className="btn btn-primary"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UsersList;
