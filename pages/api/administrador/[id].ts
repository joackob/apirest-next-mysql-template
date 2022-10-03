import type { NextApiRequest, NextApiResponse } from "next";
import { repoAdmin } from "@/lib/RepoAdmin";

type DataAdmin = {
  id?: string;
  nombre?: string;
  apellido?: string;
  email?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DataAdmin>
) {
  const { method } = req;
  res.setHeader("Content-Type", "aplication/json");
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
}

const deleteAdmin = async (
  req: NextApiRequest,
  res: NextApiResponse<DataAdmin>
) => {
  try {
    const id = req.query.id?.toString() ?? "";
    const resultDelete = await repoAdmin.delete({ id });
    res.status(resultDelete.affected ? 200 : 404).json({});
  } catch (error) {
    console.log(typeof error);
    res.status(400).json({});
  }
};

const updateAdmin = async (
  req: NextApiRequest,
  res: NextApiResponse<DataAdmin>
) => {
  try {
    const id = req.query.id?.toString() ?? "";
    const resultUpdate = await repoAdmin.update({ id, ...req.body });
    res.status(resultUpdate.affected ? 200 : 404).json({});
  } catch (error) {
    console.log(typeof error);
    res.status(400).json({});
  }
};

const getAdmin = async (
  req: NextApiRequest,
  res: NextApiResponse<DataAdmin>
) => {
  try {
    const id = req.query.id?.toString() ?? "";
    const admin = await repoAdmin.find({ id });
    res.status(200).json({ id, ...admin });
  } catch (error) {
    console.log(typeof error);
    res.status(400).json({});
  }
};
