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
  let icon = '';
  let color = '';
  
  if (daysUntilReturn === 3) {
    icon = '⚠️';
    color = '#FFA500'; // Orange
    emailSubject = `${icon} Nhắc nhở: Sắp đến hạn trả sách (còn 3 ngày)`;
  } else if (daysUntilReturn === 2) {
    icon = '⚠️';
    color = '#FFA500';
    emailSubject = `${icon} Nhắc nhở: Sắp đến hạn trả sách (còn 2 ngày)`;
  } else if (daysUntilReturn === 1) {
    icon = '⚠️';
    color = '#FF4500'; // OrangeRed
    emailSubject = `${icon} Cảnh báo: Ngày mai là hạn cuối trả sách`;
  } else if (daysUntilReturn <= 0) {
    icon = '⏰';
    color = '#FF0000'; // Red
    emailSubject = `${icon} Cảnh báo: Bạn đã quá hạn mượn sách ${Math.abs(daysUntilReturn)} ngày`;
  }

  if (emailSubject) {
    const emailContent = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
        <div style="text-align: center; padding: 20px; background-color: ${color}; color: white; border-radius: 8px 8px 0 0;">
          <div style="font-size: 64px; margin-bottom: 20px; display: block;">${icon}</div>
          <h2 style="font-size: 24px; margin: 0;">${emailSubject.replace(icon, '').trim()}</h2>
        </div>
        
        <div style="background-color: white; padding: 20px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <p style="font-size: 18px; margin-bottom: 20px;">Kính gửi <strong>${transaction.User.username}</strong>,</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0; font-size: 16px; line-height: 1.6;">
            <p style="margin: 10px 0;"><strong style="font-size: 18px; color: #333;">Thông tin sách:</strong></p>
            <p style="margin: 10px 0;">Tên sách: <strong style="font-size: 18px; color: #333;">${transaction.Book.title}</strong></p>
            <p style="margin: 10px 0;">Ngày hẹn trả: <strong style="font-size: 18px; color: #333;">${transaction.return_date}</strong></p>
          </div>
          
          <p style="font-size: 20px; color: #d32f2f; margin-top: 20px; font-weight: bold;">
            Vui lòng trả sách đúng hạn để tránh và giảm thiểu các hình thức xử phạt.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #666; font-size: 17px;">Trân trọng,</p>
          <p style="color: #1a237e; font-size: 22px; font-weight: bold; margin-top: 10px;">
            Thư viện Đại Học Khoa Học Huế
          </p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: transaction.User.email,
      subject: emailSubject,
      html: emailContent
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
  const icon = '✅';
  
  return {
    subject: `${icon} Xác nhận trả sách thành công`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
        <div style="text-align: center; padding: 20px; background-color: #4CAF50; color: white; border-radius: 8px 8px 0 0;">
          <div style="font-size: 64px; margin-bottom: 20px; display: block;">${icon}</div>
          <h2 style="font-size: 24px; margin: 0;">Xác nhận trả sách thành công</h2>
        </div>
        
        <div style="background-color: white; padding: 20px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <p style="font-size: 18px; margin-bottom: 20px;">Kính gửi <strong>${username}</strong>,</p>
          
          <div style="background-color: #e8f5e9; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #4CAF50;">
            <p style="margin: 10px 0; font-size: 18px;">Thông báo: <strong>Bạn đã ${status === 'Quá hạn' ? 'nộp phạt và trả sách' : 'trả sách'} thành công!</strong></p>
            <p style="margin: 10px 0; font-size: 18px;">Sách: <strong style="font-size: 18px; color: #333;">${bookTitle}</strong></p>
            <p style="margin: 10px 0; font-size: 18px;">Ngày trả: <strong style="font-size: 18px; color: #333;">${returnDate}</strong></p>
          </div>
          
          <p style="font-size: 16px; color: #666;">Cảm ơn bạn đã sử dụng dịch vụ của thư viện.</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #666; font-size: 17px;">Trân trọng,</p>
          <p style="color: #1a237e; font-size: 22px; font-weight: bold; margin-top: 10px;">
            Thư viện Đại Học Khoa Học Huế
          </p>
        </div>
      </div>
    `
  };
};

module.exports = { 
  checkAndSendEmails,
  returnBookTemplate,
  transporter,
};