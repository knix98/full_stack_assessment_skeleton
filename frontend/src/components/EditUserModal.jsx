import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useGetUsersForHomeQuery, useGetAllUsersQuery, useUpdateUsersForHomeMutation } from '../api/usersApi';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUsers, toggleSelectedUser } from '../store/homeSlice';
import { setShowErrorPage } from "../store/appSlice";

const EditUserModal = ({ homeId, homeName, onClose }) => {
  const dispatch = useDispatch();
  const { selectedUsers } = useSelector((state) => state.home);
  const { data: allUsers, isLoading: allUsersLoading, error: usersError } = useGetAllUsersQuery();
  const { data: homeUsers, isLoading: homeUsersLoading, error: homeUsersError } = useGetUsersForHomeQuery(homeId);
  const [updateUsers] = useUpdateUsersForHomeMutation();

  useEffect(() => {
    if (homeUsers && allUsers) {
      const associatedUserIds = homeUsers.map(user => user.id);
      dispatch(setSelectedUsers(associatedUserIds));
    }
  }, [homeUsers, allUsers, dispatch]);

  const handleSave = async () => {
    await updateUsers({ homeId, userIds: selectedUsers });
    onClose();
  };

  if (usersError || homeUsersError) {
    dispatch(setShowErrorPage(true));
    return null;
  }

  return (
    <div className="modal">
      <h2>Edit Users for {homeName}</h2>
      {allUsersLoading || homeUsersLoading ? (
        <Skeleton count={5} />
      ) : (
        <ul>
          {allUsers.map((user) => (
            <li key={user.id}>
              <input
                type="checkbox"
                checked={selectedUsers.includes(user.id)}
                onChange={() => dispatch(toggleSelectedUser(user.id))}
              />
              {user.username}
            </li>
          ))}
        </ul>
      )}
      {selectedUsers.length === 0 && <p style={{ color: 'red' }}>At least one user must be selected</p>}
      <button onClick={handleSave} disabled={selectedUsers.length === 0}>Save</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

EditUserModal.propTypes = {
  homeId: PropTypes.number.isRequired,
  homeName: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EditUserModal;