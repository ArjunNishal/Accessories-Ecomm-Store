const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/usersSchema");
const Admin = require("../models/AdminSchema");
const nodemailer = require("nodemailer");
const constants = require("../constants");

const registerUser = async (req, res) => {
  const { username, email, password, mobileno } = req.body;
  console.log(req.body);
  // Check if user already exists
  const user = await User.findOne({
    $or: [{ email: email }, { mobileno: mobileno }, { username: username }],
  });

  if (user) {
    // Determine which field(s) caused the conflict and send an appropriate error message
    let errorMessage = "User with ";
    if (user.email === email) {
      errorMessage += "this email";
    }
    if (user.mobileno === mobileno) {
      if (errorMessage !== "User with ") errorMessage += " and ";
      errorMessage += "this mobile number";
    }
    if (user.username === username) {
      if (errorMessage !== "User with ") errorMessage += " and ";
      errorMessage += "this username";
    }
    errorMessage += " already exists";

    return res.status(500).send(errorMessage);
  }

  // Hash the password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create a new user
  const newUser = new User({
    username,
    email,
    mobileno,
    password: hashedPassword,
    isEmailVerified: false,
    isMobileVerified: false,
  });

  try {
    const savedUser = await newUser.save();

    // Generate token
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET_KEY);

    return res.status(200).send({
      message: "User registered successfully",
      token: token,
      data: savedUser,
    });
  } catch (error) {
    return res.status(500).send({ message: "User registration failed" });
  }
};

const loginUser = async (req, res) => {
  const { mobileno, email, password } = req.body;

  console.log(req.body);
  try {
    let user;
    // Check if user exists with the given mobile number in the Admin collection
    if (email) {
      user = await Admin.findOne({ email });
      if (!user) {
        return res.status(404).send("User not found");
      }
    }
    console.log(user, "admin");
    // If not found in Admin collection, check the User collection
    if (!email) {
      user = await User.findOne({ mobileno });
      if (!user) {
        return res.status(404).send("User not found");
      }
    }

    // Compare the provided password with the hashed password
    let passwordMatch;
    if (email) {
      // console.log(password, user.password);
      passwordMatch = password === user.password;
    } else if (mobileno) {
      passwordMatch = await bcrypt.compare(password, user.password);
    }
    console.log(passwordMatch);

    if (!passwordMatch) {
      return res.status(401).send("Invalid password");
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);

    return res.status(200).send({
      message: "User logged in successfully",
      token: token,
      data: user,
    });
  } catch (error) {
    return res.status(500).send({ message: "Login failed" });
  }
};

const forgotpassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    console.log(email, user);
    if (!user) {
      return res.status(500).send({ message: "We cannot find your email." });
    } else {
      const secret = process.env.JWT_SECRET_KEY;
      const token = jwt.sign({ email: user.email, id: user.id }, secret, {
        expiresIn: "5m",
      });
      const link = `${constants.renderUrl}api/user/resetpassword/${user.id}/${token}`;
      const link2 = `${constants.frontUrl}resetpassword/${user.id}/${token}`;
      console.log(link, link2, "================= link ============= ");
      // save the token in the database along with the user id and an expiration date
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

      await user.save();

      // send the password reset email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          // user: "arjun.intoggle@gmail.com",
          // pass: "rrqbfkgzzakdikno",
          user: constants.adminEmail,
          pass: constants.adminmailpass,
        },
      });

      let passbody = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
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
                                    ></a>
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
                                    bgcolor="rgb(189, 50, 40)"
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
                                          <!-- <hr> -->
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
                                                        <!-- <tr>
                                                              <td
                                                                class="fluid-img img-center pb-50"
                                                                style="
                                                                  font-size: 0pt;
                                                                  line-height: 0pt;
                                                                  text-align: center;
                                                                  padding-bottom: 50px;
                                                                "
                                                              >
                                                                <img
                                                                  src="../images/img_intro_4.png"
                                                                  width="368"
                                                                  height="296"
                                                                  border="0"
                                                                  alt=""
                                                                />
                                                              </td>
                                                            </tr> -->
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
                                                              >Forgot your
                                                              password?</strong
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
                                                            Click on the button below
                                                            to reset your password,
                                                            you have 5 mins to pick
                                                            your password. After that,
                                                            you'll have to ask for a
                                                            new one.
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
                                                                    href="${constants.frontUrl}resetpassword/${user.id}/${token}"
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
                                                                      >RESET
                                                                      PASSWORD</span
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
                                              Phn. : +91 1234567890</span
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
                                    ></a>
      
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
                                    ></a>
      
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
                                    ></a>
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
      const mailOptions = {
        from: "arjun.intoggle@gmail.com",
        to: email,
        subject: "Password Reset",
        //   text: `You are receiving this because you (or someone else) has requested the reset of the password for your account. Please click on the following link, or paste this into your browser to complete the process:\n\n
        // http://localhost:3000/resetpassword/${user.id}/${token} \n\n
        // If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        html: passbody,
      };

      await transporter.sendMail(mailOptions);
      return res.status(200).json({ message: "Email sent successfully" });
    }
  } catch (error) {
    console.log(error, "error");
    res.status(500).send(error);
  }
};

const resetpass = async (req, res) => {
  const { id, token } = req.params;
  const { password, confirmPassword } = req.body;
  console.log(req.body, "body");

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(500).send("Invalid user ID");
    }
    if (password.includes(" ")) {
      return res
        .status(500)
        .json({ message: "Password should not have spaces." });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (decodedToken.id !== user.id) {
      return res.status(500).send("Invalid token");
    }
    // Hash the password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    user.password = hashedPassword;
    await user.save();

    res.send("Password reset successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

const updateprofile = async (req, res) => {
  const { username, email, phone } = req.body;

  try {
    const userId = req.user;

    const user = await User.findByIdAndUpdate(
      userId,
      { username, email, phone },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

module.exports = {
  forgotpassword,
  registerUser,
  resetpass,
  loginUser,
  updateprofile,
};
