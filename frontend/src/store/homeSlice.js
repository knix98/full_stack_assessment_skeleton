import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showErrorPage: false,
  selectedUserId: null,
  currentPage: 1,
  selectedHomeId: null,
  showModal: false,
  homeName: null,
  selectedUsers: [],
};

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setShowErrorPage(state, action) {
      state.showErrorPage = action.payload;
    },
    setSelectedUserId(state, action) {
      state.selectedUserId = action.payload;
      state.currentPage = 1; // Reset page when user changes
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    setSelectedHomeId(state, action) {
      state.selectedHomeId = action.payload.homeId;
      state.homeName = action.payload.homeName;
    },
    setShowModal(state, action) {
      state.showModal = action.payload;
    },
    setSelectedUsers(state, action) {
      state.selectedUsers = action.payload;
    },
    toggleSelectedUser(state, action) {
      const userId = action.payload;
      if (state.selectedUsers.includes(userId)) {
        state.selectedUsers = state.selectedUsers.filter(id => id !== userId);
      } else {
        state.selectedUsers.push(userId);
      }
    },
  },
});

export const {
  setShowErrorPage,
  setSelectedUserId,
  setCurrentPage,
  setSelectedHomeId,
  setShowModal,
  setSelectedUsers,
  toggleSelectedUser,
} = homeSlice.actions;

export default homeSlice.reducer;