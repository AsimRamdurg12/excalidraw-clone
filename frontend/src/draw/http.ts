import axios from "axios";

export async function getExistingShapes(roomId: string) {
  try {
    const response = await axios.get(
      `http://localhost:3001/api/shapes/room/${roomId}`
    );
    const message = await response.data.message;

    const shapes = message.map((x: { shape: string }) => {
      const messageData = JSON.parse(JSON.stringify(x.shape));

      return messageData;
    });

    console.log(shapes);

    return shapes;
  } catch (error) {
    console.error(`Error in FE getExistingShapes: ${error}`);
  }
}
