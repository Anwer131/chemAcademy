import axios from 'axios';

const API_URL = "https://chemacademy.onrender.com";
// const API_URL = "http://localhost:5000"

/* Get token from localStorage*/
const getToken = () => localStorage.getItem('token');

/**
 * AUTHENTICATION APIs
 */

// Fetch all users
export const fetchUsers = async () => {
  try {
    const res = await axios.get(`${API_URL}/users/all`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return res.data.users;
  } catch (error) {
    console.error('Fetch Users Error:', error);
    throw error;
  }
};

// Toggle admin status
export const toggleAdminStatus = async (userId, isAdmin) => {
  try {
    await axios.put(
      `${API_URL}/users/${userId}/toggle-admin`,
      { admin: !isAdmin },
      { headers: { Authorization: `Bearer ${getToken()}` } }
    );
  } catch (error) {
    console.error('Toggle Admin Error:', error);
    throw error;
  }
};

// Delete a user
export const deleteUser = async (userId) => {
  try {
    await axios.delete(`${API_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
  } catch (error) {
    console.error('Delete User Error:', error);
    throw error;
  }
};

/**
 * COURSES MANAGEMENT APIs
 */

// Fetch all courses
export const fetchCourses = async () => {
  try {
    const res = await axios.get(`${API_URL}/courses`,{
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Add a new course
export const addCourse = async (courseData) => {
  try {
    await axios.post(`${API_URL}/courses`, courseData, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
  } catch (error) {
    console.error('Add Course Error:', error);
    throw error;
  }
};

// Edit an existing course
export const editCourse = async (courseId, courseData) => {
  try {
    await axios.put(`${API_URL}/courses/${courseId}`, courseData, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
  } catch (error) {
    console.error('Edit Course Error:', error);
    throw error;
  }
};

//enroll in a course
export const enrollCourse = async (courseId) => {
  try {
    const res = await axios.post(`${API_URL}/courses/${courseId}/enroll`, {}, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    console.error('Error enrolling in course:', error);
    throw error;
  }
};
export const unenrollCourse = async (courseId) => {
  try{
    const res = await axios.delete(`${API_URL}/users/unenroll/${courseId}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    console.log(res.data);
} catch(error){
  if(error.response){
    return error.response.data;
  }
  console.log(error);
  throw error;
}
};


// Delete a course
export const deleteCourse = async (courseId) => {
  try {
    await axios.delete(`${API_URL}/courses/${courseId}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
  } catch (error) {
    console.error('Delete Course Error:', error);
    throw error;
  }
};

/**
 * BOOKS MANAGEMENT APIs
 */

// Fetch all books
export const fetchBooks = async () => {
  try {
    const res = await axios.get(`${API_URL}/books`,{
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return res.data;
  } catch (error) {
    console.error('Fetch Books Error:', error);
    throw error;
  }
};

// Add a new book
export const addBook = async (bookData) => {
  try {
    await axios.post(`${API_URL}/books`, bookData, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
  } catch (error) {
    console.error('Add Book Error:', error);
    throw error;
  }
};

// Delete a book
export const deleteBook = async (bookId) => {
  try {
    await axios.delete(`${API_URL}/books/${bookId}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
  } catch (error) {
    console.error('Delete Book Error:', error);
    throw error;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const formData = new FormData();

    // Add text fields to form data
    if (profileData.firstName) formData.append('firstName', profileData.firstName);
    if (profileData.lastName) formData.append('lastName', profileData.lastName);

    // Add profile picture if provided
    if (profileData.profilePic) formData.append('profilePic', profileData.profilePic);

    // Make API request
    const response = await axios.put(`${API_URL}/profile/update`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${getToken()}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};


// couse details:
export const fetchCourseDetails = async (courseCode) => {
  try {
    const response = await axios.get(`${API_URL}/courses/${courseCode}`,{
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching course details:', error);
    if (error.response && error.response.status === 404) {
      alert('Course not found');
    }
    throw error;
  }
};

//add book to a course
export const updateCourseBooks = async (courseCode, bookId) => {
  try {
    const response = await axios.post(`${API_URL}/courses/${courseCode}/${bookId}`,{
      headers:{
        Authorization: `Bearer ${getToken()}`
      }
    })
    alert(response.data.message);
  } catch (error) {
    console.log(error)
  }
  
}
export const addProfessor = async (professor) => {
  // try {
  //   const data = await axios.post(`${API_URL/api/addprov}`,professor,{
  //     headers: { Authorization: `Bearer ${getToken()}` },
  //   })
  // } catch (error) {
  //   console.log(error);
  // }
}

export const updateCoursePolicy = async (code, profInd, data) => {
  axios.put(`${API_URL}/courses/${code}/professors/${profInd}/policy`,data,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  )
  .then((response) => {
    alert(response.data.message);
  })
  .catch((err) => console.log(err));
}
export const submitFeedback = async (courseCode, professorIndex, feedbackData) => {
  const token = getToken();
  try {
    const response = await axios.post(
      `${API_URL}/courses/${courseCode}/${professorIndex}/feedback`,
      feedbackData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error submitting feedback:', error.response?.data || error.message);
    throw error;
  }
};