## 使用說明

- 安裝： `pnpm install`
- 執行： `pnpm start`
- 資料庫： [`MongoDB`](<https://www.mongodb.com/docs/drivers/node/current/fundamentals/connection/>)
    - Set `DB_CONNECT`, `MONGODB_URI`, `SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` in your `.env`
    - Create following collections: `orders`, `products`, `sessions`, `users`


## 實作功能
- [x] 第三方登入
- [ ] email驗證信箱
- [ ] Stripe 串接
- [ ] 使用者可即時聊天
- [x] 使用者可以CRUD