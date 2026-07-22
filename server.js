// server.js - ระบบหลังบ้านเวอร์ชันเสถียรสูงสุดสำหรับรันบนระบบคลาวด์ Vercel
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();

// เปิดสิทธิ์ความปลอดภัยให้หน้าเว็บหน้าบ้านของคุณสามารถเชื่อมต่อดึงข้อมูลได้จากทุกเครื่อง
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// 🔒 ดึงรหัสกุญแจอัจฉริยะจากระบบตู้เซฟ Environment Variables ของ Vercel อัตโนมัติ เพื่อความปลอดภัยสูงสุด
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post('/api/ask-mirror', async (req, res) => {
    try {
        const { question } = req.body;
        
        if (!GEMINI_API_KEY) {
            return res.status(500).json({ 
                success: false, 
                reply: "ระบบคลาวด์แจ้งเตือน: ยังไม่ได้ใส่กุญแจ GEMINI_API_KEY ในระบบตู้เซฟของ Vercel ครับ" 
            });
        }

        // เริ่มต้นเปิดระบบประมวลผลของ Google Gemini AI
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        
        // ใช้โมเดลเวอร์ชันอัปเดตล่าสุดที่คิดคำตอบได้รวดเร็วทันใจหน้างานอีเวนต์
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            systemInstruction: "คุณคือ 'กระจกวิเศษอัจฉริยะในสไตล์เทพนิยายแฝงความล้ำสมัย' หน้าที่ของคุณคือทักทายคนที่เดินมาส่องกระจกในงานอีเวนต์นี้ จงพูดจาชื่นชม ร่าเริง อัธยาศัยดี ขี้เล่น และชอบชื่นชมว่าผู้ใช้งานแต่งตัวสวยหล่อ หน้าตาดี ออร่าจับสุด ๆ พร้อมกับชักชวนให้พวกเขากดปุ่มถ่ายรูปคู่กับกระจกวิเศษ จงคิดตอบคำถามเป็นภาษาไทยแบบกระชับสั้นไม่เกิน 2 ประโยค เพื่อให้ระบบสังเคราะห์เสียงพูดตอบโต้กลับไปได้อย่างรวดเร็วทันใจผู้ใช้งาน"
        });

        const result = await model.generateContent(question);
        const replyText = result.response.text();

        // ส่งคำตอบที่ฉลาดกลับไปแสดงผลที่หน้ากระจกวิเศษ
        res.json({ success: true, reply: replyText });
        
    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ 
            success: false, 
            reply: "อุ๊ย ขออภัยด้วยครับ สมองกระจกวิเศษบนคลาวด์ขัดข้องนิดหน่อย ลองถามใหม่อีกครั้งนะคร้าบ" 
        });
    }
});

// เปิดพอร์ตระบบตามมาตรฐานการจัดวางของ Vercel Serverless
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`สมองหลังบ้านออนไลน์รันสำเร็จแล้วที่พอร์ต ${PORT}`);
});

// บันทึกไฟล์เพื่อให้ระนาบระบบของ Vercel รับรู้โครงสร้างซอฟต์แวร์
module.exports = app;
