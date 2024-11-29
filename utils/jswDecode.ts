import { jwtDecode } from "jwt-decode";
interface JWTPayload {
  //Los datos del JWT
}
export const getUserIdFromJWT = async (): Promise<string | null> => {
  try {
    const token = await localStorage.getItem("userToken");
    if (token) {
      const decoded = jwtDecode<JWTPayload>(token);
      return decoded. || null;
    }
    return null;
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return null;
  }
};
