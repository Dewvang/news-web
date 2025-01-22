import dotenv from 'dotenv';
import express from 'express';
import axios from 'axios';
import { fileURLToPath } from 'url';
import path from 'path';


dotenv.config(); // โหลดค่าจาก .env

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // ใช้ path.dirname เพื่อหาตำแหน่งของไฟล์

const app = express();
const API_KEY = process.env.API_KEY;
const PORT = process.env.PORT || 3000;

// ตั้งค่า EJS และ Static Files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Route สำหรับหน้าแรก
app.get('/', async (req, res) => {
    try {
        const today = new Date();
        const formattedToday = today.toISOString().split('T')[0];

        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const fourDaysAgo = new Date(today);
        fourDaysAgo.setDate(today.getDate() - 4);



        const formattedYesterday = yesterday.toISOString().split('T')[0];
        const formattedFourDaysAgo = fourDaysAgo.toISOString().split('T')[0];

        // ดึงข่าวสำหรับ Carousel (วันนี้ถึงวันนี้)
        const carouselResponse = await axios.get('https://newsapi.org/v2/everything', {
            params: {
                domains: 'thairath.co.th',
                sortBy: 'publishedAt',
                apiKey: API_KEY,
            },
        });

        // ดึงข่าวสำหรับ News Album (4 วันที่แล้วถึงเมื่อวานนี้)
        const newsAlbumResponse = await axios.get('https://newsapi.org/v2/everything', {
            params: {
                q: 'thailand',
                from: formattedFourDaysAgo,
                to: formattedToday,
                language: 'th',
                sortBy: 'publishedAt',
                apiKey: API_KEY,
            },
        });

        const carouselArticles = carouselResponse.data.articles;
        const newsAlbumArticles = newsAlbumResponse.data.articles;

        res.render('index', { 
            carouselArticles, 
            newsAlbumArticles 
        }); // ส่งข้อมูลทั้งสองชุดไปยังเทมเพลต
    } catch (error) {
        console.error('Error fetching news:', error.response?.data || error.message);
        res.render('index', { 
            carouselArticles: [], 
            newsAlbumArticles: [] 
        }); // หากเกิดข้อผิดพลาด
    }
});

app.get('/search', async (req, res) => {
    try {
        const today = new Date();

        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);

        const formattedWeekAgo = weekAgo.toISOString().split('T')[0];
        // รับค่าคำค้นหาจาก query parameter
        const searchQuery = req.query.query

        // ดึงข้อมูลข่าว
        const response = await axios.get('https://newsapi.org/v2/everything', {
            params: {
                from: formattedWeekAgo,
                q: searchQuery,
                sortBy: 'popularity',
                apiKey: API_KEY,
            },
        });

        const articles = response.data.articles; // ข่าวจาก API
        res.render('search', { articles, searchQuery }); // ส่งข้อมูลข่าวไปยังเทมเพลต
    } catch (error) {
        console.error('Error fetching news:', error.response?.data || error.message);
        res.render('search', { articles: [], searchQuery: req.query.query || '' }); // หากเกิดข้อผิดพลาด
    }
});

// Route สำหรับแสดงข่าวตามหมวดหมู่
app.get('/category/:category', async (req, res) => {
    try {
        const category = req.params.category || 'general';
        const response = await axios.get('https://newsapi.org/v2/top-headlines', {
            params: {
                category,
                country: 'us',  // ใช้ 'th' สำหรับข่าวในประเทศไทย
                apiKey: API_KEY,  // API Key ของคุณ
            },
        });

        const articles = response.data.articles;  // ข่าวที่ดึงมาจาก NewsAPI
        res.render('category', { articles, category });  // ส่งข่าวไปยังเทมเพลต category.ejs
    } catch (error) {
        console.error('Error fetching category news:', error.response?.data || error.message);
        res.render('category', { articles: [], category });  // หากเกิดข้อผิดพลาด
    }
});





// เริ่มเซิร์ฟเวอร์
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
