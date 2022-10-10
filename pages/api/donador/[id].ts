import type { NextApiRequest, NextApiResponse } from "next";
import { repoDonadores } from "@/lib/RepoDonadores";
import { Donador } from "@/lib/entity/Donador";

type GetDonorResponse = {
  donor: Donador | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("Content-Type", "aplication/json");
  const { method } = req;

  try {
    switch (method) {
      case "DELETE":
        await deleteAdmin(req, res);
        break;
      case "PUT":
        await updateAdmin(req, res);
        break;
      case "GET":
        await getAdmin(req, res);
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

const deleteAdmin = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = req.query.id?.toString() ?? "";
  const resultDelete = await repoDonadores.deleteByID({ id });
  res.status(resultDelete.wasRemoved ? 204 : 404).json({});
};

const updateAdmin = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = req.query.id?.toString() ?? "";
  const resultUpdate = await repoDonadores.updateByID({ id, ...req.body });
  res.status(resultUpdate.wasUpdated ? 204 : 404).json({});
};

const getAdmin = async (
  req: NextApiRequest,
  res: NextApiResponse<GetDonorResponse>
) => {
  const id = req.query.id?.toString() ?? "";
  const donor = await repoDonadores.findByID({ id });
  const statusCode = donor ? 200 : 404;
  res.status(statusCode).json({ donor });
};
