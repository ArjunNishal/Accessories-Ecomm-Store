const Order = require("../models/OrderSchema");
const Cart = require("../models/Cart");
const nodemailer = require("nodemailer");
const constants = require("../constants");
const User = require("../models/usersSchema");

// Configure the email transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: constants.adminEmail,
    pass: constants.adminmailpass,
  },
});

console.log(constants.adminEmail);

const sendOrderConfirmation = async (order) => {
  try {
    const mailOptions = {
      from: constants.adminEmail,
      to: order.email,
      subject: "Order Confirmation",
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
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
              color: #3c0125;
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
              color: #61033d;
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
                                                style="
                                                  padding-bottom: 50px;
                                                  padding-top: 20px;
                                                "
                                              >
                                                <hr />
                                                <table
                                                  width="100%"
                                                  border="0"
                                                  cellspacing="0"
                                                  cellpadding="0"
                                                >
                                                  <tr>
                                                    <td
                                                      class="title-36 a-center pb-15"
                                                      style="
                                                        padding-top: 10px;
                                                        font-size: 25px;
                                                        line-height: 40px;
                                                        color: #282828;
                                                        font-family: 'PT Sans',
                                                          Arial, sans-serif;
                                                        min-width: auto !important;
                                                        text-align: center;
                                                        padding-bottom: 15px;
                                                      "
                                                    >
                                                      <strong
                                                        >Thank you for placing
                                                        your order.</strong
                                                      >
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td
                                                      class="text-16 lh-26 a-center"
                                                      style="
                                                        font-size: 16px;
                                                        color: #6e6e6e;
                                                        font-family: 'PT Sans',
                                                          Arial, sans-serif;
                                                        min-width: auto !important;
                                                        line-height: 26px;
                                                        text-align: center;
                                                      "
                                                    >
                                                      Hi
                                                      ${order?.firstName}, your
                                                      order is confirmed for the
                                                      items.
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>
                                            </tr>
                                          </table>
                                                <!-- END Section - Intro -->
      
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
                                                        <tr>
                                                          <td
                                                            class="pb-30"
                                                            style="
                                                              padding-bottom: 30px;
                                                            "
                                                          >
                                                            <!-- Button -->
                                                            <table
                                                              width="100%"
                                                              border="0"
                                                              cellspacing="0"
                                                              cellpadding="0"
                                                            >
                                                              <tr>
                                                                <td
                                                                  class="btn-20 btn-secondary c-white l-white"
                                                                  bgcolor="#f3189e"
                                                                  style="
                                                                    font-size: 20px;
                                                                    line-height: 24px;
                                                                    mso-padding-alt: 15px
                                                                      35px;
                                                                    font-family: 'PT Sans',
                                                                      Arial,
                                                                      sans-serif;
                                                                    text-align: center;
                                                                    font-weight: bold;
                                                                    text-transform: uppercase;
                                                                    min-width: auto !important;
                                                                    border-radius: 10px;
                                                                    background: linear-gradient(
                                                                      90deg,
                                                                      #5170ff,
                                                                      #ff66c4
                                                                    );
                                                                    color: #ffffff;
                                                                  "
                                                                >
                                                                  <div
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
                                                                      >ORDER
                                                                      DETAILS</span
                                                                    >
                                                                  </div>
                                                                </td>
                                                              </tr>
                                                            </table>
                                                            <!-- END Button -->
                                                          </td>
                                                        </tr>
                                                        <tr>
                                                          <td
                                                            class="pb-30"
                                                            style="
                                                              padding-bottom: 30px;
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
                                                                          >Shipping
                                                                          details</strong
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
                                                                        ${
                                                                          order
                                                                            .address
                                                                            .address1
                                                                        },${
        order.address.address2
      },${order.address.city},${order.address.state},${
        order.address.country
      },Pin : ${order.address.postcode}
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
                                                              </tr>
                                                            </table>
                                                          </td>
                                                        </tr>
                                                        <tr>
                                                          <td
                                                            class="pb-40"
                                                            style="
                                                              padding-bottom: 40px;
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
                                                        ${order.items
                                                          .map(
                                                            (item, index) =>
                                                              `<tr>
                                                              <td
                                                                class="pb-30"
                                                                style="
                                                              padding-bottom: 30px;
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
                                                                      <div
                                                                        class="fluid-img"
                                                                        style="
                                                                      font-size: 0pt;
                                                                      line-height: 0pt;
                                                                      text-align: left;
                                                                    "
                                                                      >
                                                                        <a
                                                                          href="#"
                                                                          target="_blank"
                                                                        >
                                                                          <img
                                                                            src="${
                                                                              constants.renderUrl
                                                                            }uploads/products/${
                                                                item.images[0]
                                                              }"
                                                                            border="0"
                                                                            width="230"
                                                                            height="180"
                                                                            alt=""
                                                                          />
                                                                        </a>
                                                                      </div>
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
                                                                            <strong>
                                                                              ${
                                                                                item.name
                                                                              }
                                                                            </strong>
                                                                          </td>
                                                                        </tr>
                                                                        <tr>
                                                                          <td
                                                                            class="text-16 lh-26 c-black"
                                                                            style="
                                                                          font-size: 16px;
                                                                          font-family: 'PT Sans',
                                                                            Arial,
                                                                            sans-serif;
                                                                          text-align: left;
                                                                          min-width: auto !important;
                                                                          line-height: 26px;
                                                                          color: #282828;
                                                                        "
                                                                          >
                                                                            ${
                                                                              item.color &&
                                                                              `<strong>
                                                                            Color:
                                                                          </strong>
                                                                          ${item.color.name}`
                                                                            }
                                                                            <br />
                                                                            <strong>
                                                                              Qty:
                                                                            </strong>
                                                                            ${
                                                                              item.quantity
                                                                            }
                                                                            <br />
                                                                            <strong>
                                                                              Price:
                                                                            </strong>
                                                                            ₹${
                                                                              item.totalPrice
                                                                            }
                                                                          </td>
                                                                        </tr>
                                                                      </table>
                                                                    </th>
                                                                  </tr>
                                                                </table>
                                                              </td>
                                                            </tr>`
                                                          )
                                                          .join("")}
                                                        <tr>
                                                          <td
                                                            class="pt-10 pb-40"
                                                            style="
                                                              padding-top: 10px;
                                                              padding-bottom: 40px;
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
                                                        <tr>
                                                          <td
                                                            class="pb-30"
                                                            style="
                                                              padding-bottom: 30px;
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
                                                                        class="pb-15"
                                                                        style="
                                                                          padding-bottom: 15px;
                                                                        "
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
                                                                              ₹${
                                                                                order.ordertotal
                                                                              }
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
                                                                              ₹0.00
                                                                            </td>
                                                                          </tr>
                                                                        </table>
                                                                      </td>
                                                                    </tr>
                                                                    <tr>
                                                                      <td
                                                                        align="right"
                                                                      >
                                                                        <!-- Button -->
                                                                        <table
                                                                          border="0"
                                                                          cellspacing="0"
                                                                          cellpadding="0"
                                                                          class="mw-100p"
                                                                          style="
                                                                            min-width: 200px;
                                                                          "
                                                                        >
                                                                          <tr>
                                                                            <td
                                                                              class="btn-20 btn-secondary c-white l-white"
                                                                              bgcolor="#f3189e"
                                                                              style="
                                                                                font-size: 20px;
                                                                                line-height: 24px;
                                                                                mso-padding-alt: 15px
                                                                                  35px;
                                                                                font-family: 'PT Sans',
                                                                                  Arial,
                                                                                  sans-serif;
                                                                                text-align: center;
                                                                                font-weight: bold;
                                                                                text-transform: uppercase;
                                                                                min-width: auto !important;
                                                                                border-radius: 10px;
                                                                                background: linear-gradient(
                                                                                  90deg,
                                                                                  #5170ff,
                                                                                  #ff66c4
                                                                                );
                                                                                color: #ffffff;
                                                                              "
                                                                            >
                                                                              <a
                                                                                href="#"
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
                                                                                  >TOTAL:
                                                                                  ₹${
                                                                                    order.ordertotal
                                                                                  }</span
                                                                                >
                                                                              </a>
                                                                            </td>
                                                                          </tr>
                                                                        </table>
                                                                        <!-- END Button -->
                                                                      </td>
                                                                    </tr>
                                                                  </table>
                                                                </th>
                                                              </tr>
                                                            </table>
                                                          </td>
                                                        </tr>
                                                        <tr>
                                                          <td
                                                            class="pb-30"
                                                            style="
                                                              padding-bottom: 30px;
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
                                                            <em
                                                              >Thank you for choosing
                                                              our service. We hope you
                                                              enjoy your products!
                                                            </em>
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
                                                                    href="${
                                                                      constants.frontUrl
                                                                    }profile/{user._id}"
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
                                                                      >VIEW MY
                                                                      ORDER</span
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
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
  }
};

const createOrder = async (req, res) => {
  try {
    const {
      firstName,
      address1,
      phone,
      email,
      address2,
      city,
      state,
      postcode,
      orderNotes,
      country,
      items,
      ordertotal,
      appliedCoupon,
      discountedPrice,
    } = req.body;
    // console.log(req.body);
    const user = req.user;

    // Save the order in the database
    const order = await Order.create({
      user: user ? user : null,
      firstName,
      address: {
        address1,
        address2,
        city,
        state,
        country,
        postcode,
      },
      phone,
      email,
      orderNotes,
      items,
      ordertotal,
      appliedCoupon: {
        code: appliedCoupon,
        discountedPrice: discountedPrice,
      },
      paymentStatus: false,
    });
    const orderid = order._id;
    // Send an email to the user
    // await sendOrderConfirmation(order);
    if (user) {
      await Cart.updateOne({ user: req.user }, { $set: { items: [] } });
    }

    return res
      .status(200)
      .send({ message: "Order placed successfully", orderid: orderid });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ message: "Failed to create order" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "-password");
    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error retrieving orders:", error);
    return res.status(500).json({ message: "Failed to retrieve orders" });
  }
};

const getSingleOrder = async (req, res) => {
  try {
    const { oid } = req.body;
    const order = await Order.findById(oid).populate("user", "-password");
    return res.status(200).json(order);
  } catch (error) {
    console.error("Error retrieving orders:", error);
    return res.status(500).json({ message: "Failed to retrieve orders" });
  }
};

const getAllOrdersforuser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    const orders = await Order.find({ user: user._id })
      .populate("user", "-password")
      .sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error retrieving orders:", error);
    return res.status(500).json({ message: "Failed to retrieve orders" });
  }
};

const packOrder = async (req, res) => {
  const orderId = req.params.orderId;
  const { orderstatus, deliverydetails } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        orderstatus,
        deliverydetails:
          orderstatus === "out_for_delivery" ? deliverydetails : "",
      },
      { new: true }
    ).populate("user", "-password");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (orderstatus === "confirmed") {
      await sendOrderConfirmation(order);
    }
    if (orderstatus === "out_for_delivery") {
      await sendOrderPackedEmail(order, deliverydetails);
    }

    return res
      .status(200)
      .json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({ message: "Failed to update order status" });
  }
};

const sendOrderPackedEmail = async (order, details) => {
  try {
    const mailOptions = {
      from: constants.adminEmail,
      to: order.email,
      subject: "Order Packed and Out for Delivery",
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
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
              color: #3c0125;
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
              color: #61033d;
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
                                                      style="
                                                        padding-bottom: 50px;
                                                        padding-top: 20px;
                                                      "
                                                    >
                                                      <hr />
                                                      <table
                                                        width="100%"
                                                        border="0"
                                                        cellspacing="0"
                                                        cellpadding="0"
                                                      >
                                                        <tr>
                                                          <td
                                                            class="title-36 a-center pb-15"
                                                            style="
                                                              padding-top: 10px;
                                                              font-size: 25px;
                                                              line-height: 40px;
                                                              color: #282828;
                                                              font-family: 'PT Sans',
                                                                Arial, sans-serif;
                                                              min-width: auto !important;
                                                              text-align: center;
                                                              padding-bottom: 15px;
                                                            "
                                                          >
                                                            <strong
                                                              >Your order is on its
                                                              way to you!</strong
                                                            >
                                                          </td>
                                                        </tr>
                                                        <tr>
                                                          <td
                                                            class="text-16 lh-26 a-center"
                                                            style="
                                                              font-size: 16px;
                                                              color: #6e6e6e;
                                                              font-family: 'PT Sans',
                                                                Arial, sans-serif;
                                                              min-width: auto !important;
                                                              line-height: 26px;
                                                              text-align: center;
                                                            "
                                                          >
                                                            Your Order is Packed and
                                                            Out for delivery.
                                                          </td>
                                                        </tr>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                </table>
                                                <!-- END Section - Intro -->
      
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
                                                        <tr>
                                                          <td
                                                            class="pb-30"
                                                            style="
                                                              padding-bottom: 30px;
                                                            "
                                                          >
                                                            <!-- Button -->
                                                            <table
                                                              width="100%"
                                                              border="0"
                                                              cellspacing="0"
                                                              cellpadding="0"
                                                            >
                                                              <tr>
                                                                <td
                                                                  class="btn-20 btn-secondary c-white l-white"
                                                                  bgcolor="#f3189e"
                                                                  style="
                                                                    font-size: 20px;
                                                                    line-height: 24px;
                                                                    mso-padding-alt: 15px
                                                                      35px;
                                                                    font-family: 'PT Sans',
                                                                      Arial,
                                                                      sans-serif;
                                                                    text-align: center;
                                                                    font-weight: bold;
                                                                    text-transform: uppercase;
                                                                    min-width: auto !important;
                                                                    border-radius: 10px;
                                                                    background: linear-gradient(
                                                                      90deg,
                                                                      #5170ff,
                                                                      #ff66c4
                                                                    );
                                                                    color: #ffffff;
                                                                  "
                                                                >
                                                                  <div
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
                                                                      >ORDER
                                                                      DETAILS</span
                                                                    >
                                                                  </div>
                                                                </td>
                                                              </tr>
                                                            </table>
                                                            <!-- END Button -->
                                                          </td>
                                                        </tr>
                                                        <tr>
                                                          <td
                                                            class="pb-30"
                                                            style="
                                                              padding-bottom: 30px;
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
                                                                          >Shipping
                                                                          details</strong
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
                                                                        ${
                                                                          order
                                                                            .address
                                                                            .address1
                                                                        },${
        order.address.address2
      },${order.address.city},${order.address.state},${
        order.address.country
      },Pin : ${order.address.postcode}
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
                                                                          >Estimated
                                                                          arrival</strong
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
                                                                        3 - 4 DAYS
                                                                      </td>
                                                                    </tr>
                                                                  </table>
                                                                </th>
                                                              </tr>
                                                            </table>
                                                          </td>
                                                        </tr>
                                                        <tr>
                                                          <td
                                                            class="pb-40"
                                                            style="
                                                              padding-bottom: 40px;
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
                                                        ${order.items
                                                          .map(
                                                            (item, index) =>
                                                              `<tr>
                                                              <td
                                                                class="pb-30"
                                                                style="
                                                              padding-bottom: 30px;
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
                                                                      <div
                                                                        class="fluid-img"
                                                                        style="
                                                                      font-size: 0pt;
                                                                      line-height: 0pt;
                                                                      text-align: left;
                                                                    "
                                                                      >
                                                                        <a
                                                                          href="#"
                                                                          target="_blank"
                                                                        >
                                                                          <img
                                                                            src="${
                                                                              constants.renderUrl
                                                                            }uploads/products/${
                                                                item.images[0]
                                                              }"
                                                                            border="0"
                                                                            width="230"
                                                                            height="180"
                                                                            alt=""
                                                                          />
                                                                        </a>
                                                                      </div>
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
                                                                            <strong>
                                                                              ${
                                                                                item.name
                                                                              }
                                                                            </strong>
                                                                          </td>
                                                                        </tr>
                                                                        <tr>
                                                                          <td
                                                                            class="text-16 lh-26 c-black"
                                                                            style="
                                                                          font-size: 16px;
                                                                          font-family: 'PT Sans',
                                                                            Arial,
                                                                            sans-serif;
                                                                          text-align: left;
                                                                          min-width: auto !important;
                                                                          line-height: 26px;
                                                                          color: #282828;
                                                                        "
                                                                          >
                                                                            ${
                                                                              item.color &&
                                                                              `<strong>
                                                                            Color:
                                                                          </strong>
                                                                          ${item.color.name}`
                                                                            }
                                                                            <br />
                                                                            <strong>
                                                                              Qty:
                                                                            </strong>
                                                                            ${
                                                                              item.quantity
                                                                            }
                                                                            <br />
                                                                            <strong>
                                                                              Price:
                                                                            </strong>
                                                                            ₹${
                                                                              item.totalPrice
                                                                            }
                                                                          </td>
                                                                        </tr>
                                                                      </table>
                                                                    </th>
                                                                  </tr>
                                                                </table>
                                                              </td>
                                                            </tr>`
                                                          )
                                                          .join("")}
                                                        <tr>
                                                          <td
                                                            class="pt-10 pb-40"
                                                            style="
                                                              padding-top: 10px;
                                                              padding-bottom: 40px;
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
                                                        <tr>
                                                          <td
                                                            class="pb-30"
                                                            style="
                                                              padding-bottom: 30px;
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
                                                                        class="pb-15"
                                                                        style="
                                                                          padding-bottom: 15px;
                                                                        "
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
                                                                              ₹${
                                                                                order.ordertotal
                                                                              }
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
                                                                              ₹0.00
                                                                            </td>
                                                                          </tr>
                                                                        </table>
                                                                      </td>
                                                                    </tr>
                                                                    <tr>
                                                                      <td
                                                                        align="right"
                                                                      >
                                                                        <!-- Button -->
                                                                        <table
                                                                          border="0"
                                                                          cellspacing="0"
                                                                          cellpadding="0"
                                                                          class="mw-100p"
                                                                          style="
                                                                            min-width: 200px;
                                                                          "
                                                                        >
                                                                          <tr>
                                                                            <td
                                                                              class="btn-20 btn-secondary c-white l-white"
                                                                              bgcolor="#f3189e"
                                                                              style="
                                                                                font-size: 20px;
                                                                                line-height: 24px;
                                                                                mso-padding-alt: 15px
                                                                                  35px;
                                                                                font-family: 'PT Sans',
                                                                                  Arial,
                                                                                  sans-serif;
                                                                                text-align: center;
                                                                                font-weight: bold;
                                                                                text-transform: uppercase;
                                                                                min-width: auto !important;
                                                                                border-radius: 10px;
                                                                                background: linear-gradient(
                                                                                  90deg,
                                                                                  #5170ff,
                                                                                  #ff66c4
                                                                                );
                                                                                color: #ffffff;
                                                                              "
                                                                            >
                                                                              <a
                                                                                href="#"
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
                                                                                  >TOTAL:
                                                                                  ₹${
                                                                                    order.ordertotal
                                                                                  }</span
                                                                                >
                                                                              </a>
                                                                            </td>
                                                                          </tr>
                                                                        </table>
                                                                        <!-- END Button -->
                                                                      </td>
                                                                    </tr>
                                                                  </table>
                                                                </th>
                                                              </tr>
                                                            </table>
                                                          </td>
                                                        </tr>
                                                        <tr>
                                                          <td
                                                            class="pb-30"
                                                            style="
                                                              padding-bottom: 30px;
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
                                                            <em
                                                              >Thank you for choosing
                                                              our service. We hope you
                                                              enjoy your products!
                                                            </em>
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
                                                                    href="${
                                                                      constants.frontUrl
                                                                    }profile/{user._id}"
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
                                                                      >VIEW MY
                                                                      ORDER</span
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
      `,
    };
    console.log(mailOptions);
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending order packed email:", error);
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const orderId = req.params.id; // Assuming the order ID is sent as a URL parameter

    // Find the order by ID
    const order = await Order.findById(orderId).populate("user", "-password");
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Update the paymentStatus to true
    order.paymentStatus = true;
    await order.save();

    await sendOrderConfirmation(order);

    // Send a response indicating success
    res.status(200).json({ message: "Payment status updated successfully" });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  packOrder,
  updatePaymentStatus,
  getAllOrdersforuser,
  getSingleOrder,
};
