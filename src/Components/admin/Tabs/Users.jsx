import { useCallback, useState, useEffect } from 'react';
import {
  Search,
  Edit,
  Trash2,
  User,
  MapPin,
  Briefcase,
  X,
  Save,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { PropTypes } from 'prop-types';
import { current } from '../../../utils';
import Fetch from '../../../utils/Fetch';

const ManageUsers = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [userCount, setUserCount] = useState(0);
  const [returnCount, setReturnCount] = useState(0);

  const fetchAllUsers = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const { data: response, error } = await Fetch({
        url: `${current}users?order=${sortOrder}&page=${page}&per_page=${perPage}`,
      });
      if (error) throw new Error('Failed to fetch users');
      setUsers(response?.data || []);
      setCurrentPage(response?.page_number);
      setTotalPages(response?.pages);
      setUserCount(response?.total);
      setReturnCount(response?.count);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [sortOrder, page, perPage]);

  const searchUsers = useCallback(async () => {
    if (!searchTerm.trim()) {
      setUsers([]);
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const { data: response, error } = await Fetch({
        url: `${current}landing/search?q=${encodeURIComponent(searchTerm)}&model=User`,
      });
      if (error) throw new Error('Failed to search users');
      setUsers(response?.data || []);
    } catch (err) {
      setError(err.message);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (activeTab === 'list') fetchAllUsers();
  }, [activeTab, fetchAllUsers]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (activeTab === 'search' && searchTerm.trim().length > 2) {
        searchUsers();
      }
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, searchUsers, activeTab]);

  const handleEdit = (user) => setEditingUser({ ...user });

  const handleSaveEdit = async () => {
    if (!editingUser) return;
    try {
      const { error } = await Fetch({
        url: `${current}users/update/?id=${editingUser.id}`,
        method: 'PUT',
        requestData: editingUser,
      });
      if (error) throw new Error('Failed to update user');
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? editingUser : u))
      );
      setEditingUser(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (userId) => {
    try {
      const { error } = await Fetch({
        url: `${current}users/${userId}`,
        method: 'DELETE',
      });
      if (error) throw new Error('Failed to delete user');
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setDeleteConfirm(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
            User Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Search, view, and manage users
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {['search', 'list'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-[#9f3248] text-[#9f3248]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'search' ? 'Search' : 'List'}
            </button>
          ))}
        </div>

        {/* SEARCH TAB */}
        {activeTab === 'search' && (
          <div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search users by name, business, or skill..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {isLoading && (
                <div className="mt-4 flex items-center justify-center py-6">
                  <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-sm text-gray-600">
                    Searching...
                  </span>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-start gap-2">
                <AlertTriangle
                  className="text-red-500 flex-shrink-0 mt-0.5"
                  size={18}
                />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {!isLoading && searchTerm && users.length === 0 && !error && (
              <div className="text-center py-12">
                <Search className="mx-auto text-gray-400 mb-3" size={40} />
                <h3 className="text-base font-medium text-gray-900 mb-1">
                  No users found
                </h3>
                <p className="text-sm text-gray-600">
                  Try adjusting your search terms
                </p>
              </div>
            )}

            {users.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <UserList
                  users={users}
                  handleEdit={handleEdit}
                  setDeleteConfirm={setDeleteConfirm}
                />
              </div>
            )}
          </div>
        )}

        {/* LIST TAB */}
        {activeTab === 'list' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* List header */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-base sm:text-xl font-semibold text-gray-900">
                All Users
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({userCount})
                </span>
              </h2>
              <button
                onClick={() =>
                  setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
                }
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                {sortOrder === 'asc' ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
                <span>{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
              </button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                <UserList
                  users={users}
                  handleEdit={handleEdit}
                  setDeleteConfirm={setDeleteConfirm}
                />
                <Pagination
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalPages={totalPages}
                  setPage={setPage}
                  itemsPerPage={perPage}
                  setItemsPerPage={setPerPage}
                  count={returnCount}
                  total={userCount}
                />
              </>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {editingUser && (
        <EditUserModal
          editingUser={editingUser}
          setEditingUser={setEditingUser}
          handleSaveEdit={handleSaveEdit}
        />
      )}
      {deleteConfirm && (
        <DeleteModal
          deleteConfirm={deleteConfirm}
          setDeleteConfirm={setDeleteConfirm}
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
};

// --- User List ---
const UserList = ({ users, handleEdit, setDeleteConfirm }) => (
  <div className="divide-y divide-gray-200">
    {users.map((user, index) => (
      <div
        key={user.id || index}
        className="p-4 sm:p-6 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-start justify-between gap-3">
          {/* User info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <User className="text-gray-400 flex-shrink-0" size={18} />
              <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                {`${user.first_name} ${user.last_name}`}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              <div className="flex items-center text-gray-600 min-w-0">
                <Briefcase className="mr-1.5 flex-shrink-0" size={14} />
                <span className="font-medium text-xs sm:text-sm whitespace-nowrap">
                  Username:
                </span>
                <span className="ml-1 text-xs sm:text-sm truncate">
                  {user.username || 'N/A'}
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="mr-1.5 flex-shrink-0" size={14} />
                <span className="font-medium text-xs sm:text-sm whitespace-nowrap">
                  Created:
                </span>
                <span className="ml-1 text-xs sm:text-sm">
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString()
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => handleEdit(user)}
              className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Edit User"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => setDeleteConfirm(user)}
              className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="Delete User"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
);

UserList.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      first_name: PropTypes.string,
      last_name: PropTypes.string,
      username: PropTypes.string,
      address: PropTypes.string,
    })
  ).isRequired,
  handleEdit: PropTypes.func.isRequired,
  setDeleteConfirm: PropTypes.func.isRequired,
};

// --- Edit Modal ---
const EditUserModal = ({ editingUser, setEditingUser, handleSaveEdit }) => (
  <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
    <div className="bg-white rounded-t-2xl sm:rounded-lg shadow-xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
          Edit User
        </h3>
        <button
          onClick={() => setEditingUser(null)}
          className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
        >
          <X size={22} />
        </button>
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        {['first_name', 'last_name', 'username', 'address'].map((field) => (
          <div key={field}>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
              {field.replace('_', ' ').toUpperCase()}
            </label>
            <input
              type="text"
              value={editingUser[field] || ''}
              onChange={(e) =>
                setEditingUser({ ...editingUser, [field]: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2 px-4 sm:px-6 py-4 border-t border-gray-200 sticky bottom-0 bg-white">
        <button
          onClick={() => setEditingUser(null)}
          className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveEdit}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-1.5 transition-colors"
        >
          <Save size={15} />
          Save Changes
        </button>
      </div>
    </div>
  </div>
);

EditUserModal.propTypes = {
  editingUser: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    username: PropTypes.string,
    address: PropTypes.string,
  }).isRequired,
  setEditingUser: PropTypes.func.isRequired,
  handleSaveEdit: PropTypes.func.isRequired,
};

// --- Delete Modal ---
const DeleteModal = ({ deleteConfirm, setDeleteConfirm, handleDelete }) => (
  <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
    <div className="bg-white rounded-t-2xl sm:rounded-lg shadow-xl w-full sm:max-w-md">
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-red-50 rounded-full flex-shrink-0">
            <AlertTriangle className="text-red-500" size={20} />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            Confirm Deletion
          </h3>
        </div>
        <p className="text-sm text-gray-600 mb-5">
          Are you sure you want to delete{' '}
          <strong>
            {deleteConfirm.first_name + ' ' + deleteConfirm.last_name}
          </strong>
          ? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setDeleteConfirm(null)}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => handleDelete(deleteConfirm.id)}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
);

DeleteModal.propTypes = {
  deleteConfirm: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    first_name: PropTypes.string,
    last_name: PropTypes.string,
  }).isRequired,
  setDeleteConfirm: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

// --- Pagination ---
const Pagination = ({
  currentPage,
  setCurrentPage,
  totalPages,
  setPage,
  itemsPerPage,
  setItemsPerPage,
  count,
  total,
}) => {
  const handlePrev = () => setPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));
  const handlePageChange = (e) => {
    setCurrentPage(e.target.value);
    setTimeout(() => setPage(e.target.value), 1000);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 sm:px-6 py-4 border-t border-gray-200">
      {/* Page controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className={`px-3 py-1.5 text-sm border rounded-md transition-colors ${
            currentPage === 1
              ? 'text-gray-400 cursor-not-allowed bg-gray-50'
              : 'text-blue-600 hover:bg-blue-50'
          }`}
        >
          Prev
        </button>
        <span className="text-sm text-gray-700">
          Page{' '}
          <input
            className="w-10 text-center border border-gray-300 rounded px-1 py-0.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            onChange={handlePageChange}
            type="number"
            value={currentPage}
            min={1}
            max={totalPages}
          />{' '}
          of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`px-3 py-1.5 text-sm border rounded-md transition-colors ${
            currentPage === totalPages
              ? 'text-gray-400 cursor-not-allowed bg-gray-50'
              : 'text-blue-600 hover:bg-blue-50'
          }`}
        >
          Next
        </button>
      </div>

      {/* Meta + per-page */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600">
        <span>
          Showing: <strong>{count}</strong>
        </span>
        <span>
          Total: <strong>{total}</strong>
        </span>
        <div className="flex items-center gap-1.5">
          <label className="text-xs text-gray-500 whitespace-nowrap">
            Per page:
          </label>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {[3, 5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  totalPages: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  setItemsPerPage: PropTypes.func.isRequired,
  count: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

export default ManageUsers;
