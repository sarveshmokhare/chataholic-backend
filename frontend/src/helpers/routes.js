// export const backendUrl = 'http://localhost:8000';
export const backendUrl = 'https://chataholic.onrender.com';

export const serverRoute = backendUrl + '/api'

export const loginRoute = serverRoute + '/auth/login'
export const signupRoute = serverRoute + '/auth/signup'
export const sendMessageRoute = serverRoute + '/message/send'
export const removeUserFromRoomRoute = serverRoute + '/room/removeUser'
export const getUsersInRoomRoute = serverRoute + '/room/users/room'
export const createRoomRoute = serverRoute + '/room/create'
export const addUserToRoomRoute = serverRoute + '/room/addUser'
export const getUserDataRoute = serverRoute + '/user'
export const getRoomsForAUserRoute = serverRoute + '/room/users'
export const getAllMessagesInARoomRoute = serverRoute + '/message/room'
export const getRoomDataFromIDRoute = serverRoute + '/room'