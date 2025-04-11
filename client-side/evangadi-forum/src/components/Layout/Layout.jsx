// import React from "react";
// import Header from "../Header/Header";
// import Footer from "../Footer/Footer";

// function Layout({ children }) {
//   return (
//     <div>
//       <Header />
//       {children}
//       <Footer />
//     </div>
//   );
// }

// export default Layout;

import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import "./Layout.css"; // Import the CSS file

function Layout({ children }) {
  return (
    <div className="layout-container">
      <Header />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;
