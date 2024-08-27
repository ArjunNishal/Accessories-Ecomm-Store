import { axiosInstance } from "../../config";
import store from "../../store";

export const addUser = (userData) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        // Token not set, so return without dispatching the action
        return;
      }
      const cart = store.getState().cartReducer.carts;
      console.log(cart, "state cart");
      const payload = cart;
      // console.log(userData._id,userData.data._id,"userdata")
      dispatch({
        type: "ADD_USER",
        payload: userData,
      });

      try {
        const response = await axiosInstance.get(
          `cart/getcart/${userData.data._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          // if (response.data.items.length > 0) {
          // console.log("cart get success");
          dispatch(mergeCartItems(payload));
          // }
        }
      } catch (error) {
        console.log(error);
        if (error.response.data.error === "no cart found") {
          const token = localStorage.getItem("token");
          const response = await axiosInstance.post(
            "cart/createcart",
            {
              userId: userData.data._id,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(response, "cart response actions page 2");
          // if (response.data.items && response.data.items.length > 0) {
          console.log("no cart found , created neew cart");
          dispatch(mergeCartItems(payload));
          // }
        }
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };
};

export const ADD = (itemData) => {
  return async (dispatch) => {
    try {
      console.log(itemData.multipleImage);
      // Create a serialized version of itemData to be used in the Redux reducer
      const serializedItemData = {
        ...itemData,
        singleImage: itemData.singleImage ? itemData.singleImage : null,
        multipleImage: itemData.multipleImage
          ? itemData.multipleImage.map((file) => file)
          : null,
      };

      const token = localStorage.getItem("token");

      // Dispatch the serialized version of itemData to the Redux reducer
      dispatch({
        type: "ADD_CART",
        payload: serializedItemData,
      });
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };
};

// remove items
// decrease quntity
export const decQuantity = (itemData) => {
  return async (dispatch) => {
    try {
      // Make API request to reduce item in cart
      console.log("dec started");
      const token = localStorage.getItem("token");
      dispatch({
        type: "RMV_CART",
        payload: itemData,
      });
      if (token) {
        await axiosInstance.post("cart/reduce", itemData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      // Dispatch the RMV_CART action with the item data
    } catch (error) {
      console.error("Error reducing item in cart:", error);
    }
  };
};

// remove item from cart
export const Removeitem = (itemData) => {
  return async (dispatch) => {
    try {
      console.log("delete cart started", itemData);
      // Make API request to delete item from cart
      const token = localStorage.getItem("token");
      dispatch({
        type: "DLT_CART",
        payload: itemData,
      });
      if (token) {
        await axiosInstance.post("cart/delete", itemData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      // Dispatch the DLT_CART action with the item data
    } catch (error) {
      console.error("Error deleting item from cart:", error);
    }
  };
};

export const mergeCartItems = (data) => {
  return async (dispatch) => {
    try {
      console.log("mergestarted", data);
      const token = localStorage.getItem("token");
      const response = await axiosInstance.post("cart/update", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        const res = response.data.data.items;
        console.log(res, response.data.data);
        console.log("merge dispatched");
        dispatch({ type: "MERGE_CART_ITEMS", payload: res });
      } else {
        throw new Error("Failed to update cart");
      }
    } catch (error) {
      console.error(error);
    }
  };
};

// export const mergeCartItems = (data) => {
//   // console.log(data, "actions merge");
//   return {
// type: "MERGE_CART_ITEMS",
// payload: data,
//   };
// };

export const clearCartAndUser = () => {
  return {
    type: "CLEAR_CART",
  };
};
