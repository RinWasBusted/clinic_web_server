# 📚 Hướng dẫn sử dụng Swagger Documentation

## Giới thiệu
Project này sử dụng **Swagger/OpenAPI 3.0** để tạo API documentation tự động từ JSDoc comments trong code.

## Truy cập Swagger UI

Sau khi start server, truy cập:
- **Swagger UI**: http://localhost:9999/api-docs
- **Swagger JSON**: http://localhost:9999/api-docs.json

## Cấu trúc tổ chức

### 1. File cấu hình chính: `src/swagger.ts`

File này chứa:
- **OpenAPI definition**: Thông tin cơ bản về API (title, version, description)
- **Servers**: Danh sách các server (development, production)
- **Components**: Schemas, Security schemes dùng chung
- **Tags**: Nhóm các API endpoints theo category

### 2. JSDoc Comments trong Controllers

Mỗi controller function cần có comment block theo format YAML:

```typescript
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Mô tả ngắn gọn
 *     description: Mô tả chi tiết
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success response
 */
export const loginUser = async (req: Request, res: Response) => {
  // implementation
}
```

## Cấu trúc JSDoc Comment

### Path và HTTP Method
```yaml
/api/auth/login:    # Đường dẫn API
  post:             # HTTP method (get, post, put, delete, patch)
```

### Thông tin cơ bản
```yaml
summary: Login to the system              # Mô tả ngắn (hiển thị trong list)
description: Authenticate user...         # Mô tả chi tiết
tags: [Authentication]                    # Nhóm API (có thể có nhiều tags)
```

### Request Body
```yaml
requestBody:
  required: true                          # Bắt buộc hay không
  content:
    application/json:                     # Content type
      schema:
        type: object
        required:                          # Các field bắt buộc
          - email
          - password
        properties:
          email:
            type: string
            format: email                  # Validation format
            description: User's email
            example: user@example.com      # Giá trị mẫu
          password:
            type: string
            minLength: 6                   # Validation rules
```

### Query Parameters
```yaml
parameters:
  - name: page                            # Tên parameter
    in: query                             # Vị trí: query, path, header, cookie
    required: false
    schema:
      type: integer
      default: 1
    description: Page number
```

### Path Parameters
```yaml
/api/users/{id}:
  get:
    parameters:
      - name: id
        in: path
        required: true
        schema:
          type: integer
        description: User ID
```

### Headers
```yaml
parameters:
  - name: X-API-Key
    in: header
    required: true
    schema:
      type: string
```

### Responses
```yaml
responses:
  200:                                    # HTTP status code
    description: Success message
    content:
      application/json:
        schema:
          type: object
          properties:
            message:
              type: string
              example: Login successful
            data:
              type: object
  400:
    description: Bad request
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/Error'    # Dùng schema có sẵn
```

### Security (Authentication)
```yaml
security:
  - bearerAuth: []                        # Dùng JWT Bearer token
  - cookieAuth: []                        # Dùng cookie
```

## Data Types trong Schema

### Primitive Types
```yaml
type: string       # Chuỗi
type: number       # Số (float)
type: integer      # Số nguyên
type: boolean      # True/False
type: array        # Mảng
type: object       # Object
```

### String Formats
```yaml
format: date          # YYYY-MM-DD
format: date-time     # ISO 8601
format: email         # Email address
format: uri           # URL
format: uuid          # UUID
format: password      # Password field (ẩn giá trị)
```

### Arrays
```yaml
type: array
items:
  type: string
# Hoặc
items:
  $ref: '#/components/schemas/User'
```

### Objects
```yaml
type: object
properties:
  id:
    type: integer
  name:
    type: string
```

## Reusable Components

### Định nghĩa trong swagger.ts
```typescript
components: {
  schemas: {
    User: {
      type: "object",
      properties: {
        id: { type: "integer" },
        name: { type: "string" }
      }
    },
    Error: {
      type: "object",
      properties: {
        message: { type: "string" }
      }
    }
  }
}
```

### Sử dụng trong controller
```yaml
schema:
  $ref: '#/components/schemas/User'
```

## Best Practices

### 1. Tổ chức theo modules
```
src/
  features/
    auth/
      auth.controller.ts    # Chứa @swagger comments
      auth.route.ts
      auth.service.ts
    users/
      users.controller.ts   # Chứa @swagger comments
      users.route.ts
```

### 2. Sử dụng Tags để nhóm APIs
```yaml
tags: [Authentication]
tags: [Users]
tags: [Appointments]
```

### 3. Định nghĩa schemas chung trong swagger.ts
- Error schemas
- Common response formats
- Reusable entities (User, Doctor, Patient, etc.)

### 4. Security Schemes
```typescript
components: {
  securitySchemes: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT"
    }
  }
}
```

### 5. Examples đầy đủ
```yaml
example: user@example.com    # Single example
examples:                    # Multiple examples
  user1:
    value: user1@example.com
  user2:
    value: user2@example.com
```

## Validation Rules trong Schema

```yaml
properties:
  email:
    type: string
    format: email
    pattern: '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$'
  age:
    type: integer
    minimum: 0
    maximum: 150
  name:
    type: string
    minLength: 3
    maxLength: 50
  status:
    type: string
    enum: [active, inactive, pending]
  items:
    type: array
    minItems: 1
    maxItems: 10
```

## Testing APIs trong Swagger UI

1. Click vào endpoint muốn test
2. Click "Try it out"
3. Nhập parameters/body
4. Click "Execute"
5. Xem response

### Authenticate trong Swagger UI
1. Click nút "Authorize" ở góc trên
2. Nhập token: `Bearer <your_token>`
3. Click "Authorize"
4. Bây giờ có thể test các protected endpoints

## Troubleshooting

### Swagger không hiển thị APIs
- Kiểm tra path trong `apis` array của swagger.ts
- Đảm bảo file có extension `.ts` hoặc `.js`
- Check syntax của JSDoc comments

### Schema validation errors
- Đảm bảo indentation đúng (dùng spaces, không dùng tabs)
- Check closing brackets
- Validate YAML syntax

### Không load được swagger-ui
- Check console logs
- Verify swagger-jsdoc và swagger-ui-express đã được install
- Kiểm tra setupSwagger() được gọi trong index.ts

## Ví dụ đầy đủ

Xem file [src/features/auth/auth.controller.ts](src/features/auth/auth.controller.ts) để tham khảo các ví dụ đầy đủ về:
- POST request với body
- GET request với authentication
- Response schemas
- Error handling
- Security schemes

## Tài liệu tham khảo

- [OpenAPI 3.0 Specification](https://swagger.io/specification/)
- [Swagger JSDoc](https://github.com/Surnet/swagger-jsdoc)
- [Swagger UI Express](https://github.com/scottie1984/swagger-ui-express)
