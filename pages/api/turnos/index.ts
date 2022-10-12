import { NextApiRequest, NextApiResponse } from "next";
import { repoTurnos } from "@/lib/RepoTurnos";
import { Turno } from "@/lib/entity/Turno";

type GetTurnsAvailableResponse = {
  turns: Date[];
};

type GetTurnsBookedResponse = {
  turns: Turno[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("Content-Type", "aplication/json");
  const { method } = req;
  try {
    switch (method) {
      case "HEAD":
        res.status(200).end();
        break;
      case "GET":
        await getTurns(req, res);
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

const getTurns = async (req: NextApiRequest, res: NextApiResponse) => {
  const { estado } = req.query;
  switch (estado) {
    case "disponible":
      await getTurnsAvailable(req, res);
      break;
    case "reservado":
      await getTurnsBooked(req, res);
      break;
    default:
      res.status(400).json({});
      break;
  }
};

const getTurnsAvailable = async (
  req: NextApiRequest,
  res: NextApiResponse<GetTurnsAvailableResponse>
) => {
  const date = req.query.fecha?.toString() ?? new Date().toLocaleString();
  const turnsAvailable = await repoTurnos.getAvailable({
    date: new Date(date),
  });
  const turns = turnsAvailable.map(({ fecha }) => fecha);
  res.status(200).json({ turns });
};

const getTurnsBooked = async (
  req: NextApiRequest,
  res: NextApiResponse<GetTurnsBookedResponse>
) => {
  const date = req.query.fecha?.toString() ?? new Date().toLocaleString();
  const turns = await repoTurnos.getBooked({ date: new Date(date) });
  res.status(200).json({ turns });
};
