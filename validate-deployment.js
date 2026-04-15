#!/usr/bin/env node
/**
 * Production Deployment Validation Script
 * Run this before deploying to catch common issues
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Mellophi Fashion - Production Deployment Validation\n');

let hasErrors = false;
let hasWarnings = false;

// Check 1: Backend files exist
console.log('📦 Checking backend files...');
const backendFiles = [
    'backend/server.js',
    'backend/package.json',
    'backend/config/database.js',
    'backend/.env.template',
    'backend/.env.production',
    'backend/render.yaml'
];

backendFiles.forEach(file => {
    const fullPath = path.join(__dirname, file);
    if (fs.existsSync(fullPath)) {
        console.log(`  ✅ ${file}`);
    } else {
        console.log(`  ❌ ${file} - MISSING`);
        hasErrors = true;
    }
});

// Check 2: Frontend config
console.log('\n🌐 Checking frontend config...');
const configPath = path.join(__dirname, 'js/config.js');
if (fs.existsSync(configPath)) {
    const config = fs.readFileSync(configPath, 'utf8');
    if (config.includes('your-api-domain.com')) {
        console.log('  ⚠️  API URL still has placeholder - update before deployment');
        hasWarnings = true;
    } else {
        console.log('  ✅ API URL configured');
    }
    
    if (config.includes('HTTPS enforcement')) {
        console.log('  ✅ HTTPS enforcement enabled');
    }
} else {
    console.log('  ❌ js/config.js - MISSING');
    hasErrors = true;
}

// Check 3: .gitignore
console.log('\n🔒 Checking security...');
const gitignorePath = path.join(__dirname, 'backend/.gitignore');
if (fs.existsSync(gitignorePath)) {
    const gitignore = fs.readFileSync(gitignorePath, 'utf8');
    if (gitignore.includes('.env')) {
        console.log('  ✅ .env files ignored by git');
    } else {
        console.log('  ⚠️  Add .env to .gitignore');
        hasWarnings = true;
    }
} else {
    console.log('  ⚠️  No .gitignore found - create one');
    hasWarnings = true;
}

// Check 4: Database backup command
console.log('\n💾 Checking database backup...');
const packagePath = path.join(__dirname, 'backend/package.json');
if (fs.existsSync(packagePath)) {
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    if (pkg.scripts && pkg.scripts['db:backup']) {
        console.log('  ✅ Backup script available');
    } else {
        console.log('  ⚠️  No backup script in package.json');
        hasWarnings = true;
    }
}

// Check 5: Required dependencies
console.log('\n📚 Checking dependencies...');
const requiredDeps = [
    'express',
    'cors',
    'dotenv',
    'mysql2',
    'sequelize',
    'bcryptjs',
    'jsonwebtoken',
    'multer'
];

if (fs.existsSync(packagePath)) {
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const installed = pkg.dependencies || {};
    
    requiredDeps.forEach(dep => {
        if (installed[dep]) {
            console.log(`  ✅ ${dep}`);
        } else {
            console.log(`  ❌ ${dep} - NOT INSTALLED`);
            hasErrors = true;
        }
    });
}

// Summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
    console.log('❌ DEPLOYMENT BLOCKED - Fix errors above');
    process.exit(1);
} else if (hasWarnings) {
    console.log('⚠️  WARNINGS FOUND - Review before deploying');
    console.log('\n📋 Next steps:');
    console.log('  1. Review warnings above');
    console.log('  2. Update API URL in js/config.js');
    console.log('  3. Backup database');
    console.log('  4. Follow COMPLETE_DEPLOYMENT_GUIDE.md');
} else {
    console.log('✅ ALL CHECKS PASSED');
    console.log('\n🚀 Ready for deployment!');
    console.log('\n📋 Next steps:');
    console.log('  1. Backup database: cd backend && npm run db:backup');
    console.log('  2. Push to GitHub');
    console.log('  3. Deploy to Render');
    console.log('  4. Follow COMPLETE_DEPLOYMENT_GUIDE.md');
}
console.log('='.repeat(50));
