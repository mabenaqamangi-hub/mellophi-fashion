# MELLOPHI FASHION - E-Commerce Website

> **Status:** 95% Ready for Publication ✅  
> A modern, elegant fashion e-commerce website featuring a soft nude aesthetic with complete backend, payment integration, and admin dashboard.

---

## 🎯 Quick Start

### First Time Setup (5 minutes)

1. **Install MySQL** - https://dev.mysql.com/downloads/ or XAMPP
2. **Install Node.js** - https://nodejs.org/
3. **Run Setup:**
   ```powershell
   ./SETUP.bat
   ```
4. **Configure Database:** Edit `backend/.env` with your MySQL credentials
5. **Create Database:** Run `setup-mysql.sql` or create manually
6. **Start & Seed:**
   ```powershell
   cd backend
   npm start              # Start backend
   npm run seed           # Seed products (in new terminal)
   ```
7. **Open Website:**
   ```powershell
   ./START.bat           # Opens at http://localhost:3000
   ```

**Admin Login:** http://localhost:3000/admin/login.html  
- Email: `admin@mellophifashion.com`  
- Password: `Admin123!`

📖 **Detailed Guide:** See [FINAL_DEPLOYMENT_GUIDE.md](FINAL_DEPLOYMENT_GUIDE.md)

---

## 🌟 Features

### Customer Features
- 🛍️ **Product Browsing** - Filter by category, color, size, price
- ❤️ **Wishlist** - Save favorite items
- 🛒 **Shopping Cart** - Add, update, remove items
- 💳 **Multiple Payments** - PayGate (cards), EFT, Cash on Delivery
- 📱 **Fully Responsive** - Works on all devices
- 🔍 **Product Search** - Find items quickly

### Admin Features
- 📊 **Dashboard** - Sales, orders, revenue statistics
- 👗 **Product Management** - Add, edit, delete products
- 📦 **Order Management** - Track and update orders
- 💰 **Payment Tracking** - Monitor payment status
- ⚙️ **Settings** - Configure bank details
- 🖼️ **Image Upload** - Upload product photos

### Technical Features
- ✅ **MySQL Database** - Reliable data storage
- ✅ **RESTful API** - Node.js/Express backend
- ✅ **JWT Authentication** - Secure admin access
- ✅ **PayGate Integration** - South African payment gateway
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **No Framework** - Vanilla JavaScript (fast & lightweight)

---

## 📁 Project Structure

```
MELLOPHI 2 WEBSITE/
├── 📄 index.html              # Homepage
├── 📄 shop.html               # Products listing
├── 📄 product.html            # Product details
├── 📄 checkout.html           # Cart & checkout
├── 📄 about.html              # About page
├── 📄 contact.html            # Contact page
├── 📄 payment-return.html     # Payment success/fail
│
├── 📁 css/                    # Stylesheets
├── 📁 js/                     # JavaScript files
│   ├── config.js              # ⚙️ API configuration
│   ├── main.js                # Core functionality
│   ├── shop.js                # Shop page logic
│   ├── checkout.js            # Checkout logic
│   └── ...
│
├── 📁 images/                 # Product images
│   └── PRODUCTS/              # 47 product images
│
├── 📁 admin/                  # Admin dashboard
│   ├── login.html             # Admin login
│   ├── dashboard.html         # Main dashboard
│   ├── settings.html          # Settings page
│   └── admin-script.js        # Admin logic
│
├── 📁 backend/                # Node.js Backend
│   ├── server.js              # Express server
│   ├── package.json           # Dependencies
│   ├── .env                   # ⚙️ Configuration
│   ├── 📁 models/             # Database models
│   ├── 📁 routes/             # API routes
│   ├── 📁 middleware/         # Auth & uploads
│   └── 📁 scripts/            # Seed scripts
│
└── 📁 Documentation/
    ├── FINAL_DEPLOYMENT_GUIDE.md    # 🚀 How to deploy
    ├── PRE_LAUNCH_CHECKLIST.md      # ✅ Pre-launch tasks
    ├── QUICK_REFERENCE.md           # 📖 Quick commands
    └── ...
```

---

## 🎨 Design & Aesthetic

### Color Palette
```css
--nude-primary: #E8D5C4;    /* Primary nude */
--nude-secondary: #D4BBA8;  /* Secondary beige */
--nude-light: #F5EBE0;      /* Light cream */
--champagne: #D4AF7A;       /* Champagne gold accent */
--off-white: #FAF8F5;       /* Background */
--text-primary: #5C4F44;    /* Headings */
```

### Typography
- **Headings:** Cormorant Garamond (serif, elegant)
- **Body:** Montserrat (sans-serif, clean)

### Design Philosophy
- Minimalist & elegant
- Soft nude aesthetic
- Smooth animations
- Mobile-first approach

---

## 💳 Payment Integration

### Supported Methods
1. **PayGate** - Credit/Debit cards (Visa, Mastercard)
2. **EFT/Bank Transfer** - Direct bank deposit
3. **Cash on Delivery** - Pay when you receive

### PayGate Configuration
- Merchant ID: `12975260`
- Test mode available
- Automatic redirect after payment
- Order status updates

📖 **Setup Guide:** [PAYGATE_INTEGRATION.md](PAYGATE_INTEGRATION.md)

---

## 📊 Admin Dashboard

### Features
- 📈 Real-time statistics
- 📦 Order management
- 👗 Product CRUD operations
- 🖼️ Image uploads
- ⚙️ Settings configuration
- 🔐 Secure JWT authentication

### Access
- **URL:** http://localhost:3000/admin/login.html
- **Email:** admin@mellophifashion.com
- **Password:** Admin123! (change after first login)

📖 **Admin Guide:** [ADMIN_USER_GUIDE.md](ADMIN_USER_GUIDE.md)

---

## 🚀 Deployment

### Before Publishing

✅ **Required:**
1. MySQL database installed and configured
2. Backend `.env` file configured
3. Products seeded to database
4. Admin login tested
5. API URLs updated for production
6. Test checkout flow completed

✅ **Recommended:**
- [ ] Change default admin password
- [ ] Update bank details in settings
- [ ] Test on mobile devices
- [ ] Verify PayGate integration
- [ ] Enable HTTPS on hosting

### Quick Deployment

See comprehensive guides:
- 📋 [FINAL_DEPLOYMENT_GUIDE.md](FINAL_DEPLOYMENT_GUIDE.md) - Complete deployment steps
- ✅ [PRE_LAUNCH_CHECKLIST.md](PRE_LAUNCH_CHECKLIST.md) - Everything to check before launch

---

## 📱 URLs & Endpoints

### Development URLs
| Page | URL |
|------|-----|
| Homepage | http://localhost:3000 |
| Shop | http://localhost:3000/shop.html |
| Admin Login | http://localhost:3000/admin/login.html |
| Backend API | http://localhost:5000/api |

### API Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/products` | GET | Get all products |
| `/api/products/:id` | GET | Get single product |
| `/api/orders` | POST | Create order |
| `/api/auth/login` | POST | Admin login |
| `/api/paygate/initiate` | POST | Start PayGate payment |

📖 **API Docs:** See `backend/README.md`

---

## 🛠️ Technologies

### Frontend
- HTML5, CSS3 (Grid, Flexbox, Custom Properties)
- Vanilla JavaScript (ES6+)
- LocalStorage for cart/wishlist
- Responsive design

### Backend
- Node.js + Express.js
- MySQL + Sequelize ORM
- JWT authentication
- Multer for file uploads
- bcryptjs for password hashing

### Payment
- PayGate API integration
- EFT banking details

---

## 📞 Business Information

**MELLOPHI Fashion**
- 📧 Email: info@mellophifashion.co.za
- 📱 WhatsApp: +27 65 045 8081
- 📸 Instagram: [@mellophi_fashion](https://www.instagram.com/mellophi_fashion)
- 📘 Facebook: [MELLOPHI Fashion](https://www.facebook.com/share/1CN6chMwrR/)
- 🎵 TikTok: [@mellophifashion](https://www.tiktok.com/@mellophifashion)

---

---

## 📖 Documentation

### Setup & Deployment
- 📋 [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Quick commands & troubleshooting
- 🚀 [FINAL_DEPLOYMENT_GUIDE.md](FINAL_DEPLOYMENT_GUIDE.md) - Complete deployment guide
- ✅ [PRE_LAUNCH_CHECKLIST.md](PRE_LAUNCH_CHECKLIST.md) - Pre-launch checklist
- ⚡ [QUICK_START.md](QUICK_START.md) - Quick start guide

### Features & Configuration
- 💳 [PAYGATE_INTEGRATION.md](PAYGATE_INTEGRATION.md) - Payment setup
- 👤 [ADMIN_USER_GUIDE.md](ADMIN_USER_GUIDE.md) - Admin dashboard guide
- 🏦 [BANK_DETAILS_SETUP_GUIDE.md](BANK_DETAILS_SETUP_GUIDE.md) - Bank details config
- 📦 [CHECKOUT_IMPLEMENTATION_GUIDE.md](CHECKOUT_IMPLEMENTATION_GUIDE.md) - Checkout guide

---

## 🆘 Troubleshooting

### Common Issues

**Backend won't start**
```
✅ Check MySQL is running
✅ Verify .env credentials are correct
✅ Ensure database exists
✅ Run npm install in backend folder
```

**Products not showing**
```
✅ Backend must be running
✅ Run npm run seed to populate products
✅ Check API URL in js/config.js
✅ Check browser console for errors
```

**Admin can't login**
```
✅ Run seed script to create admin user
✅ Use: admin@mellophifashion.com / Admin123!
✅ Backend must be running
✅ Clear browser cache/localStorage
```

---

## 🔧 Development Commands

```powershell
# Setup (first time)
./SETUP.bat                    # Install & configure

# Start services
./START.bat                    # Start frontend
./SETUP_AND_START.bat         # Start everything

# Backend commands
cd backend
npm start                      # Start server
npm run dev                    # Start with nodemon
npm run seed                   # Seed database
```

---

## 🎯 Current Status

✅ **Completed:**
- Frontend design & implementation
- Backend API with MySQL
- Admin dashboard
- Payment integration (PayGate)
- Product management
- Order tracking
- 47 products with images
- Responsive design

⚠️ **Before Launch:**
- Install MySQL database
- Configure `.env` file
- Seed products to database
- Update API URLs for production
- Test complete checkout flow
- Deploy to hosting

**Progress:** 95% Complete ✅

---

## 🙏 Support

Need help? Check the documentation files or:
1. Review error messages carefully
2. Check [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for common issues
3. Verify all prerequisites are installed
4. Ensure backend is running before testing frontend

---

**🎉 Ready to launch your fashion empire!**

Follow the [FINAL_DEPLOYMENT_GUIDE.md](FINAL_DEPLOYMENT_GUIDE.md) to go live.
        name: "Product Name",
        price: 450,
        category: "hoodies",
        color: "nude",
        size: ["S", "M", "L"],
        image: "images/product.jpg"
    }
];
```

### Update Contact Info
Edit contact information in `contact.html`:
- Email: mellophifashion@gmail.com
- WhatsApp: Update the link with your number

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🎯 Target Audience

Ages 16-35, fashion-forward individuals who appreciate:
- Minimalist aesthetics
- Nude/neutral color palettes
- Affordable luxury
- Sustainable fashion

## 📝 To-Do / Future Enhancements

- [x] Add payment processing (PayGate integration) ✅
- [ ] Implement user accounts/login
- [ ] Add product search functionality
- [ ] Create admin panel for product management
- [ ] Add order tracking
- [ ] Implement email notifications
- [ ] Add more payment methods (ApplePay, GooglePay)
- [ ] Create blog section
- [ ] Add live chat support

## 💳 Payment Integration

**PayGate is now integrated!** See [PAYGATE_INTEGRATION.md](PAYGATE_INTEGRATION.md) for full documentation.

- Merchant ID: 12975260
- Supports: Cards, EFT, Instant EFT
- Quick Reference: [PAYGATE_QUICK_REFERENCE.md](PAYGATE_QUICK_REFERENCE.md)

## 📞 Support

For questions or support:
- Email: mellophifashion@gmail.com
- WhatsApp: [Add your number]

## 📄 License

This project is for Mellophi Fashion. All rights reserved.

---

**Built with ♡ for Mellophi Fashion**
*Soft. Stylish. Confident.*
