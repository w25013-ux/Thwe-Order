# Golden Wheel Motorbike Shop

![Golden Wheel showroom preview](public/og.png)

## Live Website

**[View the Golden Wheel Motorbike Shop →](https://thwe-order.vercel.app/)**

Repository: **[w25013-ux/Thwe-Order](https://github.com/w25013-ux/Thwe-Order)**

**Golden Wheel** is a fictional motorcycle shop website that I created as a portfolio project. I wanted it to feel like a real showroom rather than a simple product-list page, so visitors can browse motorcycles, compare models, add riding gear to the cart, complete a sample order, and check the order again using the generated order number.

> **Portfolio demo:** All motorcycles, stock information, store details, orders, and payments on this website are samples. No real payment is processed.

## What you can try

- Browse 16 motorcycles in different styles and colours
- Search by model or colour and filter by category, condition, and price
- Open each motorcycle to see its details before adding it to the cart
- Browse 8 accessory categories, with 8 different products in each category
- Change accessory quantities inside the cart
- Complete a simple demo checkout without entering real card information
- Receive a sample order number after checkout
- Use the order number to view purchased items again
- Switch between Japanese, English, and Myanmar language displays
- Use the site comfortably on desktop, tablet, and mobile screens

## Accessory categories

| Category | Items |
| --- | ---: |
| Helmets | 8 |
| Jackets | 8 |
| Gloves | 8 |
| Boots | 8 |
| Luggage | 8 |
| Phone mounts | 8 |
| Security | 8 |
| Covers | 8 |

## Demo order flow

1. Choose a motorcycle or accessory.
2. Add it to the cart.
3. Enter a sample name and phone number.
4. Confirm the demo order. The payment field is intentionally locked, so real card details cannot be entered.
5. Save the generated order number, such as `GW-XXXXXXXX`.
6. Enter that number in **Order Status** to view the order again.

## Built with

- Next.js 16 and React 19
- TypeScript
- Vinext and Vite
- Cloudflare Workers and D1
- Drizzle ORM
- Custom responsive CSS

## Run locally

This project requires Node.js `22.13.0` or newer.

```bash
npm install
npm run dev
```

Then open the local URL shown in the terminal.

Useful commands:

```bash
npm run build
npm run lint
npm test
```

## Notes

- The checkout shown to visitors is intentionally a safe demo checkout.
- Contact details are placeholders and the inquiry button does not send a real email.
- Product photographs and product information are prepared for this portfolio sample.
- A Stripe-ready API route exists for future development, but the current portfolio interface does not accept real payments.

## Why I made it

I built this project to practise creating a complete shopping experience, not only a visual landing page. While working on it, I focused on product filtering, cart state, responsive layout, order storage, order lookup, and making it clear to visitors that the website is a portfolio sample.

---

Created by **THI HA AUNG** as a web development portfolio project.
