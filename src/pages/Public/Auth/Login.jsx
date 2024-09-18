// import React from "react";
// import screenshot4 from "../../../assets/images/auth-img/screenshot4-2x.png";
// import screenshot3 from "../../../assets/images/auth-img/screenshot3-2x.png";
// import "../../../assets/css/auth.css";
// export default function Login() {
//   return (
//     <section className="h-screen w-full">
//       <div className="mt-8 flex items-center">
//         <div className="login-side-img bg-no-repeat w-[50%] h-screen bg-contain">
//           <img
//             src={screenshot3}
//             className="screenshotx2 absolute h-[524.84px]"
//           />
//         </div>
//         <div className="w-full md:w-1/2 px-8 py-10">
//           <div className="bg-white border border-gray-300 p-8 text-center rounded-md">
//             {/* Instagram Logo */}
//             <div className="mb-6">
//               <i className="insta-logo bg-no-repeat w-full h-16 block mx-auto"></i>
//             </div>

//             {/* Form */}
//             <div className="flex flex-col items-center gap-4">
//               <input
//                 type="text"
//                 placeholder="Phone number, username, or email"
//                 className="border border-gray-300 bg-gray-100 text-xs text-gray-500 w-[268px] h-[38px] px-3 focus:outline-none focus:border-gray-400"
//               />
//               <input
//                 type="password"
//                 placeholder="Password"
//                 className="border border-gray-300 bg-gray-100 text-xs text-gray-500 w-[268px] h-[38px] px-3 focus:outline-none focus:border-gray-400"
//               />
//               <button className="w-[268px] bg-blue-500 text-white text-sm py-2 rounded focus:outline-none hover:bg-blue-600">
//                 Log in
//               </button>
//             </div>

//             {/* Divider */}
//             <div className="flex items-center my-4">
//               <hr className="border-gray-300 w-full" />
//               <span className="px-2 text-xs text-gray-500">OR</span>
//               <hr className="border-gray-300 w-full" />
//             </div>

//             {/* Forgot password & Social login */}
//             <div className="text-blue-800 text-sm font-semibold mb-4">
//               <button className="hover:underline">Log in with Facebook</button>
//             </div>
//             <div className="text-xs text-gray-500 mb-6 hover:underline">
//               Forgot password?
//             </div>
//           </div>

//           {/* Sign up prompt */}
//           <div className="bg-white border border-gray-300 p-4 mt-4 text-center rounded-md">
//             <p className="text-sm">
//               Don't have an account?{" "}
//               <span className="text-blue-500 font-semibold hover:underline">
//                 Sign up
//               </span>
//             </p>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

import React from "react";
import screenshot4 from "../../../assets/images/auth-img/screenshot4-2x.png";
import screenshot3 from "../../../assets/images/auth-img/screenshot3-2x.png";
import "../../../assets/css/auth.css"; // Keep your custom styles if needed

export default function Login() {
  return (
    <section className="h-screen w-full flex justify-center items-center">
      <div className="flex items-center justify-center w-full max-w-6xl">
        {/* Left side: Image Preview */}
        <div className="relative hidden md:flex w-1/2 h-full items-center justify-center">
          <img
            src={screenshot3}
            className="absolute object-contain h-[524.84px] w-auto"
            alt="Instagram screenshot"
          />
        </div>
        <div className="w-full md:w-1/2 px-8 py-10">
          <div className="bg-white border border-gray-300 p-8 text-center rounded-md">
            {/* Instagram Logo */}
            <div className="mb-6">
              <i className="insta-logo bg-no-repeat w-full h-16 block mx-auto"></i>
            </div>

            {/* Form */}
            <div className="flex flex-col items-center gap-4">
              <input
                type="text"
                placeholder="Phone number, username, or email"
                className="border border-gray-300 bg-gray-100 text-xs text-gray-500 w-[268px] h-[38px] px-3 focus:outline-none focus:border-gray-400"
              />
              <input
                type="password"
                placeholder="Password"
                className="border border-gray-300 bg-gray-100 text-xs text-gray-500 w-[268px] h-[38px] px-3 focus:outline-none focus:border-gray-400"
              />
              <button className="w-[268px] bg-blue-500 text-white text-sm py-2 rounded focus:outline-none hover:bg-blue-600">
                Log in
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center my-4">
              <hr className="border-gray-300 w-full" />
              <span className="px-2 text-xs text-gray-500">OR</span>
              <hr className="border-gray-300 w-full" />
            </div>

            {/* Forgot password & Social login */}
            <div className="text-blue-800 text-sm font-semibold mb-4">
              <button className="hover:underline">Log in with Facebook</button>
            </div>
            <div className="text-xs text-gray-500 mb-6 hover:underline">
              Forgot password?
            </div>
          </div>

          {/* Sign up prompt */}
          <div className="bg-white border border-gray-300 p-4 mt-4 text-center rounded-md">
            <p className="text-sm">
              Don't have an account?{" "}
              <span className="text-blue-500 font-semibold hover:underline">
                Sign up
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
