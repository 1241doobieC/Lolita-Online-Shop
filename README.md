## 使用說明

- 安裝： `pnpm install`
- 執行： `pnpm start`
- 資料庫： [`MongoDB`](<https://www.mongodb.com/docs/drivers/node/current/fundamentals/connection/>)
    - Set `DB_CONNECT`, `MONGODB_URI` in your `.env`
    - Create following collections: `orders`, `products`, `sessions`, `users`
- OAuth 2.0
    - Using Google OAuth 2.0, see [`(Tutor)`](<https://israynotarray.com/nodejs/20220525/790433249/>)
    - `SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` are required in `.env`
-  Email sending, see [`(Tutor)`](<https://israynotarray.com/nodejs/20230722/1626712457/>) 
    - Nodemailer + Gmail (Google OAuth 2.0 is required)
    - `GMAIL_ACCOUNT`, `GMAIL_PASSWORD` are required in `.env`


## 實作功能
- [x] 第三方登入
- [x] email驗證信箱
- [ ] Server side Validation
- [ ] Stripe/ Line Pay 串接
- [ ] WebSockets
- [x] 使用者可以CRUD