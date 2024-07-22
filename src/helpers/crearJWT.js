import jwt from "jsonwebtoken";

const generarJWT = (id, rol) => {
    // Genera un token JWT con el payload { id, rol }
    // utilizando la clave secreta definida en process.env.JWT_SECRET
    // y configurando su expiración en 1 día (1d).
    return jwt.sign({ id, rol }, process.env.JWT_SECRET, { expiresIn: "1d" });
}

export default generarJWT;
