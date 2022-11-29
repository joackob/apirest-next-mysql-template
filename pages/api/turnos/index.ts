import { NextApiRequest, NextApiResponse } from "next";
import { repoTurnos } from "@/lib/RepoTurnos";

type GetTurnsAvailableResponse = Date[];

type GetTurnsBookedResponse = {
  id: number;
  fecha: Date;
  donador: {
    url: string;
  };
  url: string;
}[];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  try {
    switch (method) {
      case "OPTIONS":
        res.setHeader("Allow", "HEAD, GET ");
        res.status(200).end();
        break;
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
    console.log(error);
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
  const date = req.query.fecha?.toString() ?? new Date();
  const turnsAvailable = await repoTurnos.getAvailable({
    date: new Date(date),
  });
  const turns = turnsAvailable.map(({ fecha }) => fecha);
  res.status(200).json(turns);
};

const getTurnsBooked = async (
  req: NextApiRequest,
  res: NextApiResponse<GetTurnsBookedResponse>
) => {
  const date = req.query.fecha?.toString() ?? new Date();
  const turns = await repoTurnos.getBooked({ date: new Date(date) });
  const response = turns.map((turn) => ({
    id: turn.id,
    fecha: turn.fecha,
    donador: {
      url: `${process.env.URLAPI}/donador/${turn.donador.id}`,
    },
    url: `${process.env.URLAPI}/turno/${turn.id}`,
  }));
  res.status(200).json(response);
};
