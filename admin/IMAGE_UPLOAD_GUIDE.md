# Image Upload Guide for Admin Panel

## ✅ Image Upload Feature is Now Working!

The admin panel now supports uploading images directly from your computer. Here's how to use it:

---

## How to Add Products with Images

### Step 1: Login to Admin Panel
1. Open your browser and go to: `http://127.0.0.1:5500/admin/login.html`
2. Login with:
   - **Email:** admin@mellophi.co.za
   - **Password:** Admin123

### Step 2: Navigate to Products
1. Click on "Products" in the left sidebar
2. Click the "**+ Add New Product**" button

### Step 3: Fill in Product Details
Fill in all the required fields:
- **Product ID:** Unique identifier (e.g., A10, B5, C7)
- **Name:** Product name (e.g., "Summer Beach Dress")
- **Category:** Choose from Dress, Top, Bottom, or Set
- **Price:** Enter price in Rands (e.g., 599)
- **Stock:** Number of items in stock (e.g., 20)

### Step 4: Upload Images
1. Click on "**Choose Files**" button under "Product Images"
2. Select up to **5 images** from your computer
3. Supported formats: **JPG, PNG, GIF, WebP**
4. Maximum file size: **5MB per image**

### Step 5: Add Description and Options
- Write a product description
- Check boxes if the product is:
  - Featured Product
  - New Arrival
  - Best Seller

### Step 6: Save
1. Click "**Save Product**" button
2. Wait for success message
3. Your product with images is now live!

---

## Image Requirements

### Recommended Image Specifications:
- **Format:** JPG or PNG preferred
- **Size:** Maximum 5MB per image
- **Dimensions:** 800x1000px or higher for best quality
- **Background:** White or transparent recommended
- **File naming:** Use descriptive names (e.g., "summer-dress-front.jpg")

### Best Practices:
- Upload multiple angles: front, back, side, detail shots
- Use good lighting and clear photos
- Show product on model or flat lay
- First image will be the main product thumbnail
- Keep image file sizes reasonable for fast loading

---

## How Images are Stored

When you upload images through the admin panel:

1. **Upload Process:**
   - Images are uploaded to: `images/PRODUCTS/` folder
   - Each image gets a unique filename: `timestamp-originalname.jpg`
   - Paths are automatically saved to the database

2. **Image Paths in Database:**
   - Stored as: `images/PRODUCTS/1734567890-dress-front.jpg`
   - Multiple images stored as an array
   - First image is the primary product image

3. **Frontend Display:**
   - Images are served through: `http://localhost:5000/uploads/`
   - Automatically displayed on product pages
   - Thumbnails and full-size images generated

---

## Editing Products with Images

### To Update Product Images:
1. Go to Products page
2. Click "**Edit**" on the product you want to update
3. The form will show current product details
4. To add more images:
   - Click "Choose Files" and select new images
   - New images will be added to existing ones
5. Click "**Save Product**" to update

### To Replace Images:
Currently, new images are added to existing ones. If you need to completely replace images:
1. Delete the product
2. Create a new product with the correct images

---

## Troubleshooting

### Images Not Uploading?
✅ **Check file size:** Must be under 5MB per image
✅ **Check file format:** Only JPG, PNG, GIF, WebP allowed
✅ **Check internet connection:** Ensure stable connection
✅ **Check browser console:** Press F12 to see any errors

### Images Not Appearing on Frontend?
✅ **Ensure backend is running:** Should see "Server running on port 5000"
✅ **Check image paths:** Images should be in `images/PRODUCTS/` folder
✅ **Clear browser cache:** Press Ctrl+F5 to hard refresh
✅ **Check file permissions:** Ensure images folder is writable

### Upload Takes Too Long?
✅ **Reduce image file size:** Use image compression tools
✅ **Resize images:** 800x1000px is sufficient
✅ **Upload fewer images:** Maximum 5 at a time
✅ **Check internet speed:** Slow connection = slow upload

---

## Technical Details

### Backend Configuration:
- **Upload endpoint:** `POST /api/admin/upload`
- **Storage location:** `backend/../images/PRODUCTS/`
- **File size limit:** 5MB per file
- **Allowed types:** image/jpeg, image/png, image/gif, image/webp
- **Max files:** 5 images per upload

### Frontend Configuration:
- **Form encoding:** multipart/form-data
- **File input:** `<input type="file" name="images" multiple>`
- **API call:** Uses FormData instead of JSON

### File Naming:
- Original: `summer-dress.jpg`
- Stored as: `1734567890123-summer-dress.jpg`
- Database path: `images/PRODUCTS/1734567890123-summer-dress.jpg`
- Served at: `http://localhost:5000/uploads/images/PRODUCTS/1734567890123-summer-dress.jpg`

---

## Example: Adding Product A10

Let's add a new product called "Summer Beach Dress":

1. **Product ID:** A10
2. **Name:** Summer Beach Dress
3. **Category:** Dress
4. **Price:** 599
5. **Stock:** 25
6. **Images:** Click "Choose Files" and select:
   - `summer-dress-front.jpg`
   - `summer-dress-back.jpg`
   - `summer-dress-detail.jpg`
7. **Description:** "Light and breezy summer dress perfect for beach outings. Features adjustable straps and flowing fabric."
8. **Options:**
   - ✅ New Arrival
   - ✅ Featured Product
9. Click "**Save Product**"

Your product is now live with all images!

---

## Need Help?

If you encounter any issues:

1. **Check the Admin Guide:** See `ADMIN_USER_GUIDE.md`
2. **Restart Backend:** 
   - Open PowerShell
   - Navigate to backend folder: `cd backend`
   - Run: `npm start`
3. **Check Database:** Ensure MySQL is running on localhost:3306
4. **Browser Console:** Press F12 and check for errors

---

## Summary

✅ **Upload up to 5 images per product**
✅ **Supported formats: JPG, PNG, GIF, WebP**
✅ **Maximum 5MB per image**
✅ **Images automatically saved and displayed**
✅ **No need to manually type image paths**
✅ **Works for both new products and updates**

The image upload system is fully integrated and ready to use. Simply click "Choose Files", select your product images, and save!

---

**Last Updated:** December 2024
**Version:** 1.0
