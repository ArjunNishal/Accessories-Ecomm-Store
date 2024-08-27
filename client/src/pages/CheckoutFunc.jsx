import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Userslist } from "../components/Userstest";
import { useDispatch, useSelector } from "react-redux";
import jwtDecode from "jwt-decode";
import { axiosInstance, stripeKey } from "../config";
import { loadStripe } from "@stripe/stripe-js";

export const CheckoutFunc = async ({lineItems}) => {

    // Stripe integration

    let stripePromise = null;
    const getStripe = () => {
        if (!stripePromise) {
            stripePromise = loadStripe(stripeKey)
        }
        return stripePromise;
    }

    const stripe = await getStripe();
    await stripe.redirectToCheckout({
        mode: "payment",
        lineItems,
        successUrl: `${window.location.origin}?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: window.location.origin

    })
}

