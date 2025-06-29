import { api } from "../lib/axios";

export async function getExistingShapes(roomId: string) {
  try {
    const response = await api.get(
      `http://localhost:3001/api/shapes/room/${roomId}`
    );
    const message = await response.data.message;

    const shapes = message.map((x: string) => {
      const messageData = JSON.parse(JSON.stringify(x));

      return messageData;
    });

    return shapes;
  } catch (error) {
    console.error(`Error in FE getExistingShapes: ${error}`);
  }
}
