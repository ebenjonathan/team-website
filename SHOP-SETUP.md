# TEAM shop: setup and running it

The shop sells the TEAM Culture Engine tools at **/shop**. There are no card
payments: the customer receives a pro-forma invoice by email, pays by bank
transfer into the ZB Bank (US$) or FNB (rand) account, uploads proof of payment,
and you confirm the payment in **/admin → Shop orders**.

## 1. Switch it on (Vercel environment variables)

Most of these are already needed by the rest of the site.

| Variable | What it does |
| --- | --- |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Stores orders, invoice numbers and the exchange rate. Without them the shop refuses orders on Vercel instead of losing them. |
| `RESEND_API_KEY`, `RESEND_FROM` | Sends the invoice and order emails. `RESEND_FROM` must be on a domain verified in Resend. Without an email provider, the shop refuses orders in production. |
| `ADMIN_NOTIFICATION_EMAIL` | Receives new-order alerts and proof-of-payment files (falls back to `ADMIN_EMAIL`). |
| `NEXT_PUBLIC_SITE_URL` | Used for the links in emails and on the invoice, e.g. `https://www.teamadvisoryservices.com`. |
| `CRON_SECRET` | Any long random string. Vercel sends it to the daily job (`vercel.json`), which refreshes the exchange rate, sends payment reminders and expires unpaid invoices. |

Redeploy after adding them.

## 2. Change products, prices or settings

Everything lives in **`lib/data/shop.ts`**:

- products, kits and their prices (US$, VAT included)
- bank accounts, VAT number, TIN and address shown on invoices
- delivery options: an option with `price: null` is hidden at checkout. **Harare delivery is set to free until you decide on a fee**, and courier options for the rest of Zimbabwe and South Africa are hidden until you give them prices.
- invoice validity (7 days) and numbering (`TEAM-WEB-0001` …)

Customer-facing text (ordering steps, payment, delivery, the **draft** returns
policy and FAQs) is in **`lib/data/shopContent.ts`**.

## 3. Day to day

1. A new order arrives: you get an email with the invoice PDF attached.
2. The customer uploads proof of payment: you get an email with the file attached
   (the file is not stored on the website).
3. When the money reflects, open **/admin → Shop orders**, click the order, choose
   the account it went into, check the amount and click **Mark as paid**. The
   customer is emailed an expected delivery date (3 working days, skipping
   weekends and the public holidays you list in the exchange-rate panel).
4. Click **Mark as dispatched** (or **Mark ready & email** for collections), and
   later **Mark as delivered**.
5. **Export CSV** gives you the orders for your invoicing system. Issue the tax
   invoice from your ZIMRA-fiscalised system after payment.

## 4. The rand exchange rate

- Fetched automatically every morning from Frankfurter (central-bank rates), with
  ExchangeRate-API as a backup. If the cached rate is more than 12 hours old, it
  also refreshes when someone orders.
- A new rate more than 5% away from the last one is rejected and you get an alert.
- With no successful update for 4 days, new invoices show only the ZB account.
- In the admin panel you can add a markup % (a cushion for rand movement and bank
  charges), set a manual override rate, or click **Update now**.
- Every invoice keeps the rate it was issued with until it expires.

## 5. Test it after deploying

1. In /admin → Shop orders, click **Update now** and check a rate appears.
2. Order one Card Deck using your own email address. Check the invoice PDF.
3. Upload any PDF as proof of payment from the order page; check the email.
4. Mark it as paid, then dispatched; check both customer emails.
5. Cancel the test order. Real orders continue the numbering (TEAM-WEB-0002 …).
   To restart at 0001, delete the `shop:seq`, `shop:orders` and `shop:order:*`
   keys in the Upstash console.
