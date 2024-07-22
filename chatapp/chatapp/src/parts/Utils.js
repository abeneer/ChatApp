import React from "react";

// export const logout = (navigate) => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('username');
  
//     // Redirect to login page
//     navigate('/login');
// }

export const logout = (navigate) => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
};
