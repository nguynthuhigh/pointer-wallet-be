<p align="center"> <a href="https://pointer.io.vn/" target="blank"><img src="https://i.imgur.com/5cYzRrm.png" width="120" alt="Pointer Logo" /></a> </p> <h2 align="center">Pointer Wallet Backend</h2> <h3 align="center"><a target="blank" href="https://pointer.io.vn/">🌐 Website</a> ·
<a target="blank" href="https://pointer.io.vn/">📈 Payment Service</a> ·
<a target="blank" href="https://www.npmjs.com/package/pointer-wallet">📦 Node Package Manage</a> ·
<a target="blank" href="https://nguynthuhigh.github.io/pointer-payment-service/"> 📃Docs</a>
</h3>

**Pointer Wallet Backend** is a backend solution for an e-wallet service, developed with Node.js, Express.js, MongoDB, and Redis. It offers essential features such as money transfer, deposit, withdrawal, and payment processing.

## 📄Features

1. 🔥**Transfer**: Ensures data integrity by accurately associating each transaction with the intended recipient. It leverages database transactions to manage operations and implements rollback mechanisms for error handling.
2. 💳 **Manage Card**: Allows customers can add, view, and delete their cards, which can be used for depositing or withdrawing money.
3. 💵 **Deposit**: Similar to a transfer, the deposit function requires necessary database transactions to ensure data consistency and integrity.
4. 💰 **Withdraw**: Facilitates withdrawing funds from the wallet securely and efficiently.
5. 🎟 **Manage Voucher**: Partners can create and edit their own vouchers. Customers will not be able to use these vouchers to apply discounts to their invoices during payment.
6. 📈 **Payment**: Enables seamless payments from the wallet, integrating with various services. [Read more](https://github.com/nguynthuhigh/pointer-payment-service)
7. 💶 **Connect Wallet**: Allows users to connect their wallet to external services or platforms for easy transactions. [Read more](https://github.com/nguynthuhigh/pointer-payment-service)

## 💡Security

🥇 **JWT Authentication**: Utilizes JSON Web Tokens (JWT) for secure **access** and **refresh token** management, ensuring that only authorized users can access sensitive operations.

🥈 **Transaction Security Code**: Each transaction requires a **security code**, which limits the number of attempts to enter the correct code. Users are notified in case of repeated failed attempts to enhance security.

🥉 **Transaction Limit**: Implements limits on **transfer**, **deposit**, and **withdrawal** amounts to prevent fraud and unauthorized transactions, ensuring that the system is secure and complies with safety standards.

## ⚙️Tech Stack

1. 📝 Express.js.
2. 🔧 MongoDB, Redis.
3. 📚 jsonwebtoken (JWT) , crypto, helmet, cookie-parser, node-cron, cloudinary...

## 💻 Installations

1. **Clone the repository**

```
git clone https://github.com/nguynthuhigh/pointer-wallet-be.git
```

2.  **Install npm dependencies**

```
cd pointer-wallet-be
npm install
```

3. **Create a `.env` File**

Create a `.env` file by copying from the `.env.example` template. Modify this file to configure your environment variables.

[View the `.env.example` here](https://github.com/nguynthuhigh/pointer-wallet-be/blob/main/.env.example)

4. **Run the project**

```
npm run dev
```

## 🐳 Docker

## ❓

**Why MongoDB for an E-Wallet Backend?**

As this is my first backend project and due to limited experience in system analysis, I chose MongoDB for its flexibility. Despite that, the system ensures **ACID compliance** in database operations by utilizing **transactions** and **constraints** for data consistency.
