import type { NextApiRequest, NextApiResponse } from "next";
import { repoDonadores } from "@/lib/RepoDonadores";

type GetDonorsResponse = {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  telefono: string;
  url: string;
}[];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("Content-Type", "aplication/json");
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
        await getAdmins(req, res);
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
const getAdmins = async (
  req: NextApiRequest,
  res: NextApiResponse<GetDonorsResponse>
) => {
  const donors = await repoDonadores.findAll();
  const response = donors.map((donor) => ({
    ...donor,
    url: `${process.env.APIURL}/donador/${donor.id}`,
  }));
  res.status(200).json(response);
};
