const multer = require("multer");
const Cart = require("../models/Cart");
const User = require("../models/usersSchema");
const nodemailer = require("nodemailer");
const Image = require("../models/Images");
const constants = require("../constants");

// Configure the email transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: constants.adminEmail,
    pass: constants.adminmailpass,
  },
});

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/cartimages/"); // Set the destination folder for uploaded images
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for each uploaded image
    // const currentDateTime = Date.now();
    const originalName = file.originalname.split(".")[0];
    const extension = file.originalname.split(".").pop();
    // const uniqueFilename = `${originalName}_${currentDateTime}.${extension}`;
    const uniqueFilename = `${originalName}.${extension}`;
    console.log(file, uniqueFilename, "file");
    cb(null, uniqueFilename);
  },
});

const upload = multer({ storage: storage });

// get cartitems of an user
const getCartItems = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(userId, "userid");
    const cartItems = await Cart.findOne({ user: userId }).populate(
      "items.product"
    );
    if (!cartItems) {
      return res.status(500).send("no cart found");
    }
    if (cartItems.length === 0) {
      return res.status(500).send("no items in the cart");
    }
    res.status(200).json(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// create new cart of an user
const createCart = async (req, res) => {
  try {
    const { userId } = req.body;

    const newCart = new Cart({
      user: userId,
      items: [],
    });
    await newCart.save();

    res.status(200).json({ message: "Cart created successfully" });
  } catch (error) {
    console.error("Error creating cart:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// upload images for customizations
const uploadimage = async (req, res) => {
  try {
    const singleImage = req.files["singleImage"]
      ? req.files["singleImage"][0].filename
      : null;
    const multipleImages = req.files["multipleImage"]
      ? req.files["multipleImage"].map((file) => file.filename)
      : [];
    console.log(singleImage, multipleImages, "imgd");
    const imageDocs = [];

    if (singleImage) {
      const singleImageDoc = new Image({
        name: singleImage,
      });
      imageDocs.push(singleImageDoc);
    }
    for (const filename of multipleImages) {
      const multipleImageDoc = new Image({
        name: filename,
      });
      imageDocs.push(multipleImageDoc);
    }
    const savedImageDocs = await Image.insertMany(imageDocs);
    console.log(savedImageDocs);
    res.status(200).json({
      multipleImageDocs: savedImageDocs.filter(
        (doc) => doc.name !== singleImage
      ),
      singleImageDoc: savedImageDocs.find((doc) => doc.name === singleImage),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// add new item to the cart
const addItemToCart = async (req, res) => {
  try {
    const {
      _id,
      nameOnProduct,
      selectedCharm,
      specialInstructions,
      giftWrap,
      color,
      nameOnProduct1,
      nameOnProduct2,
      selectedmodel,
      selectedfont,
      multipleImage,
      singleImage,
      productType,
      inputValues,
      mobilename,
    } = req.body;
    const userId = req.user;
    console.log(req.body, "body add ");
    const cart = await Cart.findOne({ user: userId });
    const colorObj = {
      name: color.name,
      shade: color.shade,
    };

    if (productType === "Single") {
      console.log("single");
      if (!cart) {
        // If the user does not have a cart, create a new cart and add the item
        const newCart = new Cart({
          user: userId,
          items: [
            {
              product: _id,
              nameOnProduct,
              selectedCharm,
              specialInstructions,
              giftWrap,
              color: colorObj,
              nameOnProduct1,
              nameOnProduct2,
              singleImage: singleImage,
              selectedmodel,
              selectedfont,
              multipleImage: multipleImage,
              quantity: 1,
              mobilename,
            },
          ],
        });

        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
      } else {
        // If the user already has a cart, check if the item exists
        const existingItem = cart.items.find((item) => {
          const areMultipleImagesEqual =
            item.multipleImage &&
            multipleImage &&
            item.multipleImage.length === multipleImage.length &&
            item.multipleImage.every((image, index) => {
              console.log(image, "===", multipleImage[index]);
              return image === multipleImage[index];
            });
          console.log(
            typeof item.giftWrap,
            "===",
            typeof giftWrap,
            areMultipleImagesEqual
          );

          return (
            item.product.toString() === _id &&
            item.nameOnProduct === nameOnProduct &&
            item.mobilename === mobilename &&
            item.specialInstructions === specialInstructions &&
            item.giftWrap === giftWrap &&
            item.nameOnProduct1 === nameOnProduct1 &&
            item.nameOnProduct2 === nameOnProduct2 &&
            item.selectedCharm === selectedCharm &&
            item.selectedmodel === selectedmodel &&
            item.selectedfont === selectedfont &&
            ((item.color && color && item.color.shade === color.shade) ||
              !color === !item.color) &&
            (areMultipleImagesEqual ||
              areMultipleImagesEqual === null ||
              areMultipleImagesEqual === undefined ||
              !areMultipleImagesEqual) &&
            (item.singleImage === singleImage ||
              (!item.singleImage && !singleImage))
          );
        });

        if (existingItem) {
          // If the item exists, increase its quantity
          existingItem.quantity += 1;
        } else {
          // console.log(existingItem, giftWrap, "exisiting item add toc art api");
          console.log(nameOnProduct, "not exists");
          // If the item does not exist, add it to the cart with a quantity of 1
          cart.items.push({
            product: _id,
            nameOnProduct,
            selectedCharm,
            specialInstructions,
            giftWrap,
            color: colorObj,
            nameOnProduct1,
            nameOnProduct2,
            singleImage: singleImage,
            selectedmodel,
            selectedfont,
            multipleImage: multipleImage,
            quantity: 1,
            mobilename,
          });
        }

        // Save the updated cart
        const updatedCart = await cart.save();
        res.status(200).json(updatedCart);

        // let count = 1;
        // setInterval(() => {
        //   console.log(count);
        //   count++;
        // }, 1000);
        // setTimeout(() => {
        //   emailnotify(userId);
        // }, 2 * 1000);

        setTimeout(() => {
          emailnotify(userId);
        }, 2 * 60 * 60 * 1000); // 2 hours

        setTimeout(() => {
          emailnotify(userId);
        }, 24 * 60 * 60 * 1000); // 24 hours

        setTimeout(() => {
          emailnotify(userId);
        }, 3 * 24 * 60 * 60 * 1000); // 3 days
      }
    } else {
      console.log("combo", productType);
      if (!cart) {
        // If the user does not have a cart, create a new cart and add the item
        const newCart = new Cart({
          user: userId,
          items: [
            {
              product: _id,
              inputValues: inputValues,
              specialInstructions,
              giftWrap,
              color: colorObj,
              quantity: 1,
            },
          ],
        });

        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
      } else {
        // add new item to the cart
        cart.items.push({
          product: _id,
          inputValues: inputValues,
          specialInstructions,
          giftWrap,
          color: colorObj,
          quantity: 1,
        });

        // Save the updated cart
        const updatedCart = await cart.save();
        res.status(200).json(updatedCart);

        // let count = 1;
        // setInterval(() => {
        //   console.log(count);
        //   count++;
        // }, 1000);
        // setTimeout(() => {
        //   emailnotify(userId);
        // }, 2 * 1000);

        setTimeout(() => {
          emailnotify(userId);
        }, 2 * 60 * 60 * 1000); // 2 hours

        setTimeout(() => {
          emailnotify(userId);
        }, 24 * 60 * 60 * 1000); // 24 hours

        setTimeout(() => {
          emailnotify(userId);
        }, 3 * 24 * 60 * 60 * 1000); // 3 days
      }
    }
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// reduce the item quantity by 1 in cart
const reduceItemInCart = async (req, res) => {
  try {
    const {
      _id,
      nameOnProduct,
      selectedCharm,
      specialInstructions,
      giftWrap,
      color,
      nameOnProduct1,
      nameOnProduct2,
      selectedmodel,
      selectedfont,
      multipleImage,
      singleImage,
      mobilename,
    } = req.body; // Assuming you receive the item ID in the request body
    const userId = req.user;
    console.log("this is running1");
    // Find the cart in the database
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Find the cart item to reduce its quantity
    const cartItem = cart.items.find((item) => {
      const areMultipleImagesEqual =
        item.multipleImage &&
        multipleImage &&
        item.multipleImage.length === multipleImage.length &&
        item.multipleImage.every((image, index) => {
          console.log(image, "===", multipleImage[index]);
          return image === multipleImage[index];
        });

      return (
        item.product.toString() === _id &&
        item.nameOnProduct === nameOnProduct &&
        item.mobilename === mobilename &&
        item.specialInstructions === specialInstructions &&
        item.giftWrap === giftWrap &&
        item.nameOnProduct1 === nameOnProduct1 &&
        item.nameOnProduct2 === nameOnProduct2 &&
        item.selectedCharm === selectedCharm &&
        item.selectedmodel === selectedmodel &&
        item.selectedfont === selectedfont &&
        ((item.color && color && item.color.shade === color.shade) ||
          !color === !item.color) &&
        (areMultipleImagesEqual || !areMultipleImagesEqual) &&
        (item.singleImage === singleImage ||
          (!item.singleImage && !singleImage))
      );
    });
    console.log("this is running2", cartItem);
    if (!cartItem) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    if (cartItem && cartItem.quantity === 1) {
      const matchingItemIndex = cart.items.findIndex((item) => {
        const areMultipleImagesEqual =
          item.multipleImage &&
          cartItem.multipleImage &&
          item.multipleImage.length === cartItem.multipleImage.length &&
          item.multipleImage.every((image, index) => {
            return image === cartItem.multipleImage[index];
          });
        console.log(
          areMultipleImagesEqual,
          cartItem.multipleImage,
          item.multipleImage
        );
        return (
          item.product.toString() === cartItem.product.toString() &&
          item.nameOnProduct === cartItem.nameOnProduct &&
          item.mobilename === mobilename &&
          item.specialInstructions === cartItem.specialInstructions &&
          item.giftWrap === cartItem.giftWrap &&
          item.nameOnProduct1 === nameOnProduct1 &&
          item.nameOnProduct2 === nameOnProduct2 &&
          item.selectedCharm === selectedCharm &&
          item.selectedmodel === selectedmodel &&
          item.selectedfont === selectedfont &&
          ((item.color && color && item.color.shade === color.shade) ||
            !color === !item.color) &&
          (areMultipleImagesEqual || !areMultipleImagesEqual) &&
          (item.singleImage === singleImage ||
            item.singleImage === null ||
            singleImage === null)
        );
      });

      if (matchingItemIndex !== -1) {
        // Remove the item from cart.items
        cart.items.splice(matchingItemIndex, 1);
      }
    } else {
      cartItem.quantity--;
    }

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: "Item reduced in cart successfully" });

    setTimeout(() => {
      emailnotify(userId);
    }, 2 * 60 * 60 * 1000); // 2 hours

    setTimeout(() => {
      emailnotify(userId);
    }, 24 * 60 * 60 * 1000); // 24 hours

    setTimeout(() => {
      emailnotify(userId);
    }, 3 * 24 * 60 * 60 * 1000); // 3 days
  } catch (error) {
    console.error("Error reducing item in cart:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteItemFromCart = async (req, res) => {
  try {
    const {
      _id,
      nameOnProduct,
      selectedCharm,
      specialInstructions,
      giftWrap,
      color,
      nameOnProduct1,
      nameOnProduct2,
      selectedmodel,
      selectedfont,
      multipleImage,
      singleImage,
      producType,
      mobilename,
      date,
    } = req.body;
    console.log(req.body, "req.body delete item form cart");
    const userId = req.user;
    // Find the cart in the database
    const cart = await Cart.findOne({ user: userId });
    console.log(cart.items, "cart");
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    console.log(multipleImage);

    // Find the cart item to remove
    let cartItemIndex;
    if (producType === "Single") {
      cartItemIndex = cart.items.findIndex((item) => {
        // console.log(item, typeof item.color, typeof color, "||");
        const areMultipleImagesEqual =
          item.multipleImage &&
          multipleImage &&
          item.multipleImage.length === multipleImage.length &&
          item.multipleImage.every((image, index) => {
            console.log(image, "===", multipleImage[index]);
            return image === multipleImage[index];
          });
        const colorMatch =
          (!color && !item.color) || // If neither color is present
          (color && item.color && color.shade === item.color.shade);
        console.log(colorMatch);
        // If both colors are present, match their shades
        return (
          (item.product.toString() === _id &&
            item.mobilename === mobilename &&
            item.nameOnProduct === nameOnProduct &&
            item.specialInstructions === specialInstructions &&
            item.giftWrap === giftWrap &&
            item.nameOnProduct1 === nameOnProduct1 &&
            item.nameOnProduct2 === nameOnProduct2 &&
            item.selectedCharm === selectedCharm &&
            item.selectedmodel === selectedmodel &&
            item.selectedfont === selectedfont &&
            colorMatch) ||
          (!colorMatch &&
            (areMultipleImagesEqual || !areMultipleImagesEqual) &&
            (item.singleImage === singleImage ||
              (!item.singleImage && !singleImage)))
        );
      });
    } else {
      cartItemIndex = cart.items.findIndex((item) => {
        // const isoDate = new Date(item.date.toString()).toISOString();
        const inputIsoDate = new Date(date);
        console.log(item.date, inputIsoDate, item.date === inputIsoDate);
        return item.date.toString() === inputIsoDate.toString();
      });
    }

    console.log(cartItemIndex);
    if (cartItemIndex === -1) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    // Remove the cart item from the items array
    cart.items.splice(cartItemIndex, 1);

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: "Item deleted from cart successfully" });

    setTimeout(() => {
      emailnotify(userId);
    }, 2 * 60 * 60 * 1000); // 2 hours

    setTimeout(() => {
      emailnotify(userId);
    }, 24 * 60 * 60 * 1000); // 24 hours

    setTimeout(() => {
      emailnotify(userId);
    }, 3 * 24 * 60 * 60 * 1000); // 3 days
  } catch (error) {
    console.error("Error deleting item from cart:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const updatecart = async (req, res) => {
  try {
    const data = req.body;
    const userId = req.user;

    // console.log(data, "body");
    const cart = await Cart.findOne({ user: req.user }).populate(
      "items.product"
    );
    // console.log(cart, "cart", "car found in db");
    for (const cartitem of data) {
      const colorObj = {
        name: cartitem.color?.name,
        shade: cartitem.color.shade,
      };

      // Check if the item already exists in the cart
      // console.log(cartitem, "cartitem");
      const existingItem = cart.items.find((item) => {
        const areMultipleImagesEqual =
          item.multipleImage &&
          cartitem.multipleImage &&
          item.multipleImage.length === cartitem.multipleImage.length &&
          item.multipleImage.every((image, index) => {
            console.log(image, "===", cartitem.multipleImage[index]);
            return image === cartitem.multipleImage[index];
          });
        console.log(item.product._id.toString(), cartitem._id, "product");

        return (
          item.product._id.toString() === cartitem._id &&
          item.nameOnProduct === cartitem.nameOnProduct &&
          item.specialInstructions === cartitem.specialInstructions &&
          item.giftWrap === cartitem.giftWrap &&
          item.nameOnProduct1 === cartitem.nameOnProduct1 &&
          item.nameOnProduct2 === cartitem.nameOnProduct2 &&
          item.selectedCharm === cartitem.selectedCharm &&
          item.selectedmodel === cartitem.selectedmodel &&
          item.selectedfont === cartitem.selectedfont &&
          item.mobilename === cartitem.mobilename &&
          ((!cartitem.color && !item.color) ||
            item.color.shade === cartitem.color.shade) &&
          areMultipleImagesEqual &&
          (item.singleImage === cartitem.singleImage ||
            (!item.singleImage && !cartitem.singleImage))
        );
      });
      console.log(existingItem, "existingItem");
      if (existingItem) {
        // Item already exists, update the quantity
        // console.log(existingItem, "existing items found");
        existingItem.quantity += cartitem.quantity;
      } else {
        console.log(cartitem, "cartitem");
        // console.log(cartitem.nameOnProduct, "name on product");
        // Item does not exist, add it to the cart

        const multipleimages = cartitem.multipleImage.map((img) => img);
        cart.items.push({
          product: cartitem._id,
          nameOnProduct: cartitem.nameOnProduct,
          selectedCharm: cartitem.selectedCharm,
          specialInstructions: cartitem.specialInstructions,
          giftWrap: cartitem.giftWrap,
          quantity: cartitem.quantity,
          ...(cartitem.color && { color: colorObj }),
          nameOnProduct1: cartitem.nameOnProduct1,
          nameOnProduct2: cartitem.nameOnProduct2,
          singleImage: cartitem.singleImage,
          selectedmodel: cartitem.selectedmodel,
          selectedfont: cartitem.selectedfont,
          multipleImage: multipleimages,
          mobilename: cartitem.mobilename,
        });
      }
    }
    // Save the updated cart
    console.log(cart, "updated cart");
    await cart.save();
    const updatedcart2 = await Cart.findOne({ user: req.user }).populate(
      "items.product"
    );
    console.log(updatedcart2, "updted cart2");

    res.json({
      success: true,
      data: updatedcart2,
      message: "Cart updated successfully",
    });
    setTimeout(() => {
      emailnotify(userId);
    }, 2 * 60 * 60 * 1000); // 2 hours

    setTimeout(() => {
      emailnotify(userId);
    }, 24 * 60 * 60 * 1000); // 24 hours

    setTimeout(() => {
      emailnotify(userId);
    }, 3 * 24 * 60 * 60 * 1000); // 3 days
  } catch (error) {
    res.status(500).send(error);
  }
};

// email notification service
const emailnotify = async (userId) => {
  try {
    // Find the user's cart
    // console.log("email started");
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    // Check if the cart exists and if 2 hours have passed since the last update
    if (
      cart &&
      cart.items.length > 0 &&
      Date.now() - cart.updatedAt.getTime() >= 1000
    ) {
      sendAbandonedCartEmail(userId, cart);
    }
    // if (cart && Date.now() - cart.updatedAt.getTime() >= 2 * 1000) {
    //   sendAbandonedCartEmail(userId, cart);
    // }
  } catch (error) {
    console.error("Error sending email notification:", error);
  }
};

const sendAbandonedCartEmail = async (userId, cart) => {
  try {
    const user = await User.findById(userId);
    const userEmail = user.email;
    const cartItems = cart.items;
    // console.log(cartItems.map((item, index) => item));
    const subject = "Reminder: Your Cart is Waiting!";

    let body = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html
      xmlns="http://www.w3.org/1999/xhtml"
      xmlns:v="urn:schemas-microsoft-com:vml"
      xmlns:o="urn:schemas-microsoft-com:office:office"
    >
      <head>
        <!--[if gte mso 9]>
          <xml>
            <o:OfficeDocumentSettings>
              <o:AllowPNG />
              <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
          </xml>
        <![endif]-->
        <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="format-detection" content="date=no" />
        <meta name="format-detection" content="address=no" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="x-apple-disable-message-reformatting" />
        <!--[if !mso]><!-->
        <link
          href="https://fonts.googleapis.com/css?family=PT+Sans:400,400i,700,700i&display=swap"
          rel="stylesheet"
        />
        <!--<![endif]-->
        <title>Email Template</title>
        <!--[if gte mso 9]>
          <style type="text/css" media="all">
            sup {
              font-size: 100% !important;
            }
          </style>
        <![endif]-->
        <!-- body, html, table, thead, tbody, tr, td, div, a, span { font-family: Arial, sans-serif !important; } -->
    
        <style type="text/css" media="screen">
          body {
            padding: 0 !important;
            margin: 0 auto !important;
            display: block !important;
            min-width: 100% !important;
            width: 100% !important;
            background: #f4ecfa;
            -webkit-text-size-adjust: none;
          }
          a {
            color: #f3189e;
            text-decoration: none;
          }
          p {
            padding: 0 !important;
            margin: 0 !important;
          }
          img {
            margin: 0 !important;
            -ms-interpolation-mode: bicubic; /* Allow smoother rendering of resized image in Internet Explorer */
          }
    
          a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: inherit !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
          }
    
          .btn-16 a {
            display: block;
            padding: 15px 35px;
            text-decoration: none;
          }
          .btn-20 a {
            display: block;
            padding: 15px 35px;
            text-decoration: none;
          }
    
          .l-white a {
            color: #ffffff;
          }
          .l-black a {
            color: #282828;
          }
          .l-pink a {
            color: #f3189e;
          }
          .l-grey a {
            color: #6e6e6e;
          }
          .l-purple a {
            color: #9128df;
          }
    
          .gradient {
            background: linear-gradient(90deg, #5170ff, #ff66c4);
          }
    
          .btn-secondary {
            border-radius: 10px;
            background: linear-gradient(90deg, #5170ff, #ff66c4);
          }
    
          /* Mobile styles */
          @media only screen and (max-device-width: 480px),
            only screen and (max-width: 480px) {
            .mpx-10 {
              padding-left: 10px !important;
              padding-right: 10px !important;
            }
    
            .mpx-15 {
              padding-left: 15px !important;
              padding-right: 15px !important;
            }
    
            .mpb-15 {
              padding-bottom: 15px !important;
            }
    
            u + .body .gwfw {
              width: 100% !important;
              width: 100vw !important;
            }
    
            .td,
            .m-shell {
              width: 100% !important;
              min-width: 100% !important;
            }
    
            .mt-left {
              text-align: left !important;
            }
            .mt-center {
              text-align: center !important;
            }
            .mt-right {
              text-align: right !important;
            }
    
            .me-left {
              margin-right: auto !important;
            }
            .me-center {
              margin: 0 auto !important;
            }
            .me-right {
              margin-left: auto !important;
            }
    
            .mh-auto {
              height: auto !important;
            }
            .mw-auto {
              width: auto !important;
            }
    
            .fluid-img img {
              width: 100% !important;
              max-width: 100% !important;
              height: auto !important;
            }
    
            .column,
            .column-top,
            .column-dir-top {
              float: left !important;
              width: 100% !important;
              display: block !important;
            }
    
            .m-hide {
              display: none !important;
              width: 0 !important;
              height: 0 !important;
              font-size: 0 !important;
              line-height: 0 !important;
              min-height: 0 !important;
            }
            .m-block {
              display: block !important;
            }
    
            .mw-15 {
              width: 15px !important;
            }
    
            .mw-2p {
              width: 2% !important;
            }
            .mw-32p {
              width: 32% !important;
            }
            .mw-49p {
              width: 49% !important;
            }
            .mw-50p {
              width: 50% !important;
            }
            .mw-100p {
              width: 100% !important;
            }
    
            .mmt-0 {
              margin-top: 0 !important;
            }
          }
        </style>
      </head>
      <body
        class="body"
        style="
          padding: 0 !important;
          margin: 0 auto !important;
          display: block !important;
          min-width: 100% !important;
          width: 100% !important;
          background: #f4ecfa;
          -webkit-text-size-adjust: none;
        "
      >
        <center>
          <table
            width="100%"
            border="0"
            cellspacing="0"
            cellpadding="0"
            style="margin: 0; padding: 0; width: 100%; height: 100%"
            bgcolor="#f4ecfa"
            class="gwfw"
          >
            <tr>
              <td
                style="margin: 0; padding: 0; width: 100%; height: 100%"
                align="center"
                valign="top"
              >
                <table
                  width="600"
                  border="0"
                  cellspacing="0"
                  cellpadding="0"
                  class="m-shell"
                >
                  <tr>
                    <td
                      class="td"
                      style="
                        width: 600px;
                        min-width: 600px;
                        font-size: 0pt;
                        line-height: 0pt;
                        padding: 0;
                        margin: 0;
                        font-weight: normal;
                      "
                    >
                      <table
                        width="100%"
                        border="0"
                        cellspacing="0"
                        cellpadding="0"
                      >
                        <tr>
                          <td class="mpx-10">
                            <!-- Top -->
                            <table
                              width="100%"
                              border="0"
                              cellspacing="0"
                              cellpadding="0"
                            >
                              <tr>
                                <td
                                  class="text-12 c-grey l-grey a-right py-20"
                                  style="
                                    font-size: 12px;
                                    line-height: 16px;
                                    font-family: 'PT Sans', Arial, sans-serif;
                                    min-width: auto !important;
                                    color: #6e6e6e;
                                    text-align: right;
                                    padding-top: 20px;
                                    padding-bottom: 20px;
                                  "
                                >
                                  <a
                                    href="#"
                                    target="_blank"
                                    class="link c-grey"
                                    style="text-decoration: none; color: #6e6e6e"
                                    ><span
                                      class="link c-grey"
                                      style="text-decoration: none; color: #6e6e6e"
                                      ></span
                                    ></a
                                  >
                                </td>
                              </tr>
                            </table>
                            <!-- END Top -->
    
                            <!-- Container -->
                            <table
                              width="100%"
                              border="0"
                              cellspacing="0"
                              cellpadding="0"
                            >
                              <tr>
                                <td
                                  class="gradient pt-10"
                                  style="
                                    border-radius: 10px 10px 0 0;
                                    padding-top: 10px;
                                  "
                                  bgcolor="#f3189e"
                                >
                                  <table
                                    width="100%"
                                    border="0"
                                    cellspacing="0"
                                    cellpadding="0"
                                  >
                                    <tr>
                                      <td
                                        style="border-radius: 10px 10px 0 0"
                                        bgcolor="#ffffff"
                                      >
                                        <!-- Logo -->
                                        <div
                                          style="
                                            font-size: 15px;
                                            padding: 5px 50px;
                                            display: flex;
                                            gap: 10px;
                                          "
                                        >
                                          <img
                                            style="height: 35px"
                                            src="https://customizehere.in/assets/images/logo/logo.png"
                                            alt=""
                                          />
                                          <h2>Customize Here</h2>
                                        </div>
                                        <!-- Logo -->
    
                                        <!-- Main -->
                                        <table
                                          width="100%"
                                          border="0"
                                          cellspacing="0"
                                          cellpadding="0"
                                        >
                                          <tr>
                                            <td
                                              class="px-50 mpx-15"
                                              style="
                                                padding-left: 50px;
                                                padding-right: 50px;
                                              "
                                            >
                                              <!-- Section - Intro -->
                                              <table
                                                width="100%"
                                                border="0"
                                                cellspacing="0"
                                                cellpadding="0"
                                              >
                                                <tr>
                                                  <td
                                                    class="pb-50"
                                                    style="padding-bottom: 50px"
                                                  >
                                                    <table
                                                      width="100%"
                                                      border="0"
                                                      cellspacing="0"
                                                      cellpadding="0"
                                                    >
                                                      <hr />
                                                      <tr>
                                                        <td
                                                          class="title-36 a-center pb-15"
                                                          style="
                                                            font-size: 36px;
                                                            line-height: 40px;
                                                            color: #282828;
                                                            font-family: 'PT Sans',
                                                              Arial, sans-serif;
                                                            min-width: auto !important;
                                                            text-align: center;
                                                            padding-bottom: 15px;
                                                            padding-top: 15px;
                                                          "
                                                        >
                                                          <strong
                                                            >Your cart is
                                                            waiting!</strong
                                                          >
                                                        </td>
                                                      </tr>
                                                      <tr>
                                                        <td
                                                          class="text-16 lh-26 a-center pb-25"
                                                          style="
                                                            font-size: 16px;
                                                            color: #6e6e6e;
                                                            font-family: 'PT Sans',
                                                              Arial, sans-serif;
                                                            min-width: auto !important;
                                                            line-height: 26px;
                                                            text-align: center;
                                                            padding-bottom: 25px;
                                                          "
                                                        >
                                                         Hi ${user.username}, You have items in your
                                                          cart that you haven't
                                                          purchased yet. Login to
                                                          Buy.
                                                        </td>
                                                      </tr>
                                                      <tr>
                                                        <td align="center">
                                                          <!-- Button -->
                                                          <table
                                                            border="0"
                                                            cellspacing="0"
                                                            cellpadding="0"
                                                            style="min-width: 200px"
                                                          >
                                                            <tr>
                                                              <td
                                                                class="btn-16 c-white l-white"
                                                                bgcolor="#f3189e"
                                                                style="
                                                                  font-size: 16px;
                                                                  line-height: 20px;
                                                                  mso-padding-alt: 15px
                                                                    35px;
                                                                  font-family: 'PT Sans',
                                                                    Arial,
                                                                    sans-serif;
                                                                  text-align: center;
                                                                  font-weight: bold;
                                                                  text-transform: uppercase;
                                                                  border-radius: 25px;
                                                                  min-width: auto !important;
                                                                  color: #ffffff;
                                                                "
                                                              >
                                                                <a
                                                                  href="${constants.frontUrl}login-register"
                                                                  target="_blank"
                                                                  class="link c-white"
                                                                  style="
                                                                    display: block;
                                                                    padding: 15px
                                                                      35px;
                                                                    text-decoration: none;
                                                                    color: #ffffff;
                                                                  "
                                                                >
                                                                  <span
                                                                    class="link c-white"
                                                                    style="
                                                                      text-decoration: none;
                                                                      color: #ffffff;
                                                                    "
                                                                    >Login</span
                                                                  >
                                                                </a>
                                                              </td>
                                                            </tr>
                                                          </table>
                                                          <!-- END Button -->
                                                        </td>
                                                      </tr>
                                                    </table>
                                                  </td>
                                                </tr>
                                              </table>
                                              <!-- END Section - Intro -->
    
                                              <!-- Section - Separator Line -->
                                              <table
                                                width="100%"
                                                border="0"
                                                cellspacing="0"
                                                cellpadding="0"
                                              >
                                                <tr>
                                                  <td
                                                    class="pb-50"
                                                    style="padding-bottom: 10px"
                                                  >
                                                    <table
                                                      width="100%"
                                                      border="0"
                                                      cellspacing="0"
                                                      cellpadding="0"
                                                    >
                                                      <tr>
                                                        <td
                                                          class="img"
                                                          height="1"
                                                          bgcolor="#ebebeb"
                                                          style="
                                                            font-size: 0pt;
                                                            line-height: 0pt;
                                                            text-align: left;
                                                          "
                                                        >
                                                          &nbsp;
                                                        </td>
                                                      </tr>
                                                    </table>
                                                  </td>
                                                </tr>
                                              </table>
                                              <!-- END Section - Separator Line -->
    
                                              <!-- Section - Order Details -->
                                              <table
                                                width="100%"
                                                border="0"
                                                cellspacing="0"
                                                cellpadding="0"
                                              >
                                                <tr>
                                                  <td
                                                    class="pb-50"
                                                    style="padding-bottom: 50px"
                                                  >
                                                    <table
                                                      width="100%"
                                                      border="0"
                                                      cellspacing="0"
                                                      cellpadding="0"
                                                    >
                                                      <!-- <div> -->
                                                      <h3
                                                        style="
                                                          font-size: 20px;
                                                          text-align: center;
                                                        "
                                                      >
                                                        Cart Items
                                                      </h3>
                                                      <!-- </div> -->
                                                      <tr>
                                                        <td
                                                          class="py-15"
                                                          style="
                                                            border: 1px solid
                                                              #000001;
                                                            border-left: 0;
                                                            border-right: 0;
                                                            padding-top: 15px;
                                                            padding-bottom: 15px;
                                                          "
                                                        >
                                                          <table
                                                            width="100%"
                                                            border="0"
                                                            cellspacing="0"
                                                            cellpadding="0"
                                                          >
                                                            <tr>
                                                              <td
                                                                class="title-20 mw-auto"
                                                                width="200"
                                                                style="
                                                                  font-size: 20px;
                                                                  line-height: 24px;
                                                                  color: #282828;
                                                                  font-family: 'PT Sans',
                                                                    Arial,
                                                                    sans-serif;
                                                                  text-align: left;
                                                                  min-width: auto !important;
                                                                "
                                                              >
                                                                <strong
                                                                  >Item</strong
                                                                >
                                                              </td>
                                                              <td
                                                                class="img"
                                                                width="20"
                                                                style="
                                                                  font-size: 0pt;
                                                                  line-height: 0pt;
                                                                  text-align: left;
                                                                "
                                                              ></td>
                                                              <td
                                                                class="title-20 a-center mw-auto"
                                                                width="40"
                                                                style="
                                                                  font-size: 20px;
                                                                  line-height: 24px;
                                                                  color: #282828;
                                                                  font-family: 'PT Sans',
                                                                    Arial,
                                                                    sans-serif;
                                                                  min-width: auto !important;
                                                                  text-align: center;
                                                                "
                                                              >
                                                                <strong>Qty</strong>
                                                              </td>
                                                              <td
                                                                class="img"
                                                                width="20"
                                                                style="
                                                                  font-size: 0pt;
                                                                  line-height: 0pt;
                                                                  text-align: left;
                                                                "
                                                              ></td>
                                                              <td
                                                                class="title-20 a-right mw-auto"
                                                                style="
                                                                  font-size: 20px;
                                                                  line-height: 24px;
                                                                  color: #282828;
                                                                  font-family: 'PT Sans',
                                                                    Arial,
                                                                    sans-serif;
                                                                  min-width: auto !important;
                                                                  text-align: right;
                                                                "
                                                              >
                                                                <strong
                                                                  >Price</strong
                                                                >
                                                              </td>
                                                            </tr>
                                                          </table>
                                                        </td>
                                                      </tr>
                                                      `;
    cartItems.forEach((item, index) => {
      body += `<tr>
                                                        <td
                                                          class="py-25"
                                                          style="
                                                            border-bottom: 1px solid
                                                              #ebebeb;
                                                            padding-top: 25px;
                                                            padding-bottom: 25px;
                                                          "
                                                        >
                                                          <table
                                                            width="100%"
                                                            border="0"
                                                            cellspacing="0"
                                                            cellpadding="0"
                                                          >
                                                            <tr>
                                                              <th
                                                                class="column-top"
                                                                valign="top"
                                                                width="200"
                                                                style="
                                                                  font-size: 0pt;
                                                                  line-height: 0pt;
                                                                  padding: 0;
                                                                  margin: 0;
                                                                  font-weight: normal;
                                                                  vertical-align: top;
                                                                "
                                                              >
                                                                <table
                                                                  width="100%"
                                                                  border="0"
                                                                  cellspacing="0"
                                                                  cellpadding="0"
                                                                >
                                                                  <tr>
                                                                    <td
                                                                      class="title-20 pb-10"
                                                                      style="
                                                                        font-size: 20px;
                                                                        line-height: 24px;
                                                                        color: #282828;
                                                                        font-family: 'PT Sans',
                                                                          Arial,
                                                                          sans-serif;
                                                                        text-align: left;
                                                                        min-width: auto !important;
                                                                        padding-bottom: 10px;
                                                                      "
                                                                    >
                                                                      <strong
                                                                        >${item.product.name}</strong
                                                                      >
                                                                    </td>
                                                                  </tr>
                                                                  <tr>
                                                                    <td
                                                                      class="text-16 lh-24"
                                                                      style="
                                                                        font-size: 16px;
                                                                        color: #6e6e6e;
                                                                        font-family: 'PT Sans',
                                                                          Arial,
                                                                          sans-serif;
                                                                        text-align: left;
                                                                        min-width: auto !important;
                                                                        line-height: 24px;
                                                                      "
                                                                    >
                                                                    </td>
                                                                  </tr>
                                                                </table>
                                                              </th>
                                                              <th
                                                                class="column-top mpb-15"
                                                                valign="top"
                                                                width="20"
                                                                style="
                                                                  font-size: 0pt;
                                                                  line-height: 0pt;
                                                                  padding: 0;
                                                                  margin: 0;
                                                                  font-weight: normal;
                                                                  vertical-align: top;
                                                                "
                                                              ></th>
                                                              <th
                                                                class="column-top"
                                                                valign="top"
                                                                width="40"
                                                                style="
                                                                  font-size: 0pt;
                                                                  line-height: 0pt;
                                                                  padding: 0;
                                                                  margin: 0;
                                                                  font-weight: normal;
                                                                  vertical-align: top;
                                                                "
                                                              >
                                                                <table
                                                                  width="100%"
                                                                  border="0"
                                                                  cellspacing="0"
                                                                  cellpadding="0"
                                                                >
                                                                  <tr>
                                                                    <td
                                                                      class="title-20 a-center mt-left"
                                                                      style="
                                                                        font-size: 20px;
                                                                        line-height: 24px;
                                                                        color: #282828;
                                                                        font-family: 'PT Sans',
                                                                          Arial,
                                                                          sans-serif;
                                                                        min-width: auto !important;
                                                                        text-align: center;
                                                                      "
                                                                    >
                                                                      <strong
                                                                        >&times;${item.quantity}</strong
                                                                      >
                                                                    </td>
                                                                  </tr>
                                                                </table>
                                                              </th>
                                                              <th
                                                                class="column-top mpb-15"
                                                                valign="top"
                                                                width="20"
                                                                style="
                                                                  font-size: 0pt;
                                                                  line-height: 0pt;
                                                                  padding: 0;
                                                                  margin: 0;
                                                                  font-weight: normal;
                                                                  vertical-align: top;
                                                                "
                                                              ></th>
                                                              <th
                                                                class="column-top"
                                                                valign="top"
                                                                style="
                                                                  font-size: 0pt;
                                                                  line-height: 0pt;
                                                                  padding: 0;
                                                                  margin: 0;
                                                                  font-weight: normal;
                                                                  vertical-align: top;
                                                                "
                                                              >
                                                                <table
                                                                  width="100%"
                                                                  border="0"
                                                                  cellspacing="0"
                                                                  cellpadding="0"
                                                                >
                                                                  <tr>
                                                                    <td
                                                                      class="title-20 a-right mt-left"
                                                                      style="
                                                                        font-size: 20px;
                                                                        line-height: 24px;
                                                                        color: #282828;
                                                                        font-family: 'PT Sans',
                                                                          Arial,
                                                                          sans-serif;
                                                                        min-width: auto !important;
                                                                        text-align: right;
                                                                      "
                                                                    >
                                                                      <strong
                                                                        >₹${item.product.discount}</strong
                                                                      >
                                                                    </td>
                                                                  </tr>
                                                                </table>
                                                              </th>
                                                            </tr>
                                                          </table>
                                                        </td>
                                                      </tr>`;
    });
    body += `
                                                      <!-- <tr>
                                                        <td
                                                          class="pt-30"
                                                          style="
                                                            border-top: 1px solid
                                                              #000001;
                                                            padding-top: 30px;
                                                          "
                                                        >
                                                          <table
                                                            width="100%"
                                                            border="0"
                                                            cellspacing="0"
                                                            cellpadding="0"
                                                          >
                                                            <tr>
                                                              <th
                                                                class="column-top"
                                                                valign="top"
                                                                width="230"
                                                                style="
                                                                  font-size: 0pt;
                                                                  line-height: 0pt;
                                                                  padding: 0;
                                                                  margin: 0;
                                                                  font-weight: normal;
                                                                  vertical-align: top;
                                                                "
                                                              >
                                                                <table
                                                                  width="100%"
                                                                  border="0"
                                                                  cellspacing="0"
                                                                  cellpadding="0"
                                                                >
                                                                  <tr>
                                                                    <td
                                                                      class="title-20 pb-10"
                                                                      style="
                                                                        font-size: 20px;
                                                                        line-height: 24px;
                                                                        color: #282828;
                                                                        font-family: 'PT Sans',
                                                                          Arial,
                                                                          sans-serif;
                                                                        text-align: left;
                                                                        min-width: auto !important;
                                                                        padding-bottom: 10px;
                                                                      "
                                                                    >
                                                                      <strong
                                                                        >Payment
                                                                        method</strong
                                                                      >
                                                                    </td>
                                                                  </tr>
                                                                  <tr>
                                                                    <td
                                                                      class="text-16"
                                                                      style="
                                                                        font-size: 16px;
                                                                        line-height: 20px;
                                                                        color: #6e6e6e;
                                                                        font-family: 'PT Sans',
                                                                          Arial,
                                                                          sans-serif;
                                                                        text-align: left;
                                                                        min-width: auto !important;
                                                                      "
                                                                    >
                                                                      Mastercard
                                                                      ending in 4097
                                                                    </td>
                                                                  </tr>
                                                                </table>
                                                              </th>
                                                              <th
                                                                class="column-top mpb-15"
                                                                valign="top"
                                                                width="30"
                                                                style="
                                                                  font-size: 0pt;
                                                                  line-height: 0pt;
                                                                  padding: 0;
                                                                  margin: 0;
                                                                  font-weight: normal;
                                                                  vertical-align: top;
                                                                "
                                                              ></th>
                                                              <th
                                                                class="column-top"
                                                                valign="top"
                                                                width="230"
                                                                style="
                                                                  font-size: 0pt;
                                                                  line-height: 0pt;
                                                                  padding: 0;
                                                                  margin: 0;
                                                                  font-weight: normal;
                                                                  vertical-align: top;
                                                                "
                                                              >
                                                                <table
                                                                  width="100%"
                                                                  border="0"
                                                                  cellspacing="0"
                                                                  cellpadding="0"
                                                                >
                                                                  <tr>
                                                                    <td
                                                                      align="right"
                                                                    >
                                                                      <table
                                                                        border="0"
                                                                        cellspacing="0"
                                                                        cellpadding="0"
                                                                        class="mw-100p"
                                                                      >
                                                                        <tr>
                                                                          <td
                                                                            class="title-20 lh-30 a-right mt-left mw-auto"
                                                                            width="100"
                                                                            style="
                                                                              font-size: 20px;
                                                                              color: #282828;
                                                                              font-family: 'PT Sans',
                                                                                Arial,
                                                                                sans-serif;
                                                                              min-width: auto !important;
                                                                              line-height: 30px;
                                                                              text-align: right;
                                                                            "
                                                                          >
                                                                            <strong
                                                                              >Subtotal:</strong
                                                                            >
                                                                          </td>
                                                                          <td
                                                                            class="img mw-15"
                                                                            width="20"
                                                                            style="
                                                                              font-size: 0pt;
                                                                              line-height: 0pt;
                                                                              text-align: left;
                                                                            "
                                                                          ></td>
                                                                          <td
                                                                            class="title-20 lh-30 mt-right"
                                                                            style="
                                                                              font-size: 20px;
                                                                              color: #282828;
                                                                              font-family: 'PT Sans',
                                                                                Arial,
                                                                                sans-serif;
                                                                              text-align: left;
                                                                              min-width: auto !important;
                                                                              line-height: 30px;
                                                                            "
                                                                          >
                                                                            $290.99
                                                                          </td>
                                                                        </tr>
                                                                        <tr>
                                                                          <td
                                                                            class="title-20 lh-30 a-right mt-left"
                                                                            style="
                                                                              font-size: 20px;
                                                                              color: #282828;
                                                                              font-family: 'PT Sans',
                                                                                Arial,
                                                                                sans-serif;
                                                                              min-width: auto !important;
                                                                              line-height: 30px;
                                                                              text-align: right;
                                                                            "
                                                                          >
                                                                            <strong
                                                                              >Shipping:</strong
                                                                            >
                                                                          </td>
                                                                          <td
                                                                            class="img mw-15"
                                                                            style="
                                                                              font-size: 0pt;
                                                                              line-height: 0pt;
                                                                              text-align: left;
                                                                            "
                                                                          ></td>
                                                                          <td
                                                                            class="title-20 lh-30 mt-right"
                                                                            style="
                                                                              font-size: 20px;
                                                                              color: #282828;
                                                                              font-family: 'PT Sans',
                                                                                Arial,
                                                                                sans-serif;
                                                                              text-align: left;
                                                                              min-width: auto !important;
                                                                              line-height: 30px;
                                                                            "
                                                                          >
                                                                            $0.00
                                                                          </td>
                                                                        </tr>
                                                                        <tr>
                                                                          <td
                                                                            class="title-20 lh-30 a-right mt-left"
                                                                            style="
                                                                              font-size: 20px;
                                                                              color: #282828;
                                                                              font-family: 'PT Sans',
                                                                                Arial,
                                                                                sans-serif;
                                                                              min-width: auto !important;
                                                                              line-height: 30px;
                                                                              text-align: right;
                                                                            "
                                                                          >
                                                                            <strong
                                                                              >Tax:</strong
                                                                            >
                                                                          </td>
                                                                          <td
                                                                            class="img mw-15"
                                                                            style="
                                                                              font-size: 0pt;
                                                                              line-height: 0pt;
                                                                              text-align: left;
                                                                            "
                                                                          ></td>
                                                                          <td
                                                                            class="title-20 lh-30 mt-right"
                                                                            style="
                                                                              font-size: 20px;
                                                                              color: #282828;
                                                                              font-family: 'PT Sans',
                                                                                Arial,
                                                                                sans-serif;
                                                                              text-align: left;
                                                                              min-width: auto !important;
                                                                              line-height: 30px;
                                                                            "
                                                                          >
                                                                            $4.32
                                                                          </td>
                                                                        </tr>
                                                                        <tr>
                                                                          <td
                                                                            class="title-20 lh-30 a-right mt-left pt-10"
                                                                            style="
                                                                              font-size: 20px;
                                                                              color: #282828;
                                                                              font-family: 'PT Sans',
                                                                                Arial,
                                                                                sans-serif;
                                                                              min-width: auto !important;
                                                                              line-height: 30px;
                                                                              text-align: right;
                                                                              padding-top: 10px;
                                                                            "
                                                                          >
                                                                            <strong
                                                                              >TOTAL:</strong
                                                                            >
                                                                          </td>
                                                                          <td
                                                                            class="img mw-15 pt-10"
                                                                            style="
                                                                              font-size: 0pt;
                                                                              line-height: 0pt;
                                                                              text-align: left;
                                                                              padding-top: 10px;
                                                                            "
                                                                          ></td>
                                                                          <td
                                                                            class="title-20 lh-30 c-purple pt-10 mt-right"
                                                                            style="
                                                                              font-size: 20px;
                                                                              font-family: 'PT Sans',
                                                                                Arial,
                                                                                sans-serif;
                                                                              text-align: left;
                                                                              min-width: auto !important;
                                                                              line-height: 30px;
                                                                              color: #9128df;
                                                                              padding-top: 10px;
                                                                            "
                                                                          >
                                                                            <strong
                                                                              >$290.99</strong
                                                                            >
                                                                          </td>
                                                                        </tr>
                                                                      </table>
                                                                    </td>
                                                                  </tr>
                                                                </table>
                                                              </th>
                                                            </tr>
                                                          </table>
                                                        </td>
                                                      </tr> -->
                                                    </table>
                                                  </td>
                                                </tr>
                                              </table>
                                              <!-- END Section - Order Details -->
                                            </td>
                                          </tr>
                                        </table>
                                        <!-- END Main -->
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                            <!-- END Container -->
    
                            <!-- Footer -->
                            <!-- Footer -->
                            <table
                              width="100%"
                              border="0"
                              cellspacing="0"
                              cellpadding="0"
                            >
                              <tr>
                                <td
                                  class="p-50 mpx-15"
                                  bgcolor="#949196"
                                  style="
                                    border-radius: 0 0 10px 10px;
                                    padding: 50px;
                                  "
                                >
                                  <table
                                    width="100%"
                                    border="0"
                                    cellspacing="0"
                                    cellpadding="0"
                                  >
                                    <tr>
                                      <td
                                        class="text-14 lh-24 a-center c-white l-white pb-20"
                                        style="
                                          font-size: 14px;
                                          font-family: 'PT Sans', Arial, sans-serif;
                                          min-width: auto !important;
                                          line-height: 24px;
                                          text-align: center;
                                          color: #ffffff;
                                          padding-bottom: 20px;
                                        "
                                      >
                                        Address : 24/488 Kalmandapam Palakkad,
                                        Kerala, India
                                        <br />
                                        <a
                                          href="tel:+17384796719"
                                          target="_blank"
                                          class="link c-white"
                                          style="
                                            text-decoration: none;
                                            color: #ffffff;
                                          "
                                          ><span
                                            class="link c-white"
                                            style="
                                              text-decoration: none;
                                              color: #ffffff;
                                            "
                                          >
                                            Phn. : +91 9188363339</span
                                          ></a
                                        >
                                        <br />
                                        <a
                                          href="mailto:info@website.com"
                                          target="_blank"
                                          class="link c-white"
                                          style="
                                            text-decoration: none;
                                            color: #ffffff;
                                          "
                                          ><span
                                            class="link c-white"
                                            style="
                                              text-decoration: none;
                                              color: #ffffff;
                                            "
                                          >
                                            care.customizehere@gmail.com</span
                                          ></a
                                        >
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                            <!-- END Footer -->
    
                            <!-- Bottom -->
                            <table
                              width="100%"
                              border="0"
                              cellspacing="0"
                              cellpadding="0"
                            >
                              <tr>
                                <td
                                  class="text-12 lh-22 a-center c-grey- l-grey py-20"
                                  style="
                                    font-size: 12px;
                                    color: #6e6e6e;
                                    font-family: 'PT Sans', Arial, sans-serif;
                                    min-width: auto !important;
                                    line-height: 22px;
                                    text-align: center;
                                    padding-top: 20px;
                                    padding-bottom: 20px;
                                  "
                                >
                                  <a
                                    href="#"
                                    target="_blank"
                                    class="link c-grey"
                                    style="text-decoration: none; color: #6e6e6e"
                                    ><span
                                      class="link c-grey"
                                      style="
                                        white-space: nowrap;
                                        text-decoration: none;
                                        color: #6e6e6e;
                                      "
                                      ></span
                                    ></a
                                  >
                                
                                  <a
                                    href="#"
                                    target="_blank"
                                    class="link c-grey"
                                    style="text-decoration: none; color: #6e6e6e"
                                    ><span
                                      class="link c-grey"
                                      style="
                                        white-space: nowrap;
                                        text-decoration: none;
                                        color: #6e6e6e;
                                      "
                                      ></span
                                    ></a
                                  >
                                 
                                  <a
                                    href="#"
                                    target="_blank"
                                    class="link c-grey"
                                    style="text-decoration: none; color: #6e6e6e"
                                    ><span
                                      class="link c-grey"
                                      style="
                                        white-space: nowrap;
                                        text-decoration: none;
                                        color: #6e6e6e;
                                      "
                                      ></span
                                    ></a
                                  >
                                </td>
                              </tr>
                            </table>
                            <!-- END Bottom -->
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </center>
      </body>
    </html>
    `;
    // let body = `<!DOCTYPE html>
    //   <html>
    //   <body>
    //     <h4>Hello, ${user.username}!</h4>
    //     <p>You have items in your cart that you haven't purchased yet. Here are the details:</p>
    //     <ol>`;

    // // Add cart items to the email body
    // cartItems.forEach((item, index) => {
    //   body += `<li>
    //     <h4>Item ${index + 1}</h4>
    //     <p>Product: ${item.product.name}</p>
    //     <p>Quantity: ${item.quantity}</p>
    //   </li>`;
    // });

    // body += `</ol>
    //   <p>We wanted to remind you and offer assistance in completing your order.</p>
    //   <p>Thank you for shopping with us!</p>
    //   </body>
    //   </html>`;

    const mailOptions = {
      from: constants.adminEmail,
      to: userEmail,
      subject: subject,
      html: body,
    };

    await transporter.sendMail(mailOptions);

    // console.log("Sending email to:", userEmail);
    // console.log("Subject:", subject);
    // console.log("Body:", body);
  } catch (error) {
    console.error("Error sending abandoned cart email:", error);
  }
};

const contactus = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    console.log(req.body, "body");
    // Construct the email content
    const emailContent = `
    Name: ${name}
    Email: ${email}
    Phone: ${phone}
    Message: ${message}
  `;

    // Define the email options
    const mailOptions = {
      from: constants.adminEmail,
      to: email,
      subject: " Contact Form",
      text: emailContent,
    };

    // Send the email console.log(req.body,"body")
    transporter.sendMail(mailOptions);
    res.status(200).send("email sent");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const subscribe = async (req, res) => {
  try {
    const { subscribeEmail } = req.body;
    console.log(req.body, "body");
    // Construct the email content
    const emailContent = `
    Email: ${subscribeEmail}
  `;

    // Define the email options
    const mailOptions = {
      from: constants.adminEmail,
      to: constants.adminEmail,
      subject: " Newsletter Subscription",
      text: emailContent,
    };

    // Send the email console.log(req.body,"body")
    transporter.sendMail(mailOptions);
    res.status(200).send("email sent");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

module.exports = {
  addItemToCart,
  reduceItemInCart,
  deleteItemFromCart,
  getCartItems,
  createCart,
  updatecart,
  contactus,
  upload,
  uploadimage,
  subscribe,
};
