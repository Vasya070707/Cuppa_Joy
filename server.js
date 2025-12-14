import express from "express";
import { log } from "node:console";
import { Sequelize, DataTypes, STRING } from "sequelize";

const app = express();
app.use(express.json());
app.use(express.static('public'));
app.listen(3000, ()=> console.log('server started'));

import path from "path";
import { fileURLToPath } from "url";
import { name } from "ejs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "public/contentDB.sqlite"
});

const Order = sequelize.define('Zakaz',{
    name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    number:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    adress:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    order:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    orderId:{
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
    }
});

const Quest = sequelize.define('Quest',{
    fullName:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    phone:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    question:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    questId:{
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
 
    }
});

const Reviews = sequelize.define('Reviews', {
    name:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    review:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    reviewId:{
        type:DataTypes.UUID,
        primaryKey:true,
        allowNull:false,
        defaultValue:DataTypes.UUIDV4,
    }
})

async function testConnection(){
    try{
        await sequelize.authenticate();
        console.log('соединение установлено успешно');
        await Order.sync();
        await Quest.sync();
        await Reviews.sync();
        console.log('Бд работает');
    } catch (err){
        console.log('ошибка ', err.message);
        
    }
}

app.post('/submit', async (req, res)=>{
    const OrderData = req.body;
    console.log('получены данные ', OrderData);

    try{
        const newZakaz = await Order.create({
            name: OrderData.name,
            number: OrderData.number,
            adress: OrderData.adress,
            order: OrderData.order
        });

        console.log('Заказ оформлен ', newZakaz.orderId);

        res.json({ message: `ваш заказ ${OrderData.order}` })
        
    }catch(err){
        console.log('Ошибка сохранения');
        res.status((500).json({err: "не удалось сохранить"}));
    }
    
});

app.post('/quest', async (req, res)=>{
    const QuestData = req.body;

    console.log('получены данные ', QuestData);

    try{
        const newQuest = await Quest.create({
            fullName: QuestData.fullName,
            phone: QuestData.phone,
            email: QuestData.email,
            question: QuestData.question
        });

        console.log('Вопрос получен ', newQuest.questId);

        res.json({message: `Ваш вопрос: ${QuestData.question}`})
        
    }catch(err){
        console.log('Ошибка сохранения');
        res.status(500).json({err: "не удалось сохранить"});
    }
    
    
})

app.post('/review', async(req, res)=>{
    const ReviewsData = req.body;

    console.log('Получен отзыв ', ReviewsData);
    
    try{
        const newReview = await Reviews.create({
            name: ReviewsData.name,
            review: ReviewsData.review,
        })     
        
        console.log('Отзыв добавлен', newReview.reviewId);

        res.json({message: 'Ваш отзыв успешно добавлен'});
        
    }catch(err){
        console.log('Ошибка сохранения');
        res.status(500).json({err: "не удалось сохранить"});
    }

})
app.get('/review', async(req, res)=>{
    try{
        const allReview = await Reviews.findAll({
            order:[['createdAt', 'DESC']],
            limit:10,
        })
        const ReviewsData = allReview.map(review =>({
            name:review.name,
            text:review.review,
        }))
        res.json(ReviewsData)
    } catch (err) {
        res.status(500).json({ err: 'Ошибка отзывов' });
    }
})


testConnection()