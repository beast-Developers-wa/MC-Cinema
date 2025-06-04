// import React, { useState } from "react";
// import googleIcon from "./google-icon.png"; 

// const Signup = () => {
//   const [loading, setLoading] = useState(false);

//   const handleGoogleSignup = () => {
//     setLoading(true);

//     setTimeout(() => {
//       alert("Google Signup Clicked (No backend logic yet)");
//       setLoading(false);
//     }, 1000);
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
//         <h1 className="text-3xl font-bold mb-6 text-gray-800">Sign Up</h1>

//         <button
//           onClick={handleGoogleSignup}
//           aria-label="Sign up with Google"
//           disabled={loading}
//           className={`flex items-center justify-center gap-3 w-full px-6 py-3 border border-gray-300 rounded-md 
//                       transition duration-200 text-gray-700 font-medium 
//                       ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"}`}
//         >
//           <img
//             src={googleIcon}
//             alt="Google"
//             className="w-5 h-5"
//             onError={(e) => (e.target.style.display = "none")} // fallback if image fails
//           />
//           <span>{loading ? "Signing up..." : "Sign up with Google"}</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Signup;
