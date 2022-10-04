import type { NextApiRequest, NextApiResponse } from "next";
import { repoAdmin } from "@/lib/RepoAdmin";

type GetDataResponse = {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
} | null;

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
  const resultDelete = await repoAdmin.delete({ id });
  res.status(resultDelete.affected ? 204 : 404).json({});
};

const updateAdmin = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = req.query.id?.toString() ?? "";
  const resultUpdate = await repoAdmin.update({ id, ...req.body });
  res.status(resultUpdate.affected ? 204 : 404).json({});
};

const getAdmin = async (
  req: NextApiRequest,
  res: NextApiResponse<GetDataResponse>
) => {
  const id = req.query.id?.toString() ?? "";
  const admin = await repoAdmin.find({ id });
  const statusCode = admin ? 404 : 200;
  res.status(statusCode).json(admin);
};
