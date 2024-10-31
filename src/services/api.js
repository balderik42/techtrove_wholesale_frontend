import axios from 'axios';
const URL =  process.env.REACT_APP_API_URL || "http://localhost:8000";   

export const authenticateAddProduct = async (formData)=>{
    try {
        const response = await axios.post(`${URL}/addproduct`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response;
      } catch (error) {
        throw error;
      }
}

export const authenticateSignup = async (formData) => {
  try {
    const response = await axios.post(`${URL}/retailusersignup`, formData);
    return response.data; // Return the response data
  } catch (error) {
    console.error('Error while calling signup API:', error.response?.data || error.message);
    return null; // Return null or handle error as needed
  }
};

export const authenticateAddCategory = async (formData) => {
  try {
    const response = await axios.post(`${URL}/addcategory`, formData, { // Corrected endpoint
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchCategories = async () => {
  return await axios.get(`${URL}/categories`);
};


