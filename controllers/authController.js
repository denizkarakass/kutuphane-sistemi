const bcrypt = require("bcrypt"); //Şifreleri veritabanında şifreli tutuyoruz
const User = require("../models/User");
const Category = require("../models/Category");
const Book = require("../models/Book");

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);

    res.status(201).redirect("/");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.loginUser = (req, res) => {
  try {
    const { email, password } = req.body;

    User.findOne({ email }, (err, user) => {
      if (user) {
        bcrypt.compare(password, user.password, (err, same) => {
          req.session.userID = user._id; //user sessionlar
          res.status(200).redirect("/users/dashboard");
        });
      }
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

exports.getDashboardPage = async (req, res) => {
  /*1)Kullanıcının id bilgilerini yakalayıp veritabanından bilgilerini  alıcam (yönetim paneli kısmında kullanmak için)
    2) Populate kullanarak kullanıcı ve kitap arasında ilişki kurucam ki user üzerinden kitap bilgilerine ulaşabileyim */
  const user = await User.findOne({ _id: req.session.userID }).populate(
    "books"
  );
  const users = await User.find();
  //console.log(req.session.userID);
  const categories = await Category.find();
  const books = await Book.find({
    user: req.session.userID,
  }); /* kullanıcı id'si sessiondan kontrol edilen user ID'ye eşit olan kitapları çekiyorum
  Bu sayede kullanıcının yayınladığı kitapları onun sayfasında gösterebiliyorum. */
  res.status(200).render("dashboard", {
    page_name: "dashboard",
    categories,
    user,
    books,
  });
};

function sendEmail(mail, msg, subject) {
  // Mail gönderme işlemi
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "terapistimburada@gmail.com", // Gönderen e-posta adresi
      pass: "wakeljfqfnwscdaw", // Gönderen e-posta hesabının şifresi
    },
  });
  const mailOptions = {
    from: "hr@terapistimburada.com", // Gönderen e-posta adresi
    to: mail, // Kullanıcının e-posta adresi
    subject: subject, // E-posta konusu
    html: `
    <p>${msg}</p>
    <br>
     `, // E-posta içeriği (metin formatı)
    // html: '<p>Lütfen hesabınızı onaylamak için <a href="http://example.com/onayla">tıklayın</a></p>' // E-posta içeriği (HTML formatı)
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("E-posta gönderildi: " + info.response);
    }
  });
}

exports.forgotPassword = async (req, res) => {
  //Nodemailer ile mail gönderme işlemi
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }
  const token = await Math.random().toString(36).substr(2, 10);
  await user.save();
  const resetPasswordUrl = `http://localhost:3000/resetPassword?token=${token}`;
  const emailTemplate = `
    <h3>Reset Your Password</h3>
    <p>This <a href='${resetPasswordUrl}' target='_blank'>link</a> will expire in 1 hour</p>
  `;

  try {
    await sendEmail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Reset Your Password",
      html: emailTemplate,
    });
    return res.status(200).json({
      message: "Email sent",
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    return res.status(500).json({
      message: "Email could not be sent",
    });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.query;
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      message: "Invalid token",
    });
  }
  res.status(200).render("resetPassword", {
    token,
  });
};
