import type { NextApiRequest, NextApiResponse } from "next";
import { repoAdmins } from "@/lib/RepoAdmins";

type GetAdminResponse = {
  id?: number;
  nombre?: string;
  apellido?: string;
  email?: string;
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
  const resultDelete = await repoAdmins.deleteByID({ id });
  res.status(resultDelete.wasRemoved ? 204 : 404).json({});
};

const updateAdmin = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = Number(req.query.id);
  const resultUpdate = await repoAdmins.updateByID({ id, ...req.body });
  res.status(resultUpdate.wasUpdated ? 204 : 404).json({});
};

const getAdmin = async (
  req: NextApiRequest,
  res: NextApiResponse<GetAdminResponse>
) => {
  const id = Number(req.query.id);
  const admin = await repoAdmins.findByID({ id });
  const statusCode = admin ? 200 : 404;
  const response = {
    ...admin,
    url: `${process.env.APIURL}/administrador/${id}`,
  };
  res.status(statusCode).json(response);
};
