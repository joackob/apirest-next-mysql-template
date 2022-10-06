import type { NextApiRequest, NextApiResponse } from "next";
import { repoAdmins } from "@/lib/RepoAdmins";

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
  const resultDelete = await repoAdmins.deleteByID({ id });
  res.status(resultDelete.removed ? 204 : 404).json({});
};

const updateAdmin = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = req.query.id?.toString() ?? "";
  const resultUpdate = await repoAdmins.updateByID({ id, ...req.body });
  res.status(resultUpdate.updated ? 204 : 404).json({});
};

const getAdmin = async (
  req: NextApiRequest,
  res: NextApiResponse<GetDataResponse>
) => {
  const id = req.query.id?.toString() ?? "";
  const admin = await repoAdmins.findByID({ id });
  const statusCode = admin ? 404 : 200;
  res.status(statusCode).json(admin);
};
