import type { NextApiRequest, NextApiResponse } from "next";
import { repoDonadores } from "@/lib/RepoDonadores";
import { ResultSave } from "@/lib/types/TypesResult";

interface DonorApiRequest extends NextApiRequest {
  body: {
    nombre: string;
    apellido: string;
    dni: string;
    email: string;
    telefono: string;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("Content-Type", "aplication/json");
  const { method } = req;

  try {
    switch (method) {
      case "POST":
        await createAdmin(req, res);
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

const createAdmin = async (
  req: DonorApiRequest,
  res: NextApiResponse<ResultSave>
) => {
  const donor = await repoDonadores.save(req.body);
  res
    .status(201)
    .setHeader("Location", `${process.env.APIURL}/donador/${donor.id}`)
    .json(donor);
};
