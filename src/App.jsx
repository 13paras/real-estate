import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Header from "./components/Header";
import ForgotPassword from "./pages/ForgotPassword";
import { Toaster } from "react-hot-toast";
import PrivateRoute from "./components/PrivateRoute";
import {
  Home,
  Offers,
  Profile,
  CreateListing,
  Category,
  Listing,
  EditListing,
  SignIn,
  SignUp,
  PageNotFound,
} from "./pages";

const App = () => {
  return (
    <div>
      <Router>
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/offers' element={<Offers />} />
          {/* Pvt route for profile */}
          <Route path='/profile' element={<PrivateRoute />}>
            <Route path='/profile' element={<Profile />} />
          </Route>
          {/* Pvt route for create listing */}
          <Route path='/create-listing' element={<PrivateRoute />}>
            <Route path='/create-listing' element={<CreateListing />} />
          </Route>
          <Route path='/category/:categoryName' element={<Category />} />
          <Route
            path='/category/:categoryName/:listingId'
            element={<Listing />}
          />
          <Route path='/edit-listing/:listingId' element={<PrivateRoute />}>
            <Route path='/edit-listing/:listingId' element={<EditListing />} />
          </Route>

          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </Router>
      <Toaster
        position='top-center'
        reverseOrder={false}
        gutter={8}
        containerClassName=''
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: "",
          duration: 5000,
          style: {
            background: "#363636",
            color: "#fff",
          },

          // Default options for specific types
          success: {
            duration: 3000,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },
        }}
      />
    </div>
  );
};

export default App;
