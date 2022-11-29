import type { NextApiRequest, NextApiResponse } from "next";
import { repoDonadores } from "@/lib/RepoDonadores";

type GetDonorResponse = {
  id?: number;
  nombre?: string;
  apellido?: string;
  dni?: string;
  email?: string;
  telefono?: string;
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
  const id = Number(req.query.id);
  const resultDelete = await repoDonadores.deleteByID({ id });
  res.status(resultDelete.wasRemoved ? 204 : 404).json({});
};

const updateAdmin = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = Number(req.query.id);
  const resultUpdate = await repoDonadores.updateByID({ id, ...req.body });
  res.status(resultUpdate.wasUpdated ? 204 : 404).json({});
};

const getAdmin = async (
  req: NextApiRequest,
  res: NextApiResponse<GetDonorResponse>
) => {
  const id = Number(req.query.id);
  const donor = await repoDonadores.findByID({ id });
  const statusCode = donor ? 200 : 404;
  const response = {
    ...donor,
    url: `${process.env.APIURL}/donador/${id}`,
  };
  res.status(statusCode).json(response);
};
