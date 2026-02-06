import { Request, Response } from "express";
import { registerUser as registerUserService, isEmailExist, verifyUserEmail, loginUser as loginUserService, createRefeshToken, checkRefreshToken, deleteRefreshToken } from "./auth.service.js";
import resend from "../../emails/resend.js";
import {JwtService} from "../../jwtService.js"; 
import { registerSchema, loginSchema } from "./auth.schema.js";

export const loginUser = async (req: Request, res: Response) => {
  const validation = loginSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ message: "Validation error", errors: validation.error.flatten().fieldErrors });
  }
  const { email, password } = validation.data;
  
  try {
    const user = await loginUserService(email, password);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const accessToken = JwtService.generateToken({ id: user.id, role: user.role }, 60 * 15); 
    const refreshToken = JwtService.generateToken({ id: user.id, role: user.role }, 60 * 60 * 24 * 7);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, //Remember to set to true in production
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    createRefeshToken(user.id, user.role, refreshToken, 7 * 24 * 60 * 60);

    return res.status(200).json({ message: "Login successful", accessToken });
  } catch {
    return res.status(500).json({ message: "Error logging in user" });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  const validation = registerSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ message: "Validation error", errors: validation.error.flatten().fieldErrors });
  }

  const { fullname, email, password } = validation.data;
  const emailExists = await isEmailExist(email);
  if (emailExists) {
    return res.status(400).json({ message: "Email already in use" });
  }
  const newUser = await registerUserService(fullname, email, password);
  if(!newUser) {
    return res.status(500).json({ message: "Error registering user" });
  }

  const emailVerificationToken = JwtService.generateToken({id: newUser.id, purpose: "email_verification"}, 24 * 60 * 60); 
  const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${emailVerificationToken}`;

// send verification email
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Email Verification",
      html: `<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f9; color: #333;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        <tr>
            <td style="padding: 30px; text-align: center; background-color: #0056b3;">
                <h1 style="margin: 0; color: #ffffff; font-size: 24px; text-transform: uppercase; letter-spacing: 1px;">Clinic Web System</h1>
            </td>
        </tr>
        
        <tr>
            <td style="padding: 40px 30px;">
                <h2 style="margin: 0 0 20px; color: #0056b3; font-size: 20px;">Xác thực địa chỉ Email của bạn</h2>
                <p style="line-height: 1.6; font-size: 16px; color: #555;">Chào bạn,</p>
                <p style="line-height: 1.6; font-size: 16px; color: #555;">Cảm ơn bạn đã đăng ký tài khoản tại hệ thống quản lý phòng mạch của chúng tôi. Để hoàn tất quá trình đăng ký và bảo mật thông tin y tế, vui lòng nhấn vào nút bên dưới để xác thực email:</p>
                
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 30px; margin-bottom: 30px;">
                    <tr>
                        <td align="center">
                            <a href="${verificationLink}" style="background-color: #28a745; color: #ffffff; padding: 15px 35px; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 5px; display: inline-block;">XÁC THỰC NGAY</a>
                        </td>
                    </tr>
                </table>
                
                <p style="line-height: 1.6; font-size: 14px; color: #888;">Nếu nút trên không hoạt động, bạn có thể copy và dán đường dẫn này vào trình duyệt:</p>
                <p style="line-height: 1.6; font-size: 14px; color: #0056b3; word-break: break-all;">${verificationLink}</p>
                
                <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
                
                <p style="line-height: 1.6; font-size: 14px; color: #555;"><strong>Lưu ý:</strong> Liên kết này sẽ hết hạn trong vòng 24 giờ để đảm bảo an toàn cho dữ liệu của bạn.</p>
            </td>
        </tr>
        
        <tr>
            <td style="padding: 20px; text-align: center; background-color: #f8f9fa; color: #999; font-size: 12px;">
                <p style="margin: 5px 0;">© 2026 Clinic Web Server. Tất cả quyền được bảo lưu.</p>
                <p style="margin: 5px 0;">Địa chỉ: 03-05 đường số 2, P. Tam Bình, TP. Hồ Chí Minh</p>
                <p style="margin: 5px 0;">Hotline: 0868695780</p>
            </td>
        </tr>
    </table>
</body>`,
    });
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
  
  return res.status(201).json({ message: "User registered", user: newUser });
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.body;
  const payload = JwtService.verifyToken(token);
  if(!payload || payload.purpose !== "email_verification") {
    return res.status(400).json({message: "Invalid or expired token"});
  }
  const userId = payload.id;
  try {
    await verifyUserEmail(userId);
    return res.status(200).json({message: "Email verified successfully"});
  } catch {
    return res.status(500).json({message: "Error verifying email"});
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken as string;
  if(!refreshToken) {
    return res.status(401).json({message: "Refresh token missing"});
  }
  try {
    const payload = JwtService.verifyToken(refreshToken);
    if(!payload) {
      return res.status(401).json({message: "Invalid refresh token"});
    }
    const user = await checkRefreshToken(refreshToken);
    if(!user) {
      return res.status(401).json({message: "Refresh token not found"});
    }
    const newAccessToken = JwtService.generateToken({id: payload.id, role: payload.role}, 60 * 15); 
    return res.status(200).json({accessToken: newAccessToken});
    } catch {
      return res.status(401).json({message: "Invalid or expired refresh token"});
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken as string;
  if(refreshToken) {
    await deleteRefreshToken(refreshToken);
  }
  res.clearCookie("refreshToken");
  return res.status(200).json({message: "Logged out successfully"});
}