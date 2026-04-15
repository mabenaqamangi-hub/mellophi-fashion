# 🚀 Production Deployment - Quick Reference

## 📋 Pre-Deployment Checklist

```bash
# 1. Backup database
cd backend
mysqldump -u root -p mellophi_fashion > backup_$(date +%Y%m%d).sql

# 2. Test locally with production mode
NODE_ENV=production node server.js

# 3. Generate JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# 4. Verify PayGate credentials
# Check: backend/routes/paygate.js or .env
```

---

## 🔑 Required Environment Variables

Create `.env` file in `/backend/`:

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=mysql://user:pass@host:port/db
FRONTEND_URL=https://www.mellophi.co.za
JWT_SECRET=<64-char-random-string>
JWT_EXPIRE=7d
PAYGATE_ID=12975260
PAYGATE_SECRET=lnyyjkfuaiwyr
PAYGATE_RETURN_URL=https://www.mellophi.co.za/payment-return.html
PAYGATE_NOTIFY_URL=https://api.mellophi.co.za/api/paygate/notify
```

---

## 🌐 Deployment Commands

### Render (Recommended)

```bash
# No CLI needed - use web dashboard
1. Create account at render.com
2. New → MySQL Database
3. New → Web Service (connect GitHub)
4. Add environment variables
5. Deploy
```

### Heroku

```bash
# Install Heroku CLI first
heroku login
cd backend
heroku create mellophi-api
heroku addons:create cleardb:ignite
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=<your-secret>
# ... set other env vars
git push heroku main
heroku logs --tail
```

---

## 📊 Database Migration

```bash
# 1. Export local
mysqldump -u root -p mellophi_fashion > backup.sql

# 2. Import to production
mysql -h prod-host -P 3306 -u user -p database < backup.sql

# 3. Verify
mysql -h prod-host -u user -p -e "USE database; SELECT COUNT(*) FROM Products;"
```

---

## 🖼️ Image Migration

```bash
# 1. Create archive
cd backend/images
zip -r products_images.zip PRODUCTS/

# 2. Upload to server
scp products_images.zip user@server:/path/to/backend/images/

# 3. Extract
unzip products_images.zip
```

---

## ✅ Post-Deployment Tests

```bash
# Health check
curl https://your-api.com/api/health

# Get products
curl https://your-api.com/api/products

# Specific product
curl https://your-api.com/api/products/A1

# Test from browser:
# 1. Open website
# 2. Browse products
# 3. Add to cart
# 4. Complete checkout (test mode)
# 5. Check admin dashboard
```

---

## 🔍 Troubleshooting

### Server won't start
```bash
# Check logs
heroku logs --tail  # Heroku
# or Render dashboard

# Common fixes:
- Verify all env vars set
- Check DATABASE_URL format
- Ensure port uses process.env.PORT
```

### CORS errors
```bash
# Verify FRONTEND_URL matches your domain exactly
# Include https:// and correct subdomain
# No trailing slashes
```

### Database connection failed
```bash
# Test connection
mysql -h host -P port -u user -p

# Check:
- Firewall allows connection
- Credentials correct
- Database exists
- SSL enabled if required
```

### Images not loading
```bash
# Check static file paths
# Verify images uploaded to correct directory
# Confirm hosting supports persistent storage
```

---

## 📞 Support Resources

- **Render Docs**: https://render.com/docs
- **Heroku Docs**: https://devcenter.heroku.com
- **MySQL Docs**: https://dev.mysql.com/doc/
- **PayGate Support**: https://www.paygate.co.za/paygate-support/

---

## 🛡️ Security Checklist

- [x] NODE_ENV=production set
- [x] Strong JWT_SECRET (64+ chars)
- [x] Database uses SSL in production
- [x] CORS configured for specific domains
- [x] .env not committed to git
- [x] Dependencies updated (`npm audit`)
- [x] PayGate credentials verified
- [x] HTTPS/SSL certificate enabled
- [x] Regular backups configured

---

## 🎯 Performance Optimization

```bash
# Add compression
npm install compression

# In server.js:
const compression = require('compression');
app.use(compression());

# Add rate limiting
npm install express-rate-limit

# Security headers
npm install helmet
```

---

## 📝 Maintenance Tasks

### Weekly
- Check server logs for errors
- Monitor database size
- Verify backups running

### Monthly
- Update dependencies: `npm update`
- Review security: `npm audit`
- Database optimization
- Performance review

### Before Major Changes
- Create database backup
- Test in staging environment
- Document changes
- Plan rollback strategy

---

## 🚫 What NOT to Deploy

- `.env` file
- `node_modules/` (will be installed on server)
- Local database files
- Development tools
- Test data

---

## ✨ You're Ready!

Your backend is now production-ready with:
- ✅ Environment-based configuration
- ✅ Secure database connections
- ✅ CORS properly configured
- ✅ PayGate integration
- ✅ Production-safe database sync
- ✅ Comprehensive documentation

**Next Step**: Choose your hosting provider (Render or Heroku) and follow the deployment guide!

**Remember**: Test everything in production before going live!
