import type { NextApiRequest, NextApiResponse } from "next";
import { repoAdmin } from "@/lib/RepoAdmin";

type PostDataResponse = {
  id: string;
};

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
  req: NextApiRequest,
  res: NextApiResponse<PostDataResponse>
) => {
  const { nombre, apellido, email } = req.body;
  const admin = await repoAdmin.save({ nombre, apellido, email });
  res
    .status(201)
    .setHeader("Location", `/administrador/${admin.id}`)
    .json({ id: admin.id });
};
