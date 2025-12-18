import express from "express";
import { log } from "node:console";
import { Sequelize, DataTypes, STRING } from "sequelize";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());
app.use(express.static('public'));
app.listen(3000, ()=> console.log('server started'));

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
    },
    userId:{
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'Users',
            key: 'userId'
        }
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
 
    },
    userId:{
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'Users',
            key: 'userId'
        }
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
    },
    userId:{
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'Users',
            key: 'userId'
        }
    },
    OrderId:{
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'Zakazs',
            key: 'orderId'
        }
    }
})

const Offers = sequelize.define('Offers', {
    name:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    offers:{
        type:DataTypes.STRING,
        allowNull: false,
    },
    OffersId:{
        type:DataTypes.UUID,
        allowNull:false,
        primaryKey:true,
        defaultValue:DataTypes.UUIDV4,
    }
})

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userId:{
        type:DataTypes.UUID,
        allowNull:false,
        defaultValue:DataTypes.UUIDV4,
        primaryKey:true,
    }
});

User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Quest, { foreignKey: 'userId', as: 'quests' });
Quest.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Reviews, { foreignKey: 'userId', as: 'reviews' });
Reviews.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Order.hasMany(Reviews, { foreignKey: 'OrderId', as: 'reviews' });
Reviews.belongsTo(Order, { foreignKey: 'OrderId', as: 'order' });

async function testConnection(){
    try{
        await sequelize.authenticate();
        console.log('соединение установлено успешно');
        await User.sync();
        await Order.sync();
        await Quest.sync();
        await Reviews.sync();
        await Offers.sync();
        console.log('Бд работает');
    } catch (err){
        console.log('ошибка ', err.message);
        
    }
}

app.post('/submit', async (req, res)=>{
    const OrderData = req.body;
    console.log('получены данные ', OrderData);
    console.log('userId в запросе:', OrderData.userId);

    try{
        const orderData = {
            name: OrderData.name,
            number: OrderData.number,
            adress: OrderData.adress,
            order: OrderData.order
        };

        if (OrderData.userId) {
            orderData.userId = OrderData.userId;
            console.log('userId добавлен в orderData:', orderData.userId);
        } else {
            console.log('userId отсутствует в запросе');
        }

        console.log('Данные для создания заказа:', orderData);
        const newZakaz = await Order.create(orderData);

        console.log('Заказ оформлен ', newZakaz.orderId);
        console.log('Заказ с userId:', newZakaz.userId);

        res.json({ message: `ваш заказ ${OrderData.order}` })
        
    }catch(err){
        console.log('Ошибка сохранения');
        res.status(500).json({err: "не удалось сохранить"});
    }
    
});

app.post('/quest', async (req, res)=>{
    const QuestData = req.body;

    console.log('получены данные ', QuestData);

    try{
        const questData = {
            fullName: QuestData.fullName,
            phone: QuestData.phone,
            email: QuestData.email,
            question: QuestData.question
        };

        if (QuestData.userId) {
            questData.userId = QuestData.userId;
        }

        const newQuest = await Quest.create(questData);

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
        const reviewData = {
            name: ReviewsData.name,
            review: ReviewsData.text,
        };

        if (ReviewsData.userId) {
            reviewData.userId = ReviewsData.userId;
        }

        if (ReviewsData.OrderId) {
            reviewData.OrderId = ReviewsData.OrderId;
        }

        const newReview = await Reviews.create(reviewData)     
        
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

app.post('/offers', async(req, res)=>{
    const offersData = req.body;

    console.log('Получено предложение ', offersData);

    try{
        const newOffers = await Offers.create({
            name:offersData.name,
            offers:offersData.offers,
        })

        console.log('Предложени успешно добавлено');
        res.json({ message:`Ваше предложение будет рассмотрено, ${newOffers.name} ` })
        
    }catch (err) {
        res.status(500).json({ err: 'Ошибка отправки' });
    }
    
})

app.post('/register', async (req, res) => {
    try {
        const { username, password, name } = req.body;
        if (!username || !password || !name) {
            return res.status(400).json({ error: 'Все поля обязательны' });
        }
        const user = await User.create({ username, password, name });
        res.json({ success: true, message: 'Регистрация успешна', userId: user.userId, username: user.username, name: user.name });
    } catch (err) {
        console.log('Ошибка регистрации:', err.message);
        res.status(400).json({ error: 'Пользователь уже существует' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Логин и пароль обязательны' });
        }
        const user = await User.findOne({ where: { username, password } });
        if (user) {
            res.json({ success: true, message: 'Успешный вход', userId: user.userId, username: user.username, name: user.name, email: user.email });
        } else {
            res.status(401).json({ error: 'Неверные данные' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});


app.get('/profile/:userId', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.userId);
        if (user) {
            res.json({ username: user.username, userId: user.userId, name: user.name, email: user.email });
        } else {
            res.status(404).json({ error: 'Пользователь не найден' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

app.get('/profil.html', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "profil.html"));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});


//ДОБАВЬ МОДЕЛЬ В ТЕСТ ФУНКЦИЮ!!!!
testConnection()