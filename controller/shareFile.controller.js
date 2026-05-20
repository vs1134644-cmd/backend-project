const shareModel = require("../model/share.model");
const nodemailer = require("nodemailer");

const conn = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const getTemplateEmail = () => {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>File Download</title>

    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f3f4f6;
        font-family: Arial, sans-serif;
      }

      .container {
        width: 100%;
        padding: 40px 0;
      }

      .card {
        max-width: 600px;
        margin: auto;
        background: #ffffff;
        border-radius: 14px;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      }

      .header {
        background: linear-gradient(135deg, #16a34a, #15803d);
        padding: 35px;
        text-align: center;
        color: white;
      }

      .header h1 {
        margin: 0;
        font-size: 28px;
      }

      .content {
        padding: 35px;
        color: #374151;
      }

      .content h2 {
        margin-top: 0;
        color: #111827;
      }

      .file-box {
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 10px;
        padding: 20px;
        margin: 25px 0;
      }

      .file-name {
        font-size: 18px;
        font-weight: 600;
        color: #111827;
        margin-bottom: 10px;
      }

      .file-info {
        font-size: 14px;
        color: #6b7280;
      }

      .download-btn {
        display: inline-block;
        margin-top: 25px;
        background: #16a34a;
        color: white !important;
        text-decoration: none;
        padding: 14px 28px;
        border-radius: 8px;
        font-weight: bold;
        font-size: 15px;
      }

      .footer {
        text-align: center;
        padding: 20px;
        font-size: 13px;
        color: #9ca3af;
        border-top: 1px solid #e5e7eb;
      }

      @media screen and (max-width: 600px) {
        .content {
          padding: 24px;
        }

        .header {
          padding: 28px;
        }

        .header h1 {
          font-size: 22px;
        }
      }
    </style>
  </head>

  <body>
    <div class="container">
      <div class="card">
        <div class="header">
          <h1>Your File is Ready</h1>
        </div>

        <div class="content">
          <h2>Hello John 👋</h2>

          <p>
            Your requested file has been successfully processed and is now
            ready for download.
          </p>

          <div class="file-box">
            <div class="file-name">Project-Documents.zip</div>

            <div class="file-info">
              File Size: 24 MB <br />
              Format: ZIP Archive
            </div>
          </div>

          <a href="https://yourdomain.com/download/file-id"
             class="download-btn">
            Download File
          </a>

          <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
            If the button does not work, copy and paste this link into your
            browser:
          </p>

          <p style="word-break: break-all; font-size: 14px;">
            https://yourdomain.com/download/file-id
          </p>
        </div>

        <div class="footer">
          © 2026 Your Company. All rights reserved.
        </div>
      </div>
    </div>
  </body>
</html>
  `;
};

const shareFile = async (req, res) => {
  try {
    const { email, file } = req.body;

    const options = {
      form: process.env.SMTP_EMAIL,
      to: email,
      subject: "File Share !",
      html: getTemplateEmail(),
    };

    await conn.sendMail(options);
    res.status(200).json({ message: "Email sent..." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  shareFile,
};
