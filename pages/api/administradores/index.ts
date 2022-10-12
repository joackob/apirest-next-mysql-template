import type { NextApiRequest, NextApiResponse } from "next";
import { repoAdmins } from "@/lib/RepoAdmins";
import { Administrador } from "@/lib/entity/Administrador";

type GetAdminsResponse = {
  admins: Administrador[];
};

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
  res: NextApiResponse<GetAdminsResponse>
) => {
  const admins = await repoAdmins.findAll();
  res.status(200).json({
    admins,
  });
};
