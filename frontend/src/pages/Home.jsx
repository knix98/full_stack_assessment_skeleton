import Skeleton from "react-loading-skeleton";
import { useSelector, useDispatch } from "react-redux";
import { useGetAllUsersQuery, useGetHomesForUserQuery } from "../api/usersApi";
import {
  setSelectedUserId,
  setCurrentPage,
  setSelectedHomeId,
  setShowModal,
} from "../store/homeSlice";
import { setShowErrorPage } from "../store/appSlice";
import EditUserModal from "../components/EditUserModal";
import Pagination from "../components/Pagination";

const Home = () => {
  const dispatch = useDispatch();
  const { selectedUserId, currentPage, selectedHomeId, showModal, homeName } =
    useSelector((state) => state.home);

  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
    // refetch: refetchUsers,
  } = useGetAllUsersQuery();
  let {
    data: homesData,
    isLoading: homesLoading,
    error: homesError,
    // refetch: refetchHomes,
  } = useGetHomesForUserQuery(
    { userId: selectedUserId, page: currentPage },
    { skip: !selectedUserId }
  );

  if (!selectedUserId) homesData = null;

  const totalPages = homesData
    ? Math.ceil(homesData.total / homesData.pageSize)
    : 1;

  const handleUserChange = (e) => {
    if (e.target.value === "select-user") dispatch(setSelectedUserId(null));
    else dispatch(setSelectedUserId(e.target.value));
  };

  const handleEditUsersClick = (home) => {
    dispatch(
      setSelectedHomeId({ homeId: home.id, homeName: home.street_address })
    );
    dispatch(setShowModal(true));
  };

  if (usersError || homesError) {
    dispatch(setShowErrorPage(true));
    return null;
  }

  return (
    <>
      <div className={`container ${showModal ? "blurry" : ""}`}>
        <h1>Homes For User</h1>
        <select onChange={handleUserChange} className="dropdown">
          <option value="select-user">Select User</option>
          {usersLoading ? (
            <Skeleton count={5} />
          ) : (
            users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))
          )}
        </select>

        <div className="home-list">
          {selectedUserId === null || homesLoading ? (
            <p>Nothing to show</p>
          ) : homesData && homesData.homes.length > 0 ? (
            homesData.homes.map((home) => (
              <div key={home.id} className="home-card">
                <h3>{home.street_address}</h3>
                <p>
                  {home.state}, {home.zip}
                </p>
                <p>Sqft: {home.sqft}</p>
                <p>Beds: {home.beds}</p>
                <p>Baths: {home.baths}</p>
                <p>Price: ${home.list_price}</p>
                <button
                  onClick={() => handleEditUsersClick(home)}
                  disabled={showModal}
                >
                  Edit Users
                </button>
              </div>
            ))
          ) : (
            <p>Nothing to show</p>
          )}
        </div>

        {/* Pagination */}
        {homesData && homesData.homes.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => dispatch(setCurrentPage(page))}
          />
        )}
      </div>

      {/* Edit User Modal */}
      {showModal && selectedHomeId && (
        <EditUserModal
          homeId={selectedHomeId}
          homeName={homeName}
          onClose={() => dispatch(setShowModal(false))}
        />
      )}
    </>
  );
};

export default Home;
