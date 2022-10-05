import { RepoTurnos } from "../lib/RepoTurnos";
import { RepoDonadores } from "../lib/RepoDonador";

describe("Testing CRUD operations in RepoDonadores", () => {
  const repoTurns = new RepoTurnos();
  const repoDonors = new RepoDonadores();
  const dataToTest: {
    idTurn?: string;
    fecha: string;
    idDono?: string;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
  } = {
    fecha: new Date().toISOString().slice(0, 19).replace("T", " "),
    nombre: "Juan",
    apellido: "Suarez",
    email: "jsuarez@etec.uba.ar",
    telefono: "1112345678",
  };

  beforeAll(async () => {
    const result = await repoTurns.reserve({
      nombre: dataToTest.nombre,
      apellido: dataToTest.apellido,
      email: dataToTest.email,
      telefono: dataToTest.telefono,
      fecha: dataToTest.fecha,
    });
    dataToTest.idTurn = result.turnID;
    dataToTest.idDono = result.donorID;
  });

  afterAll(async () => {
    return repoTurns.destroy();
  });

  test("Deberia existir un donador asociado a un turno", async () => {
    const donor = await repoDonors.find({ id: dataToTest.idDono ?? "" });
    expect(donor?.nombre).toEqual("Juan");
  });
});
