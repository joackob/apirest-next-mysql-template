import type { NextApiRequest, NextApiResponse } from "next";
import { repoAdmin } from "@/lib/RepoAdmin";

type Data = {
  admins?: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
  }[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method } = req;
  res.setHeader("Content-Type", "aplication/json");
  switch (method) {
    case "GET":
      await getAdmins(req, res);
      break;

    default:
      res.status(405).json({});
      break;
  }
}
const getAdmins = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    const admins = await repoAdmin.findAll();
    res.status(200).json({
      admins,
    });
  } catch (error) {
    console.log(typeof error);
    res.status(400).json({});
  }
};
