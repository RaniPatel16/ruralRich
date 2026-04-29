require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io for Live Order Tracking (Checklist Item #14)
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT"]
    }
});

io.on('connection', (socket) => {
    console.log(`Live Tracking Connected: ${socket.id}`);
    
    socket.on('join_order', (orderId) => {
        socket.join(orderId);
        console.log(`Client joined live tracking room: ${orderId}`);
    });

    socket.on('disconnect', () => {
        console.log(`Live Tracking Disconnected: ${socket.id}`);
    });
});

// Make socket instance available in routes for emitting updates
app.set('io', io);

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Route files
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const addressRoutes = require('./routes/addressRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'API is running...' });
});

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/deliveries', deliveryRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server & Socket.io running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
