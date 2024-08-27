export const Userslist = [
  {
    id: 1,
    name: "John Doe",
    email: "johndoe@example.com",
    address: "123 Main St, City, Country",
    phone: "+1 123-456-7890",
    paymentMethod: "Credit Card",
    creditCard: {
      cardNumber: "**** **** **** 1234",
      expiryDate: "12/25",
      cvv: "***",
    },
    promocode: [
      { code: "get50", discount: "50" },
      { code: "get20", discount: "20" },
      { code: "get60", discount: "60" },
    ],
    cart: [
      {
        productId: 1,
        name: "Product 1",
        quantity: 2,
        price: 9.99,
      },
      {
        productId: 2,
        name: "Product 2",
        quantity: 1,
        price: 19.99,
      },
    ],
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "janesmith@example.com",
    address: "456 Oak St, City, Country",
    phone: "+1 987-654-3210",
    paymentMethod: "PayPal",
    paypalEmail: "janesmith@example.com",
    cart: [
      {
        productId: 3,
        name: "Product 3",
        quantity: 3,
        price: 14.99,
      },
    ],
  },
];
