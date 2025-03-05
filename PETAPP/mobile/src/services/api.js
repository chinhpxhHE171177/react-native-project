// api.js
import axios from 'axios';
const IPv4_address = '192.168.2.39';
//const API_URL = 'http://192.168.1.137:9999/auth'; // Thay IP máy backend của bạn
//192.168.2.39
const API_URL = `http://${IPv4_address}:9999/auth`;
const API_BASE_URL = `http://${IPv4_address}:9999/api`;
const API_Doctors_URL = `http://${IPv4_address}:9999/doctors`;
//192.168.11.105


// --------------------------------- Register API ---------------------------------
export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

// --------------------------------- Login API ------------------------------------
export const loginUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/login`, userData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

//------------------------------------ User By ID ------------------------------------
export const fetchUserByID = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/user/${userId}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};
//------------------------------------ Update Profile User By ID ------------------------------------
export const fetchUpdateProfile = async (userId, userData) => {
    try {
        const response = await axios.put(`${API_URL}/profile/${userId}`, userData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

//------------------------------------ Change Password By ID ------------------------------------
export const fetchChangePassword = async (userId, oldPassword, newPassword) => {
    try {
        const response = await axios.put(`${API_URL}/change-password/${userId}`, { oldPassword, newPassword });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};



//--------------------------------- Doctors API ---------------------------------

export const fetchDoctors = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/doctors`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};


// --------------------------------- Get Doctor By UserID API ----------------------------------
export const fetchDoctorByUserID = async (userID) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/doctors/${userID}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

// --------------------------------- Update Doctor API -----------------------------------
export const fetchUpdatedDoctor = async (doctorID, doctorData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/update/${doctorID}`, doctorData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}

// --------------------------------- Review API ----------------------------------
export const fetchReviewsByDoctorID = async (doctorID) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/reviews/${doctorID}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

// --------------------------------- Add Review API -----------------------------------
export const submitReview = async (reviewData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/reviews/add`, reviewData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

// --------------------------------- Update Review API -----------------------------------
export const updateReview = async (reviewID, customerID, reviewData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/reviews/${reviewID}/${customerID}`, reviewData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}

// --------------------------------- Delete Review API -----------------------------------
export const deleteReview = async (reviewID, customerID) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/reviews/${reviewID}/${customerID}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}


// Get Top Doctors API
export const getDoctorTopReviews = async () => {
    try {
        const response = await axios.get(`${API_Doctors_URL}/recommended`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}

// Get Doctors With Total Reviews And Average Rating API
export const getDoctorsWithTotalReviewsAndAverageRating = async () => {
    try {
        const response = await axios.get(`${API_Doctors_URL}/with-reviews`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}




//------------------------------------------ Create Chat API --------------------------------------
export const createChat = async (userId, doctorId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/chat/createChat`, { userId, doctorId });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}

//-------------------------------------------------------- Check Chat API --------------------------------------------------------
export const checkChatExists = async (userID, doctorID) => {
    try {
        const response = await fetch(`${API_BASE_URL}/chat/checkChat/${userID}/${doctorID}`);
        const data = await response.json(); // Chuyển đổi sang JSON
        return data; // Trả về toàn bộ dữ liệu
    } catch (error) {
        console.error("Error checking chat:", error);
        return null;
    }
};


//-------------------------------------------- Send Message API ------------------------------------
export const sendMessage = async (msg) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/chat/sendMessage`, msg);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};


//-------------------------------------------- UnSent Message API ------------------------------------
export const deleteMessage = async (messageId, userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/chat/unsentMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messageId, userId }),
        });
        return await response.json();
    } catch (error) {
        console.error('Error deleting message:', error);
        return null;
    }
};


//--------------------------------------------- Get Messages BY ID API ----------------------------------------------
export const fetchMessages = async (chatId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/chat/getMessages/${chatId}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}



//------------------------------------------------- GET CHAT FOR USER API ---------------------------------------------
export const fetchChatForUser = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/chat/getChats/${userId}`);

        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}

//------------------------------------------------- GET CHAT FOR DOCTOR API ---------------------------------------------
export const fetchChatForDoctor = async (doctorId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/chat/getChatsForDoctor/${doctorId}`);

        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}


////------------------------------------------------- GET CHAT ALL API---------------------------------------------
export const fetchChatAlls = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/chat/getChats`);

        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}



//---------------------------------------------------- Delete Chat API ---------------------------------------------------
export const deleteChat = async (chatID) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/chat/deleteChat/${chatID}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}


//---------------------------------------------------- Categories API ----------------------------------------------------------
export const fetchServiceCategories = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/categories`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}

//------------------------------------------------------ Services API ------------------------------------------------------------
export const fetchPetCareServices = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/services`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}


//------------------------------------------------------ Recommended Services API ------------------------------------------------------------
export const fetchRecommendedServices = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/services/recommended`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}


//----------------------------------------------------- Service By Category API ------------------------------------------------------------
export const fetchServiceByCategory = async (categoryID) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/serviceByCategory/${categoryID}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}


//----------------------------------------------------- Service By ID API ------------------------------------------------------------
export const fetchServiceByID = async (serviceID) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/getServiceByID/${serviceID}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}


//------------------------------------------------------- Service Review API ---------------------------------------------------------------
export const fetchReviewsByServiceID = async (serviceID) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/service/reviews/${serviceID}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

// --------------------------------- Add Service Review API -----------------------------------
export const submitServiceReview = async (reviewData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/service/reviews/add`, reviewData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

// --------------------------------- Update Review API -----------------------------------
export const updateServiceReview = async (reviewID, userID, reviewData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/service/reviews/${reviewID}/${userID}`, reviewData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}

// --------------------------------- Delete Review API -----------------------------------
export const deleteServiceReview = async (reviewID, userID) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/service/reviews/${reviewID}/${userID}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}


//----------------------------------- Pets API --------------------------------------------
export const fetchAllPets = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/pets`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};



//------------------------------------ Pet By ID API --------------------------------------------------
export const fetchPetByID = async (petID) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/pet/${petID}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}

//------------------------------------ Pet By ID API --------------------------------------------------
export const fetchPetsForUser = async (userID) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/ownerPet/${userID}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}



//----------------------------------- Pet categories API --------------------------------------------
export const fetchPetCategories = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/pets/categories`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};


//-------------------------------------- ADD PET API ----------------------------------------------------------
// Hàm thêm thú cưng
export const addNewPet = async (petData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/pets/add`, petData);
        return response.data;
    } catch (error) {
        console.error('Failed to add pet:', error);
        throw error;
    }
};


// --------------------------------- Update PET API -----------------------------------
export const updatePet = async (petID, userID, petData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/pet/update/${petID}/${userID}`, petData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}



//----------------------------------- Scheduled API --------------------------------------------
export const fetchScheduled = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/appointments/scheduled`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

//----------------------------------- Scheduled For User API --------------------------------------------
export const fetchScheduledForUser = async (userID) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/appointments/scheduled/forUser/${userID}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

//----------------------------------- Scheduled For Doctor API --------------------------------------------
export const fetchScheduledForDoctor = async (doctorID) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/appointments/scheduled/forDoctor/${doctorID}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

//----------------------------------- Completed API --------------------------------------------
export const fetchCompleted = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/appointments/completed`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

//----------------------------------- Completed For User API --------------------------------------------
export const fetchCompletedForUser = async (userID) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/appointments/completed/forUser/${userID}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

//----------------------------------- Completed For Doctor API --------------------------------------------
export const fetchCompletedForDoctor = async (doctorID) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/appointments/completed/forDoctor/${doctorID}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

//----------------------------------- Cancelled API --------------------------------------------
export const fetchCancelled = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/appointments/cancelled`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

//----------------------------------- Cancelled For User API --------------------------------------------
export const fetchCancelledForUSer = async (userID) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/appointments/cancelled/forUser/${userID}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};



// Add Appointment API
export const fetchAddAppointment = async (appointmentData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/appointments/add`, appointmentData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

// Update Appointment API
export const fetchUpdateAppointment = async (scheduleID, appointmentData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/appointments/update/${scheduleID}`, appointmentData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};
//----------------------------------- Cancelled Appointment API --------------------------------------------
export const fetchCancelledAppointment = async (scheduleID) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/appointments/cancelled/${scheduleID}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};


//----------------------------------- Cancelled Appointment API --------------------------------------------
export const fetchApproveAppointment = async (scheduleID) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/appointments/approve/${scheduleID}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

//----------------------------------- Delete Appointment API --------------------------------------------
export const fetchDeleteAppointment = async (scheduleID) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/appointments/delete/${scheduleID}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};


//----------------------------------- Slot for doctor API --------------------------------------------
export const fetchSlotsForDoctor = async (doctorID) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/slots/doctor/${doctorID}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

//----------------------------------- Slot All for doctor API --------------------------------------------
export const fetchAllSlotsForDoctor = async (doctorID) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/slots/allForDoctor/${doctorID}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};


//----------------------------------- Add Slot API --------------------------------------------------
export const fetchAddSlot = async (slotData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/slots/create`, slotData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};


// Update an existing slot
export const fetchUpdateSlot = async (slotData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/slots/update`, slotData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};


// Cancel a slot (mark as unavailable)
export const fetchCancelSlot = async (slotID, doctorID) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/slots/cancel/${slotID}/${doctorID}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

// Active a slot (mark as available)
export const fetchActiveSlot = async (slotID, doctorID) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/slots/active/${slotID}/${doctorID}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};


// Delete a slot completely from the database
export const fetchDeleteSlot = async (slotID, doctorID) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/slots/remove/${slotID}/${doctorID}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

// ---------------------------------------------------- Favourites API -----------------------------------------------------
// Getl all favourites for a user by doctor 
export const fetchGetFavouritesByDoctor = async (UserID) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/favourites/doctor/${UserID}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};


// Getl all favourites for a user by pet
export const fetchGetFavouritesByPet = async (UserID) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/favourites/pet/${UserID}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

// Getl all favourites for a user by service
export const fetchGetFavouritesByService = async (UserID) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/favourites/service/${UserID}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};


// Get favourite ID by user ID and doctor ID
export const fetchGetFavouriteIDByUserIDAndDoctorID = async (UserID, DoctorID) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/favourites/doctorID/${UserID}/${DoctorID}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

//// Get favourite ID by user ID and PET ID
export const fetchGetFavouriteIDByUserIDAndPetID = async (UserID, PetID) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/favourites/petID/${UserID}/${PetID}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

//// Get favourite ID by user ID and Service ID
export const fetchGetFavouriteIDByUserIDAndServiceID = async (UserID, ServiceID) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/favourites/serviceID/${UserID}/${ServiceID}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

// Add favourite doctor by user ID
// Update the fetchAddFavouriteDoctor function
export const fetchAddFavouriteDoctor = async (UserID, DoctorID) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/addFavDoctor`, { UserID, DoctorID });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

// Add favourite pet by user ID
export const fetchAddFavouritePet = async (UserID, PetID) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/addFavPet`, { UserID, PetID });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

// Add favourite service by user ID
export const fetchAddFavouriteService = async (UserID, ServiceID) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/addFavService`, { UserID, ServiceID });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};


// Unfavourite by user ID and favourite ID
// Update the fetchUnfavourite function
export const fetchUnfavourite = async (UserID, FavouriteID) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/unfavourite`, {
            data: { UserID, FavouriteID } 
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};