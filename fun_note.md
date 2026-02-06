import express from 'express';
import \* as jose from 'jose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// --- SECRETS & KEYS ---
// For User Auth: A symmetric secret (Keep this in .env)
const USER_SECRET = new TextEncoder(). encode(process.env.JWT_SECRET || 'your-256-bit-secret-here');

// For Service Auth: Usually you'd load a Public Key from a file or URL
// For this example, we generate a pair on the fly
const { publicKey, privateKey } = await jose.generateKeyPair('RS256');

// --- 1. SIGNING TOKENS ---

// User Login (Symmetric)
app.post('/login', async (req, res) => {
// In real life: validate user credentials here
const token = await new jose.SignJWT({ id: 'user_123', role: 'admin' })
.setProtectedHeader({ alg: 'HS256' })
.setIssuedAt()
.setExpirationTime('2h')
.sign(USER_SECRET);

    res.json({ token });

});

// Service-to-Service (Asymmetric)
// This is what Service A would do before calling Service B
app.get('/internal-token', async (req, res) => {
const token = await new jose.SignJWT({ service: 'order-service' })
.setProtectedHeader({ alg: 'RS256' })
.setAudience('inventory-service') // Crucial for service-to-service
.setExpirationTime('5m') // Very short lived
.sign(privateKey);

    res.json({ token });

});

// --- 2. VERIFICATION MIDDLEWARE ---

const authMiddleware = async (req, res, next) => {
const authHeader = req.headers.authorization;
if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);

    const token = authHeader.split(' ')[1];

    try {
        // Here you can decide which key to use based on the route or header
        const { payload } = await jose.jwtVerify(token, USER_SECRET);
        req.user = payload;
        next();
    } catch (e) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }

};

// --- 3. PROTECTED ROUTES ---

app.get('/me', authMiddleware, (req, res) => {
res.json({ message: `Welcome ${req.user.id}`, data: req.user });
});

app.listen(3000, () => console.log('Auth Service running on port 3000'));
