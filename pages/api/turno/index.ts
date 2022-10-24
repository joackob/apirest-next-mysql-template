import type { NextApiRequest, NextApiResponse } from "next";
import { repoTurnos } from "@/lib/RepoTurnos";

type PostTurnResponse = {
  id?: number;
  url: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("Content-Type", "aplication/json");
  const { method } = req;

  try {
    switch (method) {
      case "OPTIONS":
        res.setHeader("Allow", "HEAD, GET, POST, PUT, DELETE");
        res.status(200).end();
        break;
      case "HEAD":
        res.status(200).end();
        break;
      case "POST":
        await createTurn(req, res);
        break;
      default:
        res.status(405).json({});
        break;
    }
  } catch (error) {
    console.log(typeof error);
    res.status(500).json({});
  }
}

const createTurn = async (
  req: NextApiRequest,
  res: NextApiResponse<PostTurnResponse>
) => {
  const booking = await repoTurnos.reserve({
    ...req.body,
    fecha: new Date(req.body.fecha),
  });

  const response = {
    id: booking.turnID,
    url: `${process.env.APIURL}/turno/${booking.turnID}`,
  };

  res
    .status(booking.wasReserved ? 201 : 400)
    .setHeader("Location", response.url)
    .json(response);
};
