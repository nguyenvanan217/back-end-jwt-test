import nodemailer from "nodemailer";
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmailNotification = async (transaction, daysUntilReturn) => {
  let emailSubject = '';
  
  if (daysUntilReturn === 3) {
    emailSubject = "Nhắc nhở: Sắp đến hạn trả sách (còn 3 ngày)";
  } else if (daysUntilReturn === 2) {
    emailSubject = "Nhắc nhở: Sắp đến hạn trả sách (còn 2 ngày)";
  } else if (daysUntilReturn === 1) {
    emailSubject = "Cảnh báo: Ngày mai là hạn cuối trả sách";
  } else if (daysUntilReturn <= 0) {
    emailSubject = `Cảnh báo: Bạn đã quá hạn mượn sách ${Math.abs(daysUntilReturn)} ngày`;
  }

  if (emailSubject) {
    const emailContent = `
      Kính gửi ${transaction.User.username},
      
      ${emailSubject} cho cuốn sách "${transaction.Book.title}".
      Ngày hẹn trả: ${transaction.return_date}
      
      Vui lòng trả sách đúng hạn để tránh và giảm thiểu các hình thức xử phạt.
      
      Trân trọng,
      Thư viện Đại Học Khoa Học Huế
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: transaction.User.email,
      subject: emailSubject,
      text: emailContent
    });
  }
};

const checkAndSendEmails = async (transactions, currentDate) => {
  try {
    for (const transaction of transactions) {
      const returnDate = new Date(transaction.return_date);
      const daysUntilReturn = Math.ceil((returnDate - currentDate) / (1000 * 60 * 60 * 24));
      
      if (daysUntilReturn <= 3 || daysUntilReturn <= 0) {
        await sendEmailNotification(transaction, daysUntilReturn);
      }
    }
    return true;
  } catch (error) {
    console.error("Error sending emails:", error);
    return false;
  }
};
const returnBookTemplate = (userData) => {
  const { username, bookTitle, status, returnDate } = userData;
  
  return {
    subject: "Xác nhận trả sách thành công",
    content: `
      Kính gửi ${username},
      
      Thông báo: Bạn đã ${status === 'Quá hạn' ? 'nộp phạt và trả sách' : 'trả sách'} thành công!
      Sách: ${bookTitle}
      Ngày trả: ${returnDate}
      
      Cảm ơn bạn đã sử dụng dịch vụ của thư viện.
      
      Trân trọng,
      Thư viện Đại Học Khoa Học Huế
    `
  };
};

module.exports = { 
  checkAndSendEmails,
  returnBookTemplate,
  transporter,
};