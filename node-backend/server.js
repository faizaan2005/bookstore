const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const initSqlJs = require('sql.js');

const app = express();
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || '404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970';
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:3001,https://bookstore-liqi.vercel.app').split(',').map(o => o.trim());

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    callback(null, true);
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

let db;

initSqlJs().then(SQL => {
  db = new SQL.Database();

  db.run(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT, lastName TEXT, email TEXT UNIQUE,
      password TEXT, phone TEXT, address TEXT, avatar TEXT,
      role TEXT DEFAULT 'USER', enabled INTEGER DEFAULT 1,
      resetToken TEXT, resetExpiry TEXT,
      createdAt TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT, author TEXT, description TEXT,
      price REAL, originalPrice REAL, category TEXT,
      isbn TEXT, publisher TEXT, language TEXT DEFAULT 'English',
      pages INTEGER, imageUrl TEXT, stockQuantity INTEGER DEFAULT 0,
      rating REAL DEFAULT 0, reviewCount INTEGER DEFAULT 0,
      featured INTEGER DEFAULT 0, active INTEGER DEFAULT 1,
      createdAt TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orderNumber TEXT UNIQUE, userId INTEGER,
      subtotal REAL, tax REAL, shippingCharge REAL,
      discount REAL DEFAULT 0, totalAmount REAL,
      status TEXT DEFAULT 'CONFIRMED', paymentStatus TEXT DEFAULT 'COMPLETED',
      paymentMethod TEXT, shippingAddress TEXT, shippingCity TEXT,
      shippingState TEXT, shippingZip TEXT, notes TEXT,
      createdAt TEXT DEFAULT (datetime('now')), deliveredAt TEXT
    );
    CREATE TABLE order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orderId INTEGER, bookId INTEGER,
      quantity INTEGER, unitPrice REAL, totalPrice REAL
    );
  `);

  seedData();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

// --- Helpers ---
function run(sql, params = []) { db.run(sql, params); }
function get(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  if (stmt.step()) { const row = stmt.getAsObject(); stmt.free(); return row; }
  stmt.free(); return null;
}
function all(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}
function insert(sql, params = []) {
  db.run(sql, params);
  return get('SELECT last_insert_rowid() as id').id;
}

function mapUser(u) {
  if (!u) return null;
  return { id: u.id, firstName: u.firstName, lastName: u.lastName, email: u.email, phone: u.phone, address: u.address, avatar: u.avatar, role: u.role, enabled: u.enabled === 1, createdAt: u.createdAt };
}
function mapBook(b) {
  if (!b) return null;
  return { ...b, featured: b.featured === 1, active: b.active === 1, inStock: b.stockQuantity > 0 };
}
function getOrderById(id) {
  const order = get('SELECT * FROM orders WHERE id=?', [id]);
  if (!order) return null;
  const user = get('SELECT * FROM users WHERE id=?', [order.userId]);
  const items = all('SELECT * FROM order_items WHERE orderId=?', [id]).map(item => ({
    ...item, book: mapBook(get('SELECT * FROM books WHERE id=?', [item.bookId]))
  }));
  return { ...order, user: mapUser(user), items };
}

function seedData() {
  const count = get('SELECT COUNT(*) as c FROM users').c;
  if (count > 0) return;

  run('INSERT INTO users (firstName,lastName,email,password,role,enabled) VALUES (?,?,?,?,?,1)',
    ['Admin','User','admin@bookstore.com', bcrypt.hashSync('admin123',10),'ADMIN']);
  run('INSERT INTO users (firstName,lastName,email,password,role,enabled) VALUES (?,?,?,?,?,1)',
    ['John','Doe','john@example.com', bcrypt.hashSync('user123',10),'USER']);
  run('INSERT INTO users (firstName,lastName,email,password,role,enabled) VALUES (?,?,?,?,?,1)',
    ['Jane','Smith','jane@example.com', bcrypt.hashSync('user123',10),'USER']);

  const books = [
    ['The Great Gatsby','F. Scott Fitzgerald','A story of the mysteriously wealthy Jay Gatsby.',12.99,18.99,'Fiction','https://covers.openlibrary.org/b/id/8225261-L.jpg',50,4.5,1250,1],
    ['To Kill a Mockingbird','Harper Lee','The unforgettable novel of a childhood in a sleepy Southern town.',10.99,15.99,'Fiction','https://covers.openlibrary.org/b/id/8231856-L.jpg',35,4.8,2100,1],
    ['1984','George Orwell','A haunting vision of a totalitarian future.',9.99,14.99,'Dystopian','https://covers.openlibrary.org/b/id/8575708-L.jpg',60,4.7,3200,1],
    ['The Alchemist','Paulo Coelho','A novel about following your dreams.',11.99,16.99,'Fiction','https://covers.openlibrary.org/b/id/8709920-L.jpg',45,4.6,1800,1],
    ['Sapiens','Yuval Noah Harari','A Brief History of Humankind.',14.99,22.99,'Non-Fiction','https://covers.openlibrary.org/b/id/9255566-L.jpg',40,4.4,2500,1],
    ['Atomic Habits','James Clear','Build good habits and break bad ones.',16.99,24.99,'Self-Help','https://covers.openlibrary.org/b/id/10521270-L.jpg',55,4.8,4100,1],
    ['The Psychology of Money','Morgan Housel','Timeless lessons on wealth and happiness.',15.99,21.99,'Finance','https://covers.openlibrary.org/b/id/10521271-L.jpg',30,4.7,1900,1],
    ['Clean Code','Robert C. Martin','A Handbook of Agile Software Craftsmanship.',39.99,54.99,'Technology','https://covers.openlibrary.org/b/id/8091016-L.jpg',25,4.6,3100,0],
    ['Design Patterns','Gang of Four','Elements of Reusable Object-Oriented Software.',44.99,59.99,'Technology','https://covers.openlibrary.org/b/id/8091017-L.jpg',20,4.5,2800,0],
    ['The Lean Startup','Eric Ries','How Entrepreneurs Use Continuous Innovation.',17.99,25.99,'Business','https://covers.openlibrary.org/b/id/8091018-L.jpg',35,4.3,1600,0],
    ["Harry Potter and the Sorcerer's Stone",'J.K. Rowling','The first magical adventure of Harry Potter.',13.99,19.99,'Fantasy','https://covers.openlibrary.org/b/id/10110415-L.jpg',70,4.9,5200,1],
    ['The Hunger Games','Suzanne Collins','Katniss Everdeen fights for survival in a dystopian future.',12.99,17.99,'Dystopian','https://covers.openlibrary.org/b/id/8228691-L.jpg',45,4.5,2900,0],
  ];
  books.forEach(b => run('INSERT INTO books (title,author,description,price,originalPrice,category,imageUrl,stockQuantity,rating,reviewCount,featured) VALUES (?,?,?,?,?,?,?,?,?,?,?)', b));
}

// --- Auth Middleware ---
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
  try { req.user = jwt.verify(header.substring(7), JWT_SECRET); next(); }
  catch { res.status(401).json({ message: 'Invalid token' }); }
}
function adminAuth(req, res, next) {
  auth(req, res, () => {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ message: 'Forbidden' });
    next();
  });
}

// --- Auth Routes ---
app.post('/api/auth/register', (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;
  if (!firstName || !email || !password) return res.status(400).json({ message: 'Missing required fields' });
  if (get('SELECT id FROM users WHERE email=?', [email])) return res.status(400).json({ message: 'Email already registered' });
  const id = insert('INSERT INTO users (firstName,lastName,email,password,phone,role,enabled) VALUES (?,?,?,?,?,?,1)', [firstName, lastName, email, bcrypt.hashSync(password, 10), phone || null, 'USER']);
  const user = get('SELECT * FROM users WHERE id=?', [id]);
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ accessToken: token, user: mapUser(user) });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = get('SELECT * FROM users WHERE email=?', [email]);
  if (!user || !bcrypt.compareSync(password, user.password)) return res.status(401).json({ message: 'Invalid credentials' });
  if (!user.enabled) return res.status(403).json({ message: 'Account disabled' });
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ accessToken: token, user: mapUser(user) });
});

app.post('/api/auth/forgot-password', (req, res) => {
  const user = get('SELECT * FROM users WHERE email=?', [req.body.email]);
  if (!user) return res.status(404).json({ message: 'No account found with that email' });
  const token = uuidv4();
  run('UPDATE users SET resetToken=?, resetExpiry=? WHERE id=?', [token, new Date(Date.now() + 3600000).toISOString(), user.id]);
  res.json({ message: 'Password reset instructions sent', token });
});

app.post('/api/auth/reset-password', (req, res) => {
  const { token, password } = req.body;
  const user = get('SELECT * FROM users WHERE resetToken=?', [token]);
  if (!user || new Date(user.resetExpiry) < new Date()) return res.status(400).json({ message: 'Invalid or expired token' });
  run('UPDATE users SET password=?, resetToken=NULL, resetExpiry=NULL WHERE id=?', [bcrypt.hashSync(password, 10), user.id]);
  res.json({ message: 'Password reset successfully' });
});

// --- Book Routes ---
app.get('/api/books', (req, res) => {
  const { query, category, sortBy = 'title', page = 0, size = 12 } = req.query;
  const offset = parseInt(page) * parseInt(size);
  let sql = 'SELECT * FROM books WHERE active=1';
  const params = [];
  if (query) { sql += ' AND (title LIKE ? OR author LIKE ?)'; params.push(`%${query}%`, `%${query}%`); }
  if (category) { sql += ' AND category=?'; params.push(category); }
  const orderMap = { price_asc: 'price ASC', price_desc: 'price DESC', rating: 'rating DESC', newest: 'createdAt DESC', title: 'title ASC' };
  sql += ` ORDER BY ${orderMap[sortBy] || 'title ASC'}`;
  const total = get(sql.replace('SELECT *', 'SELECT COUNT(*) as c'), params).c;
  const books = all(sql + ' LIMIT ? OFFSET ?', [...params, parseInt(size), offset]).map(mapBook);
  res.json({ content: books, totalElements: total, totalPages: Math.ceil(total / size), number: parseInt(page), size: parseInt(size) });
});

app.get('/api/books/featured', (req, res) => res.json(all('SELECT * FROM books WHERE featured=1 AND active=1 ORDER BY rating DESC').map(mapBook)));
app.get('/api/books/new-arrivals', (req, res) => res.json(all('SELECT * FROM books WHERE active=1 ORDER BY createdAt DESC LIMIT 8').map(mapBook)));
app.get('/api/books/categories', (req, res) => res.json(all('SELECT DISTINCT category FROM books WHERE active=1').map(r => r.category)));

app.get('/api/books/:id', (req, res) => {
  const book = get('SELECT * FROM books WHERE id=?', [req.params.id]);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json(mapBook(book));
});

// --- User Routes ---
app.get('/api/user/profile', auth, (req, res) => res.json(mapUser(get('SELECT * FROM users WHERE id=?', [req.user.id]))));

app.post('/api/user/orders', auth, (req, res) => {
  const { items, paymentMethod, shippingAddress, shippingCity, shippingState, shippingZip, notes } = req.body;
  let subtotal = 0;
  const orderItems = [];
  for (const item of items) {
    const book = get('SELECT * FROM books WHERE id=?', [item.bookId]);
    if (!book) return res.status(404).json({ message: `Book not found: ${item.bookId}` });
    if (book.stockQuantity < item.quantity) return res.status(400).json({ message: `Insufficient stock for: ${book.title}` });
    const itemTotal = book.price * item.quantity;
    subtotal += itemTotal;
    orderItems.push({ book, quantity: item.quantity, unitPrice: book.price, totalPrice: itemTotal });
    run('UPDATE books SET stockQuantity=? WHERE id=?', [book.stockQuantity - item.quantity, book.id]);
  }
  const tax = subtotal * 0.08;
  const shipping = subtotal > 50 ? 0 : 4.99;
  const total = subtotal + tax + shipping;
  const orderNumber = 'ORD-' + uuidv4().substring(0, 8).toUpperCase();
  const orderId = insert('INSERT INTO orders (orderNumber,userId,subtotal,tax,shippingCharge,discount,totalAmount,status,paymentStatus,paymentMethod,shippingAddress,shippingCity,shippingState,shippingZip,notes) VALUES (?,?,?,?,?,0,?,?,?,?,?,?,?,?,?)',
    [orderNumber, req.user.id, subtotal, tax, shipping, total, 'CONFIRMED', 'COMPLETED', paymentMethod, shippingAddress, shippingCity, shippingState, shippingZip, notes]);
  orderItems.forEach(i => run('INSERT INTO order_items (orderId,bookId,quantity,unitPrice,totalPrice) VALUES (?,?,?,?,?)', [orderId, i.book.id, i.quantity, i.unitPrice, i.totalPrice]));
  res.json(getOrderById(orderId));
});

app.get('/api/user/orders', auth, (req, res) => {
  const { page = 0, size = 10 } = req.query;
  const offset = parseInt(page) * parseInt(size);
  const total = get('SELECT COUNT(*) as c FROM orders WHERE userId=?', [req.user.id]).c;
  const orders = all('SELECT * FROM orders WHERE userId=? ORDER BY createdAt DESC LIMIT ? OFFSET ?', [req.user.id, parseInt(size), offset]).map(o => getOrderById(o.id));
  res.json({ content: orders, totalElements: total, totalPages: Math.ceil(total / size), number: parseInt(page) });
});

app.get('/api/user/orders/:id', auth, (req, res) => {
  const order = get('SELECT * FROM orders WHERE id=?', [req.params.id]);
  if (!order || order.userId !== req.user.id) return res.status(404).json({ message: 'Order not found' });
  res.json(getOrderById(order.id));
});

// --- Admin Routes ---
app.get('/api/admin/dashboard', adminAuth, (req, res) => {
  res.json({
    totalUsers: get('SELECT COUNT(*) as c FROM users WHERE enabled=1').c,
    totalBooks: get('SELECT COUNT(*) as c FROM books WHERE active=1').c,
    totalOrders: get('SELECT COUNT(*) as c FROM orders').c,
    totalRevenue: get('SELECT SUM(totalAmount) as s FROM orders').s || 0,
    pendingOrders: get("SELECT COUNT(*) as c FROM orders WHERE status='PENDING'").c,
    deliveredOrders: get("SELECT COUNT(*) as c FROM orders WHERE status='DELIVERED'").c,
    outOfStockBooks: get('SELECT COUNT(*) as c FROM books WHERE stockQuantity=0 AND active=1').c,
  });
});

app.get('/api/admin/users', adminAuth, (req, res) => {
  const { page = 0, size = 10 } = req.query;
  const offset = parseInt(page) * parseInt(size);
  const total = get('SELECT COUNT(*) as c FROM users').c;
  const users = all('SELECT * FROM users ORDER BY createdAt DESC LIMIT ? OFFSET ?', [parseInt(size), offset]).map(mapUser);
  res.json({ content: users, totalElements: total, totalPages: Math.ceil(total / size), number: parseInt(page) });
});

app.patch('/api/admin/users/:id/toggle-status', adminAuth, (req, res) => {
  const user = get('SELECT * FROM users WHERE id=?', [req.params.id]);
  if (!user) return res.status(404).json({ message: 'User not found' });
  run('UPDATE users SET enabled=? WHERE id=?', [user.enabled ? 0 : 1, user.id]);
  res.json(mapUser(get('SELECT * FROM users WHERE id=?', [req.params.id])));
});

app.post('/api/admin/books', adminAuth, (req, res) => {
  const { title, author, description, price, originalPrice, category, isbn, publisher, language, pages, imageUrl, stockQuantity, rating, reviewCount, featured } = req.body;
  const id = insert('INSERT INTO books (title,author,description,price,originalPrice,category,isbn,publisher,language,pages,imageUrl,stockQuantity,rating,reviewCount,featured,active) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,1)',
    [title, author, description, price, originalPrice, category, isbn, publisher, language || 'English', pages, imageUrl, stockQuantity || 0, rating || 0, reviewCount || 0, featured ? 1 : 0]);
  res.json(mapBook(get('SELECT * FROM books WHERE id=?', [id])));
});

app.put('/api/admin/books/:id', adminAuth, (req, res) => {
  if (!get('SELECT id FROM books WHERE id=?', [req.params.id])) return res.status(404).json({ message: 'Book not found' });
  const { title, author, description, price, originalPrice, category, isbn, publisher, language, pages, imageUrl, stockQuantity, featured, active } = req.body;
  run('UPDATE books SET title=?,author=?,description=?,price=?,originalPrice=?,category=?,isbn=?,publisher=?,language=?,pages=?,imageUrl=?,stockQuantity=?,featured=?,active=? WHERE id=?',
    [title, author, description, price, originalPrice, category, isbn, publisher, language, pages, imageUrl, stockQuantity, featured ? 1 : 0, active ? 1 : 0, req.params.id]);
  res.json(mapBook(get('SELECT * FROM books WHERE id=?', [req.params.id])));
});

app.delete('/api/admin/books/:id', adminAuth, (req, res) => {
  run('UPDATE books SET active=0 WHERE id=?', [req.params.id]);
  res.status(204).send();
});

app.get('/api/admin/orders', adminAuth, (req, res) => {
  const { page = 0, size = 10 } = req.query;
  const offset = parseInt(page) * parseInt(size);
  const total = get('SELECT COUNT(*) as c FROM orders').c;
  const orders = all('SELECT * FROM orders ORDER BY createdAt DESC LIMIT ? OFFSET ?', [parseInt(size), offset]).map(o => getOrderById(o.id));
  res.json({ content: orders, totalElements: total, totalPages: Math.ceil(total / size), number: parseInt(page) });
});

app.patch('/api/admin/orders/:id/status', adminAuth, (req, res) => {
  const order = get('SELECT * FROM orders WHERE id=?', [req.params.id]);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  const status = typeof req.body === 'string' ? req.body : req.body.status || req.body;
  const deliveredAt = status === 'DELIVERED' ? new Date().toISOString() : order.deliveredAt;
  run('UPDATE orders SET status=?, deliveredAt=? WHERE id=?', [status, deliveredAt, req.params.id]);
  res.json(getOrderById(req.params.id));
});
