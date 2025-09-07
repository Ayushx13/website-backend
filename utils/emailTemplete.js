export const generateOTPEmailTemplate = (otp) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%);
            color: #ffffff;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            padding: 20px;
            text-align: center;
        }
        .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #1a73e8;
            letter-spacing: 8px;
            margin: 30px 0;
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 8px;
            border: 2px dashed #1a73e8;
            display: inline-block;
        }
        .expiry-text {
            color: #dc3545;
            font-size: 14px;
            margin-top: 15px;
            font-weight: bold;
        }
        .institute-name {
            color: #2c3e50;
            font-size: 24px;
            margin: 20px 0;
            font-weight: bold;
        }
        .message {
            color: #555;
            font-size: 16px;
            line-height: 1.6;
            margin: 20px 0;
        }
        .warning {
            background-color: #fff3cd;
            color: #856404;
            padding: 10px;
            border-radius: 4px;
            margin: 20px 0;
            font-size: 14px;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 12px;
        }
        .btn {
            display: inline-block;
            padding: 12px 25px;
            background-color: #1a73e8;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin:0;font-size:28px;">Email Verification</h1>
        </div>
        <div class="content">
            <div class="institute-name">IIT Dharwad Fresher Party 2025</div>
            <p class="message">Welcome! Please verify your email address to complete your registration.</p>
            <p class="message">Your verification code is:</p>
            <div class="otp-code">${otp}</div>
            <p class="expiry-text">⏰ This code will expire in 5 minutes</p>
            <div class="warning">
                If you did not request this verification code, please inform 
                <span style="color: #1a73e8; font-weight: bold;">Ayush Raj</span> at 
                <a href="mailto:is24bm003@iitdh.ac.in" style="color: #1a73e8; text-decoration: none; font-weight: bold;">is24bm003@iitdh.ac.in</a>
            </div>
            <p class="message">
                After verification, you'll be able to participate in the voting process.
                Make sure to verify your email within the time limit.
            </p>
        </div>
        <div class="footer">
            <p>This is an automated message, please do not reply.</p>
            <p>&copy; ${new Date().getFullYear()} IIT Dharwad Fresher Party | All rights reserved</p>
        </div>
    </div>
</body>
</html>
`;

