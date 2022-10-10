import type { NextApiRequest, NextApiResponse } from "next";
import { repoDonadores } from "@/lib/RepoDonadores";
import { Donador } from "@/lib/entity/Donador";

type GetDonorsResponse = {
  donors: Donador[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("Content-Type", "aplication/json");
  const { method } = req;
  try {
    switch (method) {
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
  res.status(200).json({ donors });
};
