const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User, Session } = require("../models");
const { Op } = require("sequelize");
const emailjs = require("@emailjs/browser");

// Generuoja žetoną pagal vartotoją su nurodytu galiojimo laiku.
const generateToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "2h" });
};
// Registruoja naują vartotoją.
const registerUser = async (req, res) => {
  try {
    const { username, email, password, accountType } = req.body;

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Vartotojas arba el. paštas jau egzistuoja" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      accountType,
    });

    res.status(201).json({ message: "Vartotojas sėkmingai užregistruotas" });
  } catch (error) {
    console.error("Klaida registruojant vartotoją:", error);
    res.status(500).json({ error: "Vidinė serverio klaida" });
  }
};

// Prisijungia vartotoją.
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res
        .status(401)
        .json({ error: "Neteisingas vartotojo vardas arba slaptažodis." });
    }

    // Patikrina, ar vartotojas jau turi sesiją.
    let session = await Session.findOne({ where: { userId: user.id } });

    if (!session) {
      // Jei sesija neegzistuoja, sukuria naują.
      session = await Session.create({
        userId: user.id,
        ipAddress: req.ip,
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // Pasibaigs po 2 valandų
      });
    } else {
      // Jei sesija egzistuoja, ją atnaujina.
      session.ipAddress = req.ip;
      session.expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // Atnaujina galiojimo laiką
      await session.save();
    }

    const accessToken = generateToken({
      id: user.id,
      username: user.username,
      accountType: user.accountType,
    });
    const refreshToken = jwt.sign(
      {
        id: user.id,
        username: user.username,
        accountType: user.accountType,
      },
      process.env.JWT_REFRESH_SECRET
    );
    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error("Klaida prisijungiant vartotoją:", error);
    res.status(500).json({ error: "Vidinė serverio klaida" });
  }
};
const logoutUser = async (req, res) => {
  try {
    res.clearCookie("refreshToken");
    res.sendStatus(204);
  } catch (error) {
    console.error("Klaida atsijungiant:", error);
    res.status(500).json({ error: "Vidinė serverio klaida" });
  }
};
const refreshToken = async (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    if (!decoded) return res.sendStatus(403);

    const session = await Session.findOne({ where: { userId: decoded.id } });
    if (!session) return res.sendStatus(404);

    session.expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);
    await session.save();

    const accessToken = generateToken({
      id: decoded.id,
      username: decoded.username,
      accountType: decoded.accountType,
    });
    res.json({ accessToken });
  } catch (error) {
    console.error("Klaida atnaujintant žetoną:", error);
    return res.sendStatus(500);
  }
};
// Gauna vartotojo duomenis pagal žetoną.
const getUserData = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Pasimetęs žetonas" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      console.log(
        "Sesija pasibaigė arba netinkamas žetonas. Vartotojas atsijungė."
      );
      return res
        .status(401)
        .json({ error: "Sesija pasibaigė arba netinkamas žetonas." });
    }

    const user = await User.findOne({ where: { username: decoded.username } });
    if (!user) {
      return res.status(404).json({ error: "Vartotojas nerastas" });
    }

    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      accountType: user.accountType,
      pictureUrl: user.pictureUrl,
    });
  } catch (error) {
    console.error("Klaida ieškant vartotojo:", error);
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      console.log(
        "Sesija pasibaigė arba netinkamas žetonas. Vartotojas atsijungė."
      );
      return res
        .status(401)
        .json({ error: "Sesija pasibaigė arba netinkamas žetonas." });
    }
    res.status(500).json({ error: "Vidinė serverio klaida" });
  }
};
const updatePassword = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }],
      },
    });

    if (existingUser) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.update(
        { password: hashedPassword },
        { where: { id: existingUser.id } }
      );
    } else {
      return res.status(404).json({ message: "Vartotojas neegzistuoja" });
    }

    res.status(201).json({ message: "Slaptažodis sėkmingai pakeistas" });
  } catch (error) {
    console.error("Klaida keičiant slaptažodį:", error);
    res.status(500).json({ error: "Vidinė serverio klaida" });
  }
};
const checkEmail = async (req, res) => {
  try {
    const { email, link } = req.body;
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }],
      },
    });

    if (existingUser) {
      emailjs.init(process.env.VITE_EMAIL_USER_ID);
      emailjs.send(
        process.env.VITE_EMAIL_SERVICE_ID,
        process.env.VITE_EMAIL_TEMPLATE_ID,
        {
          link: "http://localhost:5173/slaptazodis",
          to_email: email,
        }
      );
    } else {
      return res.status(404).json({ message: "Vartotojas neegzistuoja" });
    }

    res.status(201).json({ message: "Laiškas sėkmingai išsiūstas" });
  } catch (error) {
    console.error("Klaida siunčiant laišką:", error);
    res.status(500).json({ error: "Vidinė serverio klaida" });
  }
};
module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  getUserData,
  updatePassword,
  checkEmail,
};
