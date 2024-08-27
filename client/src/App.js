import "./App.css";
import "./Dashboard/dashboard.css";
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Collections from "./pages/Collections";
import Productpage from "./pages/Productpage";
import Aboutus from "./pages/Aboutus";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Admin from "./Dashboard/pages/Admin";
import LoginForm from "./Dashboard/pages/Login";
import Productspage from "./Dashboard/pages/Productspage";
import Editproduct from "./Dashboard/components/products/Editproduct";
import Categories from "./Dashboard/pages/Categories";
import CouponAndOffers from "./Dashboard/pages/CouponAndOffers";
import Orders from "./Dashboard/pages/Orders";
import Protect from "./Protect";
import Profile from "./pages/Profile";
import Protectuser from "./Protectuser";
import Forgotpass from "./pages/Forgotpass";
import ResetPass from "./pages/Resetpass";
import PrivacyandTerms from "./pages/PrivacyandTerms";
import ReturnPolicy from "./pages/ReturnPolicy";
import TermsandConditions from "./pages/TermsandConditions";
import ShippingandPaymentInfo from "./pages/ShippingandPaymentInfo";
import Allproducts from "./pages/Allproducts";
import Allcategories from "./pages/Allcategories";
import CharmPage from "./Dashboard/pages/CharmPage";
import SearchResults from "./pages/SearchResults";
import Ordersuccess from "./pages/Ordersuccess";
import ScrollToTop from "./components/ScrollToTop";
import CheckoutForm from "./pages/CheckoutForm";
import Payment from "./pages/Payment";
import PenModelPage from "./Dashboard/pages/PenModelPage";
import PayementType from "./pages/PayementType";
import CashfreeType from "./pages/cashfree/CashfreeType";
// import ComboProductspage from "./Dashboard/pages/ComboProducts"

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collections/allproducts" element={<Allproducts />} />
        <Route path="/collections/:name" element={<Collections />} />
        <Route path="/productpage/:name" element={<Productpage />} />
        <Route path="/paymentType/:oid" element={<PayementType />} />
        {/* test */}
        {/* <Route path="/paycashfree/:oid" element={<CashfreeType />} /> */}
        <Route path="/about" element={<Aboutus />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login-register" element={<Login />} />
        <Route path="/forgotpassword" element={<Forgotpass />} />
        <Route path="/resetpassword/:id/:token" element={<ResetPass />} />
        <Route path="/privacy-policy" element={<PrivacyandTerms />} />
        <Route path="/return-policy" element={<ReturnPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsandConditions />} />
        <Route path="/allcategories" element={<Allcategories />} />
        <Route path="/search/:query" element={<SearchResults />} />
        <Route path="/payment" element={<Protectuser Component={Payment} />} />
        <Route
          path="/Shipping-and-PaymentInfo"
          element={<ShippingandPaymentInfo />}
        />
        <Route
          path="/profile/:id"
          element={<Protectuser Component={Profile} />}
        />
        <Route path="/order/success" element={<Ordersuccess />} />
        {/* <Route path="/cart" element={<Cart />} /> */}

        {/* dashboard */}
        <Route path="/adminlogin" element={<LoginForm />} />
        <Route path="/admin" element={<Protect Component={Admin} />} />
        <Route
          path="/products"
          element={<Protect Component={Productspage} />}
        />
        {/* <Route
          path="/combo-products"
          element={<Protect Component={ComboProductspage} />}
        /> */}
        <Route
          path="/viewproducts/:id"
          element={<Protect Component={Editproduct} />}
        />
        <Route
          path="/categories"
          element={<Protect Component={Categories} />}
        />
        <Route
          path="/coupons"
          element={<Protect Component={CouponAndOffers} />}
        />
        <Route path="/orders" element={<Protect Component={Orders} />} />
        <Route path="/charms" element={<Protect Component={CharmPage} />} />
        <Route
          path="/pen-models"
          element={<Protect Component={PenModelPage} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
