import type { NextApiRequest, NextApiResponse } from "next";
import { repoAdmin } from "@/lib/RepoAdmin";

type Data = {
  id?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method } = req;
  res.setHeader("Content-Type", "aplication/json");
  switch (method) {
    case "POST":
      await createAdmin(req, res);
      break;

    default:
      res.status(405).json({});
      break;
  }
}

const createAdmin = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    const { nombre, apellido, email } = req.body;
    const admin = await repoAdmin.save({ nombre, apellido, email });
    res.status(200).json({ id: admin.id });
  } catch (error) {
    console.log(typeof error);
    res.status(400).json({});
  }
};
