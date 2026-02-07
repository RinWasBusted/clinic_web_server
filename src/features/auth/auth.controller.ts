import { Request, Response } from "express";
import { registerUser as registerUserService, isEmailExist, verifyUserEmail, loginUser as loginUserService, createRefeshToken, checkRefreshToken, deleteRefreshToken } from "./auth.service.js";
import resend from "../../emails/resend.js";
import {JwtService} from "../../jwtService.js"; 
import { registerSchema, loginSchema } from "./auth.schema.js";

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập hệ thống
 *     description: Xác thực người dùng bằng email và mật khẩu. Trả về access token trong response body và refresh token trong HTTP-only cookie.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Địa chỉ email của người dùng
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 description: Mật khẩu (tối thiểu 6 ký tự)
 *                 example: password123
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800
 *             description: Refresh token được lưu trong HTTP-only cookie (có hiệu lực 7 ngày)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 accessToken:
 *                   type: string
 *                   description: JWT access token có hiệu lực 15 phút
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlciI6InVzZXJAZXhhbXBsZS5jb20iLCJpYXQiOjE2MDk0NTkyMDB9.abc123
 *       400:
 *         description: Lỗi validation dữ liệu đầu vào
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Validation error
 *                 errors:
 *                   type: object
 *                   description: Chi tiết lỗi validation cho từng trường
 *                   example:
 *                     email: ["Invalid email address"]
 *                     password: ["Password must be at least 6 characters long"]
 *       401:
 *         description: Thông tin đăng nhập không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid email or password
 *       500:
 *         description: Lỗi server khi xử lý đăng nhập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error logging in user
 */
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

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     description: Tạo tài khoản người dùng mới và gửi email xác thực. Email xác thực sẽ chứa link có token hợp lệ trong 24 giờ.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullname
 *               - email
 *               - password
 *             properties:
 *               fullname:
 *                 type: string
 *                 minLength: 3
 *                 description: Họ và tên đầy đủ của người dùng
 *                 example: Nguyễn Văn A
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Địa chỉ email (phải là duy nhất trong hệ thống)
 *                 example: nguyenvana@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 description: Mật khẩu (tối thiểu 6 ký tự)
 *                 example: password123
 *     responses:
 *       201:
 *         description: Đăng ký thành công. Email xác thực đã được gửi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: ID người dùng
 *                       example: 1
 *                     fullname:
 *                       type: string
 *                       example: Nguyễn Văn A
 *                     email:
 *                       type: string
 *                       example: nguyenvana@example.com
 *                     role:
 *                       type: string
 *                       enum: [patient, doctor, admin]
 *                       example: patient
 *                       description: Vai trò của người dùng trong hệ thống
 *                     isVerified:
 *                       type: boolean
 *                       example: false
 *                       description: Trạng thái xác thực email (false khi mới đăng ký)
 *       400:
 *         description: Lỗi validation hoặc email đã tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Email already in use
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Validation error
 *                     errors:
 *                       type: object
 *                       example:
 *                         fullname: ["Fullname must be at least 3 characters long"]
 *                         email: ["Invalid email address"]
 *       500:
 *         description: Lỗi server khi tạo tài khoản
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error registering user
 */
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

/**
 * @swagger
 * /api/auth/verify-email:
 *   post:
 *     summary: Xác thực địa chỉ email
 *     description: Xác thực email của người dùng bằng token được gửi qua email. Token có hiệu lực trong 24 giờ.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: JWT token xác thực email (được gửi qua email sau khi đăng ký)
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicHVycG9zZSI6ImVtYWlsX3ZlcmlmaWNhdGlvbiIsImlhdCI6MTYwOTQ1OTIwMCwiZXhwIjoxNjA5NTQ1NjAwfQ.abc123
 *     responses:
 *       200:
 *         description: Email đã được xác thực thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email verified successfully
 *       400:
 *         description: Token không hợp lệ hoặc đã hết hạn
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid or expired token
 *                   description: Token có thể không hợp lệ, đã hết hạn, hoặc không phải là token xác thực email
 *       500:
 *         description: Lỗi server khi xác thực email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error verifying email
 */
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

/**
 * @swagger
 * /api/auth/refresh-token:
 *   get:
 *     summary: Làm mới access token
 *     description: Tạo access token mới bằng refresh token được lưu trong cookie. Refresh token có hiệu lực 7 ngày, access token mới có hiệu lực 15 phút.
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: cookie
 *         name: refreshToken
 *         required: true
 *         schema:
 *           type: string
 *         description: Refresh token được lưu tự động trong HTTP-only cookie khi đăng nhập
 *     responses:
 *       200:
 *         description: Access token mới được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: JWT access token mới có hiệu lực 15 phút
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6InBhdGllbnQiLCJpYXQiOjE2MDk0NTkyMDB9.xyz789
 *       401:
 *         description: Refresh token bị thiếu, không hợp lệ hoặc đã hết hạn
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                     - Refresh token missing
 *                     - Invalid refresh token
 *                     - Refresh token not found
 *                     - Invalid or expired refresh token
 *                   example: Refresh token missing
 *                   description: |
 *                     Các trường hợp lỗi:
 *                     - `Refresh token missing`: Cookie không chứa refresh token
 *                     - `Invalid refresh token`: Token không đúng định dạng JWT
 *                     - `Refresh token not found`: Token không tồn tại trong database (có thể đã bị xóa khi logout)
 *                     - `Invalid or expired refresh token`: Token hết hạn hoặc lỗi khi verify
 */
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

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Đăng xuất khỏi hệ thống
 *     description: Đăng xuất người dùng bằng cách xóa refresh token khỏi database và xóa cookie. Sau khi logout, access token hiện tại vẫn còn hiệu lực cho đến khi hết hạn (15 phút).
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: cookie
 *         name: refreshToken
 *         required: false
 *         schema:
 *           type: string
 *         description: Refresh token trong cookie (nếu có) sẽ được xóa khỏi database
 *     responses:
 *       200:
 *         description: Đăng xuất thành công. Cookie refreshToken đã được xóa.
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT
 *             description: Cookie refreshToken được xóa bằng cách set expires về quá khứ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 */
export const logoutUser = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken as string;
  if(refreshToken) {
    await deleteRefreshToken(refreshToken);
  }
  res.clearCookie("refreshToken");
  return res.status(200).json({message: "Logged out successfully"});
}