export const facultySchema = {
    type: "object",
    properties: {
        name: { type: "string", example: "Faculty of Medicine" },
        description: { type: "string", example: "The Faculty of Medicine is responsible for training medical professionals and conducting research in the field of healthcare." },
    },
    required: ["name", "description"],
};
export const parameterIdSchema = {
    type: "object",
    properties: {
        id: { type: "string", format: "uuid", example: "550e8400-e29b-41d4-a716-446655440000" },
    },
    required: ["id"],
};