const cartData = localStorage.getItem("cart");
const cartexists = JSON.parse(cartData);

const INIT_STATE = { carts: cartexists, user: null };

const cartReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case "ADD_USER":
      return {
        ...state,
        user: action.payload.data,
      };

    case "ADD_CART":
      console.log(action.payload, "reducer data");
      if (!state || !state.carts) {
        // If the item doesn't exist in the cart, add it with a quantity of 1
        console.log("add cart running");
        const newItem = {
          ...action.payload,
          quantity: 1,
          totalPrice: parseFloat(action.payload.discount),
        };

        if (newItem.giftWrap) {
          newItem.totalPrice += 50; // Add 50rs for gift wrapping
        }
        if (newItem.longname) {
          newItem.totalPrice += 20; // Add 50rs for gift wrapping
        }
        if (newItem.longname2) {
          newItem.totalPrice += 40; // Add 50rs for gift wrapping
        }

        const updatedCarts = [newItem];

        // Update localStorage after adding an item to the cart
        localStorage.setItem("cart", JSON.stringify(updatedCarts));

        return {
          ...state,
          carts: updatedCarts,
        };
      }
      if (action.payload.productType === "combo") {
        const currentDate = new Date();
        const isoDateString = currentDate.toISOString();
        const newItem = {
          ...action.payload,
          quantity: 1,
          date: isoDateString,
          totalPrice: parseFloat(action.payload.discount),
        };

        if (newItem.giftWrap) {
          newItem.totalPrice += 50; // Add 50rs for gift wrapping
        }
        if (newItem.longname) {
          newItem.totalPrice += 20; // Add 50rs for gift wrapping
        }
        if (newItem.longname2) {
          newItem.totalPrice += 40; // Add 50rs for gift wrapping
        }

        const updatedCarts = [...state.carts, newItem];

        // Update localStorage after adding an item to the cart
        localStorage.setItem("cart", JSON.stringify(updatedCarts));

        return {
          ...state,
          carts: updatedCarts,
        };
      }

      const existingItemIndex = state.carts.findIndex((el) => {
        // Parse JSON strings of file data
        const multipleImage = el.multipleImage
          ? el.multipleImage.map((file) => file)
          : null;

        const areMultipleImagesEqual =
          multipleImage &&
          action.payload.multipleImage &&
          multipleImage.length === action.payload.multipleImage.length &&
          multipleImage.every((image, index) => {
            return image === action.payload.multipleImage[index];
          });
        console.log(
          el.selectedCharm,
          typeof el.selectedCharm,
          action.payload.selectedCharm,
          typeof action.payload.selectedCharm
        );
        return (
          el._id === action.payload._id &&
          el.mobilename === action.payload.mobilename &&
          el.nameOnProduct === action.payload.nameOnProduct &&
          el.specialInstructions === action.payload.specialInstructions &&
          el.giftWrap === action.payload.giftWrap &&
          el.nameOnProduct1 === action.payload.nameOnProduct1 &&
          el.nameOnProduct2 === action.payload.nameOnProduct2 &&
          el.selectedCharm === action.payload.selectedCharm &&
          el.selectedmodel === action.payload.selectedmodel &&
          el.selectedfont === action.payload.selectedfont &&
          ((el.color &&
            action.payload.color &&
            el.color.shade === action.payload.color.shade) ||
            !el.color === !action.payload.color) &&
          (areMultipleImagesEqual || areMultipleImagesEqual === null) &&
          (el.singleImage === action.payload.singleImage ||
            (el.singleImage === action.payload.singleImage) === "null")
        );
      });

      if (existingItemIndex !== -1) {
        console.log(existingItemIndex, "existingItemIndex");
        const updatedCarts = state.carts.map((el, index) => {
          console.log(index, "===", existingItemIndex);
          if (index === existingItemIndex) {
            let totalPrice =
              el.totalPrice + parseFloat(action.payload.discount);
            if (action.payload.giftWrap) {
              totalPrice += 50; // Add 50rs for gift wrapping
            }
            if (action.payload.longname) {
              totalPrice += 20; // Add 50rs for gift wrapping
            }
            if (action.payload.longname2) {
              totalPrice += 40; // Add 50rs for gift wrapping
            }

            return {
              ...el,
              quantity: el.quantity + 1,
              totalPrice: totalPrice,
            };
          } else {
            return el;
          }
        });

        // Update localStorage after modifying the cart
        localStorage.setItem("cart", JSON.stringify(updatedCarts));

        return {
          ...state,
          carts: updatedCarts,
        };
      } else {
        // If the item doesn't exist in the cart, add it with a quantity of 1
        const newItem = {
          ...action.payload,
          quantity: 1,
          totalPrice: parseFloat(action.payload.discount),
        };

        if (newItem.giftWrap) {
          newItem.totalPrice += 50; // Add 50rs for gift wrapping
        }
        if (newItem.longname) {
          newItem.totalPrice += 20; // Add 50rs for gift wrapping
        }
        if (newItem.longname2) {
          newItem.totalPrice += 40; // Add 50rs for gift wrapping
        }

        const updatedCarts = [...state.carts, newItem];

        // Update localStorage after adding an item to the cart
        localStorage.setItem("cart", JSON.stringify(updatedCarts));

        return {
          ...state,
          carts: updatedCarts,
        };
      }

    case "RMV_CART":
      const {
        _id,
        quantity,
        discount,
        nameOnProduct,
        specialInstructions,
        giftWrap,
      } = action.payload;
      console.log(action.payload);
      // Convert singleImage and multipleImage to their names for comparison
      const serializedItemData = {
        ...action.payload,
        singleImage: action.payload.singleImage
          ? action.payload.singleImage
          : null,
        multipleImage: action.payload.multipleImage
          ? action.payload.multipleImage.map((file) => file)
          : null,
      };

      if (quantity === 1) {
        const matchingItemIndex = state.carts.findIndex((el) => {
          const areMultipleImagesEqual =
            el.multipleImage &&
            serializedItemData.multipleImage &&
            el.multipleImage.length ===
              serializedItemData.multipleImage.length &&
            el.multipleImage.every((image, index) => {
              return image === serializedItemData.multipleImage[index];
            });
          console.log(el.multipleImage, serializedItemData.multipleImage);
          return (
            el._id === _id &&
            el.mobilename === serializedItemData.mobilename &&
            el.nameOnProduct === nameOnProduct &&
            el.specialInstructions === specialInstructions &&
            el.giftWrap === giftWrap &&
            el.nameOnProduct1 === serializedItemData.nameOnProduct1 &&
            el.nameOnProduct2 === serializedItemData.nameOnProduct2 &&
            el.selectedCharm === serializedItemData.selectedCharm &&
            el.selectedmodel === serializedItemData.selectedmodel &&
            el.selectedfont === serializedItemData.selectedfont &&
            ((el.color &&
              serializedItemData.color &&
              el.color.shade === serializedItemData.color.shade) ||
              !el.color === !serializedItemData.color) &&
            (areMultipleImagesEqual ||
              areMultipleImagesEqual === null ||
              !areMultipleImagesEqual) &&
            (el.singleImage === serializedItemData.singleImage ||
              (el.singleImage === serializedItemData.singleImage) === "null" ||
              !serializedItemData.singleImage)
          );
        });

        if (matchingItemIndex !== -1) {
          const filteredCarts = state.carts.filter(
            (_, index) => index !== matchingItemIndex
          );

          // Update localStorage after removing an item from the cart
          localStorage.setItem("cart", JSON.stringify(filteredCarts));

          return {
            ...state,
            carts: filteredCarts,
          };
        }
      } else {
        const updatedCarts = state.carts.map((el) => {
          const areMultipleImagesEqual =
            el.multipleImage &&
            serializedItemData.multipleImage &&
            el.multipleImage.length ===
              serializedItemData.multipleImage.length &&
            el.multipleImage.every((image, index) => {
              return image === serializedItemData.multipleImage[index];
            });
          console.log(el.color, serializedItemData.color);
          if (
            el._id === serializedItemData._id &&
            el.mobilename === serializedItemData.mobilename &&
            el.nameOnProduct === serializedItemData.nameOnProduct &&
            el.specialInstructions === serializedItemData.specialInstructions &&
            el.giftWrap === serializedItemData.giftWrap &&
            el.nameOnProduct1 === serializedItemData.nameOnProduct1 &&
            el.nameOnProduct2 === serializedItemData.nameOnProduct2 &&
            el.selectedCharm === serializedItemData.selectedCharm &&
            el.selectedmodel === serializedItemData.selectedmodel &&
            el.selectedfont === serializedItemData.selectedfont &&
            (el.color.shade === serializedItemData.color.shade ||
              (!serializedItemData.color && !el.color)) &&
            (areMultipleImagesEqual || areMultipleImagesEqual === null) &&
            (el.singleImage === serializedItemData.singleImage ||
              (el.singleImage === null &&
                serializedItemData.singleImage === null) ||
              !serializedItemData.singleImage) // Check if both are null
          ) {
            let totalPrice;
            if (el.giftwrap) {
              totalPrice = el.totalPrice - discount - 50;
            } else {
              totalPrice = el.totalPrice - discount;
            }
            return {
              ...el,
              quantity: el.quantity - 1,
              totalPrice: totalPrice,
            };
          }
          return el;
        });
        // Update localStorage after modifying the cart
        localStorage.setItem("cart", JSON.stringify(updatedCarts));
        return {
          ...state,
          carts: updatedCarts,
        };
      }

    case "DLT_CART":
      const product = action.payload;
      if (product.productType === "Single") {
        const serializedProduct = {
          ...product,
          singleImage: product.singleImage ? product.singleImage : null,
          multipleImage: product.multipleImage
            ? product.multipleImage.map((file) => file)
            : null,
        };
        console.log(serializedProduct);
        // Find the index of the matching item
        const matchingIndex = state.carts.findIndex((el) => {
          const areMultipleImagesEqual =
            el.multipleImage &&
            serializedProduct.multipleImage &&
            el.multipleImage.length ===
              serializedProduct.multipleImage.length &&
            el.multipleImage.every((image, index) => {
              return image === serializedProduct.multipleImage[index];
            });
          console.log(el.color, serializedProduct.color);
          const idMatch = el._id === serializedProduct._id;
          const nameMatch =
            el.nameOnProduct === serializedProduct.nameOnProduct;
          const instructionsMatch =
            el.specialInstructions === serializedProduct.specialInstructions;
          const giftWrapMatch = el.giftWrap === serializedProduct.giftWrap;

          return (
            idMatch &&
            nameMatch &&
            instructionsMatch &&
            el.mobilename === serializedProduct.mobilename &&
            giftWrapMatch &&
            ((el.color &&
              serializedProduct.color &&
              el.color.shade === serializedProduct.color.shade) ||
              !el.color === !serializedProduct.color) &&
            el.nameOnProduct1 === serializedProduct.nameOnProduct1 &&
            el.nameOnProduct2 === serializedProduct.nameOnProduct2 &&
            el.selectedCharm === serializedProduct.selectedCharm &&
            el.selectedmodel === serializedProduct.selectedmodel &&
            el.selectedfont === serializedProduct.selectedfont &&
            (areMultipleImagesEqual || areMultipleImagesEqual === null) &&
            (el.singleImage === serializedProduct.singleImage ||
              el.singleImage === null ||
              (!el.singleImage && !serializedProduct.singleImage))
          );
        });

        if (matchingIndex !== -1) {
          // Create a new array without the matching item
          console.log(matchingIndex);
          const filteredCarts = state.carts.filter(
            (_, index) => index !== matchingIndex
          );

          // Update localStorage after filtering the cart
          localStorage.setItem("cart", JSON.stringify(filteredCarts));

          return {
            ...state,
            carts: filteredCarts,
          };
        }
      } else {
        // Find the index of the matching item
        const matchingIndex = state.carts.findIndex((el, index) => {
          console.log(el.date, product.date);
          // Replace the condition below with your logic to match the index of the product you want to remove
          return el.date === product.date; // Replace `indexToRemove` with the actual index
        });

        if (matchingIndex !== -1) {
          // Create a new array without the matching item
          const filteredCarts = state.carts.filter(
            (_, index) => index !== matchingIndex
          );

          // Update localStorage after filtering the cart
          localStorage.setItem("cart", JSON.stringify(filteredCarts));

          return {
            ...state,
            carts: filteredCarts,
          };
        }
      }

      return state; // If no matching index is found, return the current state

    case "MERGE_CART_ITEMS":
      console.log(action.payload, "merge reducer started");
      const mergedItems = action.payload.map((item) => {
        const commonfields = {
          ...item.product,
          giftWrap: item.giftWrap,
          quantity: item.quantity,
          totalPrice: item.quantity * item.product.discount,
          color: item.color,
        };

        if (item.product.productType === "Single") {
          return {
            ...item.product,
            ...commonfields,
            singleImage: item.singleImage,
            nameOnProduct: item.nameOnProduct,
            selectedCharm: item.selectedCharm,
            specialInstructions: item.specialInstructions,
            nameOnProduct1: item.nameOnProduct1,
            nameOnProduct2: item.nameOnProduct2,
            singleImage: item.singleImage,
            selectedmodel: item.selectedmodel,
            selectedfont: item.selectedfont,
            multipleImage: item.multipleImage,
            mobilename: item.mobilename,
          };
        } else {
          return {
            ...item.product,
            ...commonfields,
            ...item.inputValues,
            date: item.date,
          };
        }
      });

      console.log("to be mergedItems == ", mergedItems, "||");
      console.log(mergedItems, "cart");
      return {
        ...state,
        carts: mergedItems,
      };

    case "CLEAR_CART":
      const filteredCarts = [];
      localStorage.setItem("cart", JSON.stringify(filteredCarts));
      return {
        carts: [],
      };

    default:
      return state;
  }
};

export default cartReducer;
// console.log(
//   el.multipleImage,"||||",
//   el._id === action.payload._id,
//   "||||",
//   el.nameOnProduct === action.payload.nameOnProduct,
//   "||||",
//   el.specialInstructions === action.payload.specialInstructions,
//   "||||",
//   el.giftWrap === action.payload.giftWrap,
//   "||||",
//   el.nameOnProduct1 === action.payload.nameOnProduct1,
//   "||||",
//   el.nameOnProduct2 === action.payload.nameOnProduct2,
//   "||||",
//   el.selectedCharm === action.payload.selectedCharm,
//   "||||",
//   el.selectedmodel === action.payload.selectedmodel,
//   "||||",
//   el.selectedfont === action.payload.selectedfont,
//   "||||",
//   el.color === action.payload.color,
//   "||||",
//   areMultipleImagesEqual,
//   "||||",
//   el.singleImage === action.payload.singleImage ||
//     (el.singleImage === action.payload.singleImage) === "null"
// );
