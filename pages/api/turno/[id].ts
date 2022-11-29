import type { NextApiRequest, NextApiResponse } from "next";
import { repoTurnos } from "@/lib/RepoTurnos";

type GetTurnResponse = {
  id?: number;
  fecha?: Date;
  donador?: {
    url?: string;
  };
  url: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  try {
    switch (method) {
      case "DELETE":
        await deleteTurn(req, res);
        break;
      case "PUT":
        await updateTurn(req, res);
        break;
      case "GET":
        await getTurn(req, res);
        break;
      default:
        res.status(405).json({});
        break;
    }
  } catch (error) {
    console.log(typeof error);
    res.status(400).json({});
  }
}

const deleteTurn = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = Number(req.query.id);
  const resultDelete = await repoTurnos.deleteByID({ id });
  res.status(resultDelete.wasRemoved ? 204 : 404).json({});
};

const updateTurn = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = Number(req.query.id);
  const resultUpdate = await repoTurnos.updateByID({ id, ...req.body });
  res.status(resultUpdate.wasUpdated ? 204 : 404).json({});
};

const getTurn = async (
  req: NextApiRequest,
  res: NextApiResponse<GetTurnResponse>
) => {
  const id = Number(req.query.id);
  const turn = await repoTurnos.findByID({ id });
  const statusCode = turn ? 200 : 404;
  const response = {
    id: turn?.id,
    fecha: turn?.fecha,
    donador: {
      url: `${process.env.URLAPI}/donador/${turn?.donador.id}`,
    },
    url: `${process.env.URLAPI}/turno/${turn?.id}`,
  };
  res.status(statusCode).json(response);
};
