import { RepoTurnos } from "../lib/RepoTurnos";

describe("Testing CRUD operations in RepoDonadores", () => {
  const repo = new RepoTurnos();
  const dataToTest: {
    id?: string;
    fecha: string;
    idDono?: string;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
  } = {
    fecha: "2022-12-12 13:00:00",
    nombre: "Juan",
    apellido: "Suarez",
    email: "jsuarez@etec.uba.ar",
    telefono: "1112345678",
  };

  beforeAll(async () => {
    const result = await repo.reserve({
      nombre: dataToTest.nombre,
      apellido: dataToTest.apellido,
      email: dataToTest.email,
      telefono: dataToTest.telefono,
      fecha: dataToTest.fecha,
    });
    dataToTest.id = result.turnID;
    dataToTest.idDono = result.donorID;
  });

  afterAll(async () => {
    return repo.destroy();
  });
});
